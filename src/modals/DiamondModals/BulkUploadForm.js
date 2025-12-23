import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "../../redux/slices/modalSlice";
import diamondService from "../../services/diamondService";
import { toast } from "react-hot-toast";
import { FileSpreadsheet } from "lucide-react";
// Import styles from the main module so we don't duplicate CSS
import styles from "../../components/DashboardViews/ManageDiamonds.module.css";

const BulkUploadForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log("📂 File Selected:", selectedFile.name);
      console.log("📏 File Size:", selectedFile.size, "bytes");
      console.log("📄 File Type:", selectedFile.type);
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    const toastId = toast.loading(
      "Uploading Excel file... check console for details"
    );

    try {
      console.log("🚀 Starting Bulk Upload Request...");

      const res = await diamondService.bulkUpload(file);

      console.log("✅ Upload Success Response:", res);

      // Detailed feedback in console
      if (res.validRows === 0) {
        console.warn(
          "⚠️ WARNING: The server processed 0 rows. Check if your Excel headers match what the Backend expects (e.g., 'carat', 'shape', 'sku')."
        );
      }

      toast.success(res.message || `Processed ${res.validRows} diamonds`, {
        id: toastId,
      });

      if (onSuccess) onSuccess();
      dispatch(closeModal());
    } catch (err) {
      console.error("❌ Upload Failed Details:", err);
      console.error("❌ Server Response Data:", err.response?.data);

      const errMsg = err.response?.data?.message || err.message;
      toast.error("Upload failed: " + errMsg, { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.ModalContainer}>
      <div className={styles.ModalHeader}>
        <h3>Bulk Upload Excel</h3>
        <button
          onClick={() => dispatch(closeModal())}
          className={styles.CloseBtn}
        >
          X
        </button>
      </div>
      <div className={styles.ModalBody}>
        <form onSubmit={handleUpload} className={styles.Form}>
          <div className={styles.UploadBox}>
            <FileSpreadsheet size={40} className={styles.UploadIcon} />
            <p>Drag and drop your Excel file here, or click to select.</p>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className={styles.FileInput}
            />
            {file && <span className={styles.FileName}>{file.name}</span>}
          </div>

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
              disabled={uploading || !file}
              className={styles.BtnSuccess}
            >
              {uploading ? "Uploading..." : "Upload Excel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkUploadForm;
