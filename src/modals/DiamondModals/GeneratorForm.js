import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "../../redux/slices/modalSlice";
import diamondService from "../../services/diamondService";
import { toast } from "react-hot-toast";
import styles from "../../components/DashboardViews/ManageDiamonds.module.css";

const GeneratorForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    shape: "",
    carats: "",
    colors: "",
    clarities: "",
    basePricePerCarat: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Generating...");

    const payload = {
      ...data,
      carats: data.carats.split(",").map((s) => s.trim()),
      colors: data.colors.split(",").map((s) => s.trim()),
      clarities: data.clarities.split(",").map((s) => s.trim()),
    };

    try {
      const res = await diamondService.generateDiamonds(payload);
      toast.success(`Generated ${res.created} diamonds!`, { id: toastId });
      if (onSuccess) onSuccess();
      dispatch(closeModal());
    } catch (err) {
      toast.error("Failed: " + err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.ModalContainer}>
      <div className={styles.ModalHeader}>
        <h3>Generate Combinations</h3>
        <button
          onClick={() => dispatch(closeModal())}
          className={styles.CloseBtn}
        >
          X
        </button>
      </div>
      <div className={styles.ModalBody}>
        <form onSubmit={handleGenerate} className={styles.Form}>
          {/* Inputs matching your previous code */}
          <div className={styles.InputGroup}>
            <label>Shape Code</label>
            <input
              placeholder="e.g. ROUND"
              value={data.shape}
              onChange={(e) => setData({ ...data, shape: e.target.value })}
              className={styles.Input}
              required
            />
          </div>
          {/* ... Add other inputs ... */}
          <div className={styles.ModalActions}>
            <button
              type="button"
              onClick={() => dispatch(closeModal())}
              className={styles.BtnCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.BtnSecondary}
            >
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratorForm;
