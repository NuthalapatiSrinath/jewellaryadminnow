import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "./TopBar.module.css";

// Icons
import { FaSearch, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

// Components
import UserMenu from "../../components/UserMenu/UserMenu";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../redux/slices/modalSlice";
import { openNavBar, closeNavBar } from "../../redux/slices/navBarSlice";

// Data
import {
  ENGAGEMENT_DATA,
  WEDDING_DATA,
  JEWELLERY_DATA,
  DIAMONDS_DATA,
  GEMSTONE_DATA,
  GIFTS_DATA,
  ABOUT_DATA,
} from "../../data/navigationData.js";

export default function Topbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const headerRef = useRef(null);

  const drawerOpen = useSelector((state) => state.navBar.isSideBarOpen);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const wishlistCount = wishlistItems.length;

  const [scrolled, setScrolled] = useState(false);
  const [openPanelId, setOpenPanelId] = useState(null);
  const ignoreHoverUntilRef = useRef(0);
  const HOVER_IGNORE_MS = 700;

  // Header height calculation
  useLayoutEffect(() => {
    const measure = () => {
      if (!headerRef.current) return;
      document.documentElement.style.setProperty(
        "--topbar-height",
        `${Math.round(headerRef.current.getBoundingClientRect().height)}px`
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  useEffect(() => {
    const handleWindowLeave = (e) => {
      // mouse leaves window from top or sides
      if (e.clientY <= 0 || e.clientX <= 0) {
        setOpenPanelId(null);
      }
    };

    const handleBlur = () => {
      // browser tab changed / window lost focus
      setOpenPanelId(null);
    };

    window.addEventListener("mouseout", handleWindowLeave);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("mouseout", handleWindowLeave);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  // Close on route change
  useEffect(() => {
    dispatch(closeNavBar());
    setOpenPanelId(null);
    ignoreHoverUntilRef.current = Date.now() + HOVER_IGNORE_MS;
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openPanelId &&
        !event.target.closest(`.${styles.panelWrap}`) &&
        !event.target.closest(`.${styles.nav}`)
      ) {
        setOpenPanelId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openPanelId]);

  const isEngagementActive = location.pathname.startsWith("/engagement");
  const portalRoot = typeof document !== "undefined" ? document.body : null;

  // ---------------- MOBILE DRAWER ----------------
  const drawerElem = (
    <>
      <div
        className={`${styles.drawerOverlay} ${drawerOpen ? styles.open : ""}`}
        onClick={() => dispatch(closeNavBar())}
      />
      <aside
        className={`${styles.mobileDrawer} ${drawerOpen ? styles.open : ""}`}
      >
        <div className={styles.drawerHeader}>
          <button
            className={styles.closeBtn}
            onClick={() => dispatch(closeNavBar())}
          >
            <IoClose size={30} />
          </button>
        </div>
        <div className={styles.drawerContent}>
          <nav className={styles.drawerNav}>
            <ul>
              <li>
                <NavLink to="/" className={styles.drawerNavLink}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/engagement/design"
                  className={styles.drawerNavLink}
                >
                  Engagement
                </NavLink>
              </li>
              <li>
                <NavLink to="/wedding" className={styles.drawerNavLink}>
                  Wedding
                </NavLink>
              </li>
              <li>
                <NavLink to="/jewellery" className={styles.drawerNavLink}>
                  Jewellery
                </NavLink>
              </li>
              <li>
                <NavLink to="/diamonds" className={styles.drawerNavLink}>
                  Diamonds
                </NavLink>
              </li>
              <li>
                <NavLink to="/gemstone" className={styles.drawerNavLink}>
                  Gemstones
                </NavLink>
              </li>
              <li>
                <NavLink to="/gifts" className={styles.drawerNavLink}>
                  Gifts
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={styles.drawerNavLink}>
                  About
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );

  // ---------------- DESKTOP NAV ----------------
  function NavMenuWithPanel({ to, label, isActiveFlag, megaProps }) {
    const navigate = useNavigate();
    const panelId = megaProps?.id;
    const isPanelOpen = openPanelId === panelId;

    const handleMouseEnter = () => {
      if (Date.now() < ignoreHoverUntilRef.current) return;
      if (megaProps) setOpenPanelId(panelId);
    };

    const handleSubLinkClick = (e, item) => {
      e.preventDefault();
      setOpenPanelId(null);
      ignoreHoverUntilRef.current = Date.now() + 600;
      if (item.to) navigate(item.to);
    };

    if (!megaProps) {
      return (
        <li>
          <NavLink to={to} className={styles.navItem}>
            {label}
          </NavLink>
        </li>
      );
    }

    return (
      <li className={styles.navLiWithPanel} onMouseEnter={handleMouseEnter}>
        <NavLink
          to={to}
          className={`${styles.navItem} ${isActiveFlag ? styles.active : ""}`}
        >
          {label}
        </NavLink>

        {/* ✅ FIX IS HERE */}
        <div
          className={`${styles.panelWrap} ${isPanelOpen ? styles.open : ""}`}
          onMouseLeave={() => setOpenPanelId(null)}
        >
          <div className={styles.megaPanel}>
            <div className={styles.megaInner}>
              {megaProps.columns.map((col, idx) => (
                <div className={styles.column} key={idx}>
                  {col.title && <h4>{col.title}</h4>}
                  <ul>
                    {col.items.map((item, i) => (
                      <li key={i}>
                        <a
                          href={item.to}
                          onClick={(e) => handleSubLinkClick(e, item)}
                          className={styles.panelItemLink}
                        >
                          {item.icon && (
                            <img
                              src={item.icon}
                              alt=""
                              className={styles.itemIcon}
                            />
                          )}
                          <span>{item.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`${styles.topbar} ${scrolled ? styles.scrolled : ""}`}
      >
        <div className={styles.row}>
          <div className={styles.left}>
            <Link to="/visit" className={styles.utilityLink}>
              Visit Us
            </Link>
            <Link to="/contact" className={styles.utilityLink}>
              Contact
            </Link>
          </div>

          <div className={styles.center}>
            <Link to="/" className={styles.brand}>
              <span className={styles.brandText}>ARRA</span>
              <img src="/logo.png" alt="Emblem" className={styles.emblem} />
              <span className={styles.brandText}>JEWELS</span>
            </Link>
          </div>

          <div className={styles.right}>
            <button
              className={styles.iconBtn}
              onClick={() => dispatch(openModal({ type: "SEARCH" }))}
            >
              <FaSearch />
            </button>
            <Link to="/wishlist" className={styles.iconBtn}>
              <FaRegHeart />
              {wishlistCount > 0 && (
                <span className={styles.badge}>{wishlistCount}</span>
              )}
            </Link>
            <Link to="/cart" className={styles.iconBtn}>
              <FaShoppingBag />
            </Link>
            <UserMenu />
            <button
              className={styles.hamburger}
              onClick={() => dispatch(openNavBar())}
            >
              <HiMenu size={24} />
            </button>
          </div>
        </div>

        <div className={styles.bottomBorder} />

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <NavMenuWithPanel
              to="/engagement/design"
              label="ENGAGEMENT"
              isActiveFlag={isEngagementActive}
              megaProps={ENGAGEMENT_DATA}
            />
            <NavMenuWithPanel
              to="/wedding"
              label="WEDDING"
              megaProps={WEDDING_DATA}
            />
            <NavMenuWithPanel
              to="/jewellery"
              label="JEWELLERY"
              megaProps={JEWELLERY_DATA}
            />
            <NavMenuWithPanel
              to="/diamonds"
              label="DIAMONDS"
              megaProps={DIAMONDS_DATA}
            />
            <NavMenuWithPanel
              to="/gemstone"
              label="GEMSTONE"
              megaProps={GEMSTONE_DATA}
            />
            <NavMenuWithPanel
              to="/gifts"
              label="GIFTS"
              megaProps={GIFTS_DATA}
            />
            <NavMenuWithPanel
              to="/about"
              label="ABOUT"
              megaProps={ABOUT_DATA}
            />
          </ul>
        </nav>
      </header>

      {portalRoot ? ReactDOM.createPortal(drawerElem, portalRoot) : drawerElem}
    </>
  );
}
