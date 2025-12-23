import React from "react";
import { Settings, Shield, User, Bell } from "lucide-react";
import styles from "../../pages/HomePage/HomePage.module.css";

const SettingsPage = () => {
  return (
    <div className={styles.PlaceholderPage}>
      <div className={styles.WelcomeBanner}>
        <h2>System Settings</h2>
        <p>Configure your admin panel preferences.</p>
      </div>

      <div className={styles.SettingsGrid}>
        <div className={styles.SettingsCard}>
          <User size={32} />
          <h3>Profile Settings</h3>
          <p>Manage admin account details</p>
          <button className={styles.BtnSecondary}>Manage</button>
        </div>
        <div className={styles.SettingsCard}>
          <Shield size={32} />
          <h3>Security</h3>
          <p>Password and API Keys</p>
          <button className={styles.BtnSecondary}>Configure</button>
        </div>
        <div className={styles.SettingsCard}>
          <Bell size={32} />
          <h3>Notifications</h3>
          <p>Email alerts and system logs</p>
          <button className={styles.BtnSecondary}>Edit</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
