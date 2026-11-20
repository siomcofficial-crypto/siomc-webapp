
// SVG icons are rendered consistently on iOS, Android and desktop.
// No external icon fonts or JavaScript libraries are needed.
const SIOMC_SIDEBAR_PATHS = {
  admin: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  members: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  weight: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/><path d="M3 21h18"/>',
  nutrition: '<path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18"/><path d="M19 21V3c-4 2-5 7-5 11h5"/>',
  assessment: '<rect x="5" y="4" width="14" height="18" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M12 10v7M8.5 13.5h7"/>',
  learning: '<path d="M12 7v14M12 7c-2-2-5-3-9-3v14c4 0 7 1 9 3M12 7c2-2 5-3 9-3v14c-4 0-7 1-9 3"/>',
  careTeam: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2"/><path d="M17 8h5M19.5 5.5v5"/>',
  staff: '<circle cx="10" cy="7" r="4"/><path d="M3 21v-2a7 7 0 0 1 10-6.3"/><circle cx="18" cy="18" r="3"/><path d="M18 13v2M18 21v2M13 18h2M21 18h2"/>'
};
function siomcSidebarIcon(id) {
  const path = SIOMC_SIDEBAR_PATHS[id] || SIOMC_SIDEBAR_PATHS.admin;
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + path + '</svg>';
}
const SIOMC_MENU_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
const SIOMC_CLOSE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

export function renderAdminSidebar(activePage = "", role = "admin") {
  const menuItems = [
    { id: "admin", label: "ภาพรวม", icon: "▦", href: "admin.html" },
    { id: "members", label: "จัดการสมาชิก", icon: "♙", href: "members.html" },
    { id: "weight", label: "ติดตามน้ำหนัก", icon: "↗", href: "weight.html" },
    { id: "nutrition", label: "ติดตามโภชนาการ", icon: "◉", href: "nutrition.html" },
    { id: "assessment", label: "ประเมินทางคลินิก", icon: "✚", href: "assessment.html" },
    { id: "learning", label: "จัดการคลังความรู้", icon: "▤", href: "learning.html" },
    { id: "careTeam", label: "จัดการทีมรักษา", icon: "", href: "care-team.html" },
    { id: "staff", label: "จัดการเจ้าหน้าที่", icon: "♙", href: "staff.html" }
  ];

  // Navigation is convenience only; each page and database RLS verify access.

  const visibleItems = menuItems.filter(item => {


  // พักเมนูจัดการทีมรักษาไว้ก่อน
  if (item.id === 'careTeam') return false;

  if (role === 'system_admin')
    return ['admin', 'members', 'staff', 'careTeam'].includes(item.id);

  if (['doctor', 'nurse', 'dietitian'].includes(role))
    return !['staff', 'careTeam'].includes(item.id);

  return true;
});



  // Avoid duplicate sidebar when an initialization is retried.
  if (document.getElementById('siomcSidebar')) return;

  const sidebar = document.createElement("aside");
  sidebar.className = "siomc-shared-sidebar";
  sidebar.id = "siomcSidebar";

  sidebar.innerHTML = `
    <div class="siomc-brand">
      <div class="siomc-brand-name">SiOMC</div>
      <div class="siomc-brand-subtitle">ADMIN PORTAL</div>
    </div>

    <div class="siomc-menu-title">MAIN MENU</div>

    <nav class="siomc-menu">
      ${visibleItems.map(item => `
        <a href="${item.href}"
           class="siomc-menu-link ${activePage === item.id ? "active" : ""}">
          <span class="siomc-menu-icon">${siomcSidebarIcon(item.id)}</span>
          <span>${item.label}</span>
        </a>
      `).join("")}
    </nav>

    <div class="siomc-sidebar-footer">
      SiOMC Digital Health Platform
    </div>
  `;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "siomc-mobile-toggle";
  toggle.innerHTML = SIOMC_MENU_SVG;
  toggle.setAttribute("aria-label", "เปิดเมนู");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "siomcSidebar");

  const overlay = document.createElement("div");
  overlay.className = "siomc-sidebar-overlay";

  const style = document.createElement("style");

  style.textContent = `
    body {
      margin-left: 250px !important;
    }

    .siomc-shared-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 250px;
      background: #123d5a;
      color: white;
      padding: 26px 16px;
      z-index: 1001;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      font-family: var(--siomc-font, sans-serif);
      overflow-y: auto;
    }

    .siomc-brand {
      padding: 5px 12px 25px;
      border-bottom: 1px solid #36566d;
    }

    .siomc-brand-name {
      font-size: 27px;
      font-weight: bold;
      letter-spacing: 1px;
    }

    .siomc-brand-subtitle {
      font-size: 11px;
      color: #b9d3e2;
      letter-spacing: 2px;
      margin-top: 4px;
    }

    .siomc-menu-title {
      font-size: 10px;
      color: #a9c3d3;
      letter-spacing: 1.5px;
      padding: 25px 12px 12px;
    }

    .siomc-menu {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .siomc-menu-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 13px 12px;
      border-radius: 9px;
      color: #e3edf3;
      text-decoration: none;
      font-size: 14px;
      transition: background .2s;
    }

    .siomc-menu-link:hover {
      background: #244f6c;
    }

    .siomc-menu-link.active {
      background: #315f7c;
      color: white;
      font-weight: bold;
    }

    .siomc-menu-icon {
      width: 20px;
      text-align: center;
      font-size: 18px;
    }

    .siomc-sidebar-footer {
      margin-top: auto;
      padding: 15px 10px 5px;
      border-top: 1px solid #36566d;
      color: #a9c3d3;
      font-size: 10px;
    }

    .siomc-mobile-toggle,
    .siomc-sidebar-overlay {
      display: none;
    }

    @media (max-width: 700px) {
      body {
        margin-left: 0 !important;
      }

      .siomc-shared-sidebar {
        width: 270px;
        max-width: 85vw;
        padding: 22px 14px;
        transform: translateX(-100%);
        transition: transform .25s ease;
      }

      .siomc-shared-sidebar.open {
        transform: translateX(0);
      }

      .siomc-menu-link {
        font-size: 14px;
        gap: 10px;
        padding: 14px 12px;
      }

      .siomc-mobile-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 12px;
        left: 12px;
        width: 44px;
        height: 44px;
        border: none;
        border-radius: 9px;
        background: #123d5a;
        color: white;
        font-size: 23px;
        cursor: pointer;
        z-index: 1003;
        box-shadow: 0 2px 8px rgba(0,0,0,.15);
      }

      .siomc-sidebar-overlay {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.4);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: opacity .25s ease, visibility .25s ease;
      }

      .siomc-sidebar-overlay.open {
        opacity: 1;
        visibility: visible;
      }
    }
  

    /* Shared line icons — consistent visual size on every device */
    .siomc-menu-icon {
      width: 24px;
      min-width: 24px;
      height: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      line-height: 1;
    }
    .siomc-menu-icon svg {
      display: block;
      width: 21px;
      height: 21px;
    }
    .siomc-mobile-toggle svg {
      display: block;
      width: 22px;
      height: 22px;
    }
    @media (max-width: 700px) {
      .siomc-shared-sidebar .siomc-brand {
        padding-right: 53px;
        min-height: 110px;
      }
      .siomc-shared-sidebar .siomc-brand-name {
        font-size: 25px;
        line-height: 1.25;
      }
      .siomc-menu-link {
        min-height: 48px;
        border-radius: 11px;
        gap: 13px;
      }
      .siomc-mobile-toggle {
        transition: left .25s ease, background .2s ease;
        touch-action: manipulation;
      }
      /* When open, move close button to top right INSIDE the drawer. */
      .siomc-mobile-toggle[aria-expanded="true"] {
        left: calc(min(270px, 85vw) - 56px);
        top: 16px;
        background: #315f7c;
        box-shadow: none;
      }
    }
`;

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "เปิดเมนู");
    toggle.innerHTML = SIOMC_MENU_SVG;
  }

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "ปิดเมนู");
    toggle.innerHTML = SIOMC_CLOSE_SVG;
  }

  toggle.addEventListener("click", () => {
    if (sidebar.classList.contains("open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay.addEventListener("click", closeSidebar);

  sidebar.querySelectorAll(".siomc-menu-link").forEach(link => {
    link.addEventListener("click", closeSidebar);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeSidebar();
    }
  });

  document.head.appendChild(style);
  document.body.prepend(overlay);
  document.body.prepend(sidebar);
  document.body.prepend(toggle);
}
