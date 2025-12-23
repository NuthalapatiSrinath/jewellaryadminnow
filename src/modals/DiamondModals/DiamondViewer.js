import React from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "../../redux/slices/modalSlice";

import { ExternalLink, FileSpreadsheet } from "lucide-react";
import styles from "../../components/DashboardViews/ManageDiamonds.module.css";

const DiamondViewer = ({ diamond }) => {
  const dispatch = useDispatch();
  const renderUrl = diamond.videoUrl || diamond.imageUrl;
  const is360 =
    renderUrl &&
    (renderUrl.includes("v360") ||
      renderUrl.includes("vision360") ||
      renderUrl.includes("cutwise"));

  return (
    <div className={styles.ModalContainer}>
      <div className={styles.ModalHeader}>
        <h3>View Diamond: {diamond.sku}</h3>
        <button
          onClick={() => dispatch(closeModal())}
          className={styles.CloseBtn}
        >
          X
        </button>
      </div>
      <div className={styles.ModalBody}>
        <div className={styles.ViewerContainer}>
          <div className={styles.ViewerMeta}>
            <div className={styles.MetaItem}>
              <span className={styles.Label}>Carat</span>
              <span className={styles.Value}>{diamond.carat}</span>
            </div>
            <div className={styles.MetaItem}>
              <span className={styles.Label}>Color</span>
              <span className={styles.Value}>{diamond.color}</span>
            </div>
            <div className={styles.MetaItem}>
              <span className={styles.Label}>Clarity</span>
              <span className={styles.Value}>{diamond.purity}</span>
            </div>
            {diamond.certUrl && (
              <a
                href={diamond.certUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.CertLink}
              >
                <FileSpreadsheet size={14} /> Cert <ExternalLink size={12} />
              </a>
            )}
          </div>

          <div className={styles.IframeWrapper}>
            {renderUrl ? (
              is360 || renderUrl.includes(".mp4") ? (
                <iframe
                  src={renderUrl}
                  className={styles.RenderIframe}
                  frameBorder="0"
                  allowFullScreen
                  title="View"
                ></iframe>
              ) : (
                <img
                  src={renderUrl}
                  alt="Diamond"
                  className={styles.RenderImage}
                />
              )
            ) : (
              <div className={styles.EmptyViewer}>No media available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiamondViewer;
