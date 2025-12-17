// src/modals/RenderModal/RenderModal.jsx
import React from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./RenderModal.module.css";
import MainModal from "../MainModal/MainModal";

// 1. IMPORT YOUR MODAL COMPONENTS HERE (You likely need to create these files)
// import AuthModal from "../AuthModal/AuthModal";
// import SearchModal from "../SearchModal/SearchModal";

function RenderModal() {
  const activeModal = useSelector((state) => state.modal.type);
  const modalData = useSelector((state) => state.modal.modalData); // Get data passed via dispatch

  // 2. MAP THE TYPE KEYS TO THE COMPONENTS
  const allModals = {
    // "AUTH": <AuthModal data={modalData} />,
    // "SEARCH": <SearchModal />,
  };

  return (
    <MainModal>
      {/* ... existing code ... */}
      {allModals[activeModal]}
      {/* ... existing code ... */}
    </MainModal>
  );
}

export default RenderModal;
