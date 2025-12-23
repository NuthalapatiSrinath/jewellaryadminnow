import React, { useEffect, useState } from "react";
import diamondService from "../../services/diamondService";
import {
  Gem,
  LayoutDashboard,
  Archive,
  Activity,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import styles from "../../pages/HomePage/HomePage.module.css"; // Reusing main styles for consistency

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalDiamonds: 0,
    activeDiamonds: 0,
    inactiveDiamonds: 0,
    totalValue: 0, // Mock or calculated if available
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const data = await diamondService.getStats();
        // Assuming your debug endpoint returns structure like:
        // { totalDiamonds: 100, activeBreakdown: { totalActive: 80, activeFalse: 20 } }
        setStats({
          totalDiamonds: data.totalDiamonds || 0,
          activeDiamonds: data.activeBreakdown?.totalActive || 0,
          inactiveDiamonds: data.activeBreakdown?.activeFalse || 0,
          totalValue: 0, // You can calculate this if your API returns price sums
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealTimeData();
  }, []);

  if (loading) {
    return <div className={styles.LoadingState}>Loading Dashboard Data...</div>;
  }

  return (
    <div className={styles.DashboardOverview}>
      <div className={styles.WelcomeBanner}>
        <h2>Dashboard Overview</h2>
        <p>Real-time snapshot of your inventory.</p>
      </div>

      <div className={styles.StatsGrid}>
        {/* Total Inventory */}
        <div className={styles.StatCard}>
          <div
            className={styles.StatIcon}
            style={{ background: "#eff6ff", color: "#2563eb" }}
          >
            <Gem size={24} />
          </div>
          <div>
            <h4>Total Diamonds</h4>
            <span className={styles.StatValue}>
              {stats.totalDiamonds.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Active Listings */}
        <div className={styles.StatCard}>
          <div
            className={styles.StatIcon}
            style={{ background: "#f0fdf4", color: "#16a34a" }}
          >
            <Activity size={24} />
          </div>
          <div>
            <h4>Active / Online</h4>
            <span className={styles.StatValue}>
              {stats.activeDiamonds.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Inactive / Hidden */}
        <div className={styles.StatCard}>
          <div
            className={styles.StatIcon}
            style={{ background: "#fef2f2", color: "#dc2626" }}
          >
            <Archive size={24} />
          </div>
          <div>
            <h4>Hidden / Sold</h4>
            <span className={styles.StatValue}>
              {stats.inactiveDiamonds.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Placeholder for Sales/Orders (If you have order API) */}
        <div className={styles.StatCard}>
          <div
            className={styles.StatIcon}
            style={{ background: "#fff7ed", color: "#ea580c" }}
          >
            <ShoppingCart size={24} />
          </div>
          <div>
            <h4>Recent Orders</h4>
            <span className={styles.StatValue}>--</span>
            <span className={styles.StatSub}>Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
