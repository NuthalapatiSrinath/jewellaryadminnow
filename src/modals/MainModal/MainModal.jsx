import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { closeModal } from "../../redux/slices/modalSlice"; // Import close action
import styles from "./MainModal.module.css";

// Animation Variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.8, y: 20 },
};

function MainModal({ children }) {
  const dispatch = useDispatch();
  const activeModal = useSelector((state) => state.modal.type);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeModal]);

  // Handle closing when clicking the backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(closeModal());
    }
  };

  if (!activeModal) return null;

  return (
    <AnimatePresence>
      {activeModal && (
        <motion.div
          className={styles.Overlay}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick} // Click outside to close
        >
          <motion.div
            className={styles.CenteredContainer}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking content
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MainModal;
