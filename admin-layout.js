
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
  sidebar.id = "siomcSidebar";

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

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "siomc-mobile-toggle";
  toggle.innerHTML = "☰";
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
  `;

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "เปิดเมนู");
    toggle.innerHTML = "☰";
  }

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "ปิดเมนู");
    toggle.innerHTML = "✕";
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
