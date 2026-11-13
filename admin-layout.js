
export function renderAdminSidebar(activePage = "") {
    const menuItems = [
      { id: "admin", label: "ภาพรวม", icon: "▦", href: "admin.html" },
      { id: "members", label: "จัดการสมาชิก", icon: "♙", href: "members.html" },
      { id: "weight", label: "ติดตามน้ำหนัก", icon: "↗", href: "weight.html" },
      { id: "nutrition", label: "ติดตามโภชนาการ", icon: "◉", href: "nutrition.html" },
      { id: "assessment", label: "ประเมินทางคลินิก", icon: "✚", href: "assessment.html" },
      { id: "learning", label: "จัดการคลังความรู้", icon: "▤", href: "learning.html" },
      { id: "staff", label: "จัดการเจ้าหน้าที่", icon: "♙", href: "staff.html" }
    ];
  
    const sidebar = document.createElement("aside");
    sidebar.className = "siomc-shared-sidebar";
  
    sidebar.innerHTML = `
      <div class="siomc-brand">
        <div class="siomc-brand-name">SiOMC</div>
        <div class="siomc-brand-subtitle">ADMIN PORTAL</div>
      </div>
  
      <div class="siomc-menu-title">MAIN MENU</div>
  
      <nav class="siomc-menu">
        ${menuItems.map(item => `
          <a href="${item.href}"
             class="siomc-menu-link ${activePage === item.id ? "active" : ""}">
            <span class="siomc-menu-icon">${item.icon}</span>
            <span>${item.label}</span>
          </a>
        `).join("")}
      </nav>
  
      <div class="siomc-sidebar-footer">
        SiOMC Digital Health Platform
      </div>
    `;
  
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
        z-index: 9999;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        font-family: Arial, Tahoma, sans-serif;
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
  
      @media(max-width:700px) {
        body {
          margin-left: 190px !important;
        }
  
        .siomc-shared-sidebar {
          width: 190px;
          padding: 20px 10px;
        }
  
        .siomc-menu-link {
          font-size: 12px;
          gap: 7px;
          padding: 12px 8px;
        }
  
        .siomc-brand-name {
          font-size: 23px;
        }
      }
    `;
  
    document.head.appendChild(style);
    document.body.prepend(sidebar);
  }
  