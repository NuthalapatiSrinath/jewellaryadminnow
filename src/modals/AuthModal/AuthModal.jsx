import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "../../redux/slices/authSlice";
import { closeModal } from "../../redux/slices/modalSlice";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import styles from "./AuthModal.module.css";

const AuthModal = () => {
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearAuthError()); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    dispatch(loginUser(formData));
  };

  // Close modal automatically if login is successful
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(closeModal());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <div className={styles.Container} onClick={(e) => e.stopPropagation()}>
      <div className={styles.Header}>
        <h2>Admin Login</h2>
        <p>Enter your credentials to access the dashboard</p>
      </div>

      {error && (
        <div className={styles.ErrorBox}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.Form}>
        <div className={styles.InputGroup}>
          <label>Email Address</label>
          <div className={styles.InputWrapper}>
            <Mail className={styles.Icon} size={18} />
            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
              autoFocus
            />
          </div>
        </div>

        <div className={styles.InputGroup}>
          <label>Password</label>
          <div className={styles.InputWrapper}>
            <Lock className={styles.Icon} size={18} />
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className={styles.SubmitBtn} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className={styles.Spinner} size={18} /> Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className={styles.Footer}>
        <p>Forgot password? Contact IT Support.</p>
      </div>
    </div>
  );
};

export default AuthModal;
