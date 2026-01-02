import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/modalSlice";
import {
  Lock,
  Settings,
  LayoutDashboard,
  Gem,
  LogOut,
  Menu,
  UserCircle,
  Bell,
} from "lucide-react";
import styles from "./HomePage.module.css";

// --- IMPORT SEPARATE VIsdjkEWS ---
import DashboardOverview from "../../components/DashboardViews/DashboardOverview";
import ManageDiamonds from "../../components/DashboardViews/ManageDiamonds";
import SettingsPage from "../../components/DashboardViews/SettingsPage";

const HomePage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // State to track which page is active
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) dispatch(openModal({ type: "AUTH" }));
  }, [isAuthenticated, dispatch]);

  // --- CONTENT ROUTER ---
  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardOverview />;
      case "diamonds":
        return <ManageDiamonds />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  // --- RESTRICTED VIEW ---
  if (!isAuthenticated) {
    return (
      <div className={styles.RestrictedContainer}>
        <div className={styles.RestrictedCard}>
          <div className={styles.LockIconWrapper}>
            <Lock size={48} />
          </div>
          <h1>Access Restricted</h1>
          <p>Please sign in to access the Admin Dashboard.</p>
          <button
            className={styles.LoginButton}
            onClick={() => dispatch(openModal({ type: "AUTH" }))}
          >
            Sign In to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN LAYOUT ---
  return (
    <div className={styles.LayoutContainer}>
      {/* SIDEBAR */}
      <aside
        className={`${styles.Sidebar} ${
          !sidebarOpen ? styles.SidebarCollapsed : ""
        }`}
      >
        <div className={styles.SidebarHeader}>
          <div className={styles.Logo}>
            <div className={styles.LogoIcon}>J</div>
            <span className={styles.LogoText}>
              Jewellery<span className={styles.LogoAccent}>Admin</span>
            </span>
          </div>
        </div>

        <nav className={styles.NavMenu}>
          <div className={styles.NavLabel}>MENU</div>

          <button
            className={
              activeView === "dashboard" ? styles.NavItemActive : styles.NavItem
            }
            onClick={() => setActiveView("dashboard")}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>

          <button
            className={
              activeView === "diamonds" ? styles.NavItemActive : styles.NavItem
            }
            onClick={() => setActiveView("diamonds")}
          >
            <Gem size={20} />
            <span>Diamonds</span>
          </button>

          <button
            className={
              activeView === "settings" ? styles.NavItemActive : styles.NavItem
            }
            onClick={() => setActiveView("settings")}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className={styles.SidebarFooter}>
          <div className={styles.UserProfile}>
            <UserCircle size={32} className={styles.UserAvatar} />
            <div className={styles.UserInfo}>
              <span className={styles.UserName}>Admin User</span>
              <span className={styles.UserRole}>Super Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={styles.MainContent}>
        {/* Top Navbar */}
        <header className={styles.TopBar}>
          <button
            className={styles.MenuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </button>

          <div className={styles.TopRight}>
            <button className={styles.IconButton}>
              <Bell size={20} />
              <span className={styles.NotificationDot}></span>
            </button>
            <button
              className={styles.LogoutBtn}
              onClick={() => window.location.reload()} // Simple logout for now
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        {/* Dynamic View Area */}
        <div className={styles.ContentBody}>{renderContent()}</div>
      </main>
    </div>
  );
};

export default HomePage;
