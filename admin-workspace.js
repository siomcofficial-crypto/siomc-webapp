// Shared, read-only utilities for SiOMC staff pages.
// Database RLS remains the primary access-control boundary.
import { supabase } from './supabase.js';
import { renderAdminSidebar } from './admin-layout.js';

export const CLINICAL_ROLES = ['admin', 'doctor', 'nurse', 'dietitian'];

export const formatNumber = value => new Intl.NumberFormat('th-TH-u-nu-latn').format(value);

export function formatThaiDate(value, withTime = false) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('th-TH-u-nu-latn', {
    timeZone: 'Asia/Bangkok', day: 'numeric', month: 'short', year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {})
  }).format(date);
}

export function bangkokToday() {
  return new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10);
}

export function setMessage(id, message, tone = 'info') {
  const node = document.getElementById(id);
  if (!node) return;
  node.textContent = message;
  node.className = `workspace-message ${tone}`;
  node.hidden = !message;
}

export async function guardWorkspace(page, allowedRoles = CLINICAL_ROLES) {
  const gate = document.getElementById('accessMessage');
  const protectedSection = document.getElementById('workspace');
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      window.location.replace('./admin-login.html');
      return null;
    }
    const { data: profile, error: profileError } = await supabase
      .from('profiles').select('role, is_active, full_name')
      .eq('id', user.id).maybeSingle();
    if (profileError) throw profileError;
    if (!profile || profile.is_active !== true || !allowedRoles.includes(profile.role)) {
      if (gate) gate.textContent = 'บัญชีนี้ไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาติดต่อผู้ดูแลระบบ SiOMC';
      return null;
    }
    renderAdminSidebar(page, profile.role);
    if (gate) gate.hidden = true;
    if (protectedSection) protectedSection.hidden = false;
    return { user, profile };
  } catch (error) {
    console.error('SiOMC access validation failed:', error);
    if (gate) gate.textContent = 'ไม่สามารถตรวจสอบสิทธิ์ได้ กรุณารีเฟรชหรือติดต่อผู้ดูแลระบบ';
    return null;
  }
}

export function appendCell(row, value) {
  const cell = document.createElement('td');
  cell.textContent = String(value ?? '—');
  row.appendChild(cell);
  return cell;
}

export function emptyTable(tbody, columnCount, message) {
  tbody.replaceChildren();
  const row = document.createElement('tr');
  const cell = appendCell(row, message);
  cell.colSpan = columnCount;
  cell.className = 'workspace-empty';
  tbody.appendChild(row);
}

// Only active members are selectable for clinical review. Never expose system_admin
// patient-health data through a view or bypass: clinical pages exclude that role.
export async function fillActiveMemberSelect(select, search = '', isLatest = () => true) {
  const keyword = search.trim().replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '').slice(0, 80).trim();
  let query = supabase.from('members')
    .select('id, member_code, display_name')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(50);
  if (keyword) {
    query = query.or(`member_code.ilike.%${keyword}%,display_name.ilike.%${keyword}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  if (!isLatest()) return null;
  const selected = select.value;
  select.replaceChildren();
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '— เลือกสมาชิก —';
  select.appendChild(placeholder);
  for (const member of data || []) {
    const option = document.createElement('option');
    option.value = member.id;
    option.textContent = `${member.member_code} | ${member.display_name}`;
    select.appendChild(option);
  }
  if (Array.from(select.options).some(option => option.value === selected)) select.value = selected;
  else select.value = '';
  return data || [];
}

// No HTML template strings built from patient data. This chart uses textContent only.
export function drawBars(element, points, unit = 'kcal') {
  element.replaceChildren();
  const max = Math.max(1, ...points.map(point => Number(point.value) || 0));
  for (const item of points) {
    const group = document.createElement('div');
    group.className = 'workspace-bar-column';
    const value = document.createElement('span');
    value.className = 'workspace-bar-value';
    value.textContent = formatNumber(item.value);
    const track = document.createElement('div');
    track.className = 'workspace-bar-track';
    const bar = document.createElement('div');
    bar.className = 'workspace-bar';
    bar.style.height = `${Math.max(item.value > 0 ? 4 : 0, (item.value / max) * 100)}%`;
    track.appendChild(bar);
    const label = document.createElement('span');
    label.textContent = item.label;
    label.className = 'workspace-bar-label';
    group.append(value, track, label);
    element.appendChild(group);
  }
  element.setAttribute('aria-label', `พลังงานที่ผู้ป่วยบันทึกในแต่ละวัน หน่วย ${unit}`);
}

export function drawWeightLine(element, items) {
  element.replaceChildren();
  if (!items.length) return;
  const sorted = [...items].sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));
  const values = sorted.map(r => Number(r.weight_kg));
  const low = Math.floor(Math.min(...values) - 1);
  const high = Math.ceil(Math.max(...values) + 1);
  const w = 720, h = 250, left = 50, right = 16, top = 22, bottom = 35;
  const plotW = w - left - right, plotH = h - top - bottom;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `แนวโน้มน้ำหนัก ${sorted.length} รายการ จาก ${formatNumber(values[0])} ถึง ${formatNumber(values.at(-1))} กิโลกรัม`);
  svg.classList.add('workspace-weight-chart');
  const make = (tag, attrs, text) => {
    const item = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k,v]) => item.setAttribute(k, String(v)));
    if (text !== undefined) item.textContent = text;
    svg.appendChild(item);
    return item;
  };
  for (let i = 0; i <= 4; i++) {
    const v = low + (high - low) * i / 4;
    const y = top + plotH * (1 - i / 4);
    make('line', { x1: left, y1:y, x2:w-right, y2:y, stroke:'#e3edf2', 'stroke-width':1 });
    make('text', {x:left-10,y:y+5,'text-anchor':'end','font-size':12,fill:'#587488'}, v.toFixed(1));
  }
  const coords = sorted.map((row, i) => ({
    x: left + (sorted.length === 1 ? plotW / 2 : (i / (sorted.length - 1)) * plotW),
    y: top + (1 - (Number(row.weight_kg) - low) / (high - low)) * plotH
  }));
  if (coords.length > 1) make('polyline', { points:coords.map(p=>`${p.x},${p.y}`).join(' '), fill:'none', stroke:'#1c6484','stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round' });
  coords.forEach((p, i) => {
    make('circle', {cx:p.x, cy:p.y, r:4, fill:'#123d5a'});
    if (i === 0 || i === coords.length - 1) {
      make('text', {x:p.x,y:Math.max(13,p.y-11),'text-anchor':'middle','font-size':12,fill:'#123d5a'}, `${values[i].toFixed(1)}`);
    }
  });
  make('text', {x:left, y:h-7, 'font-size':12,fill:'#587488'}, formatThaiDate(sorted[0].recorded_at));
  make('text', {x:w-right, y:h-7, 'text-anchor':'end','font-size':12,fill:'#587488'}, formatThaiDate(sorted.at(-1).recorded_at));
  element.appendChild(svg);
}
