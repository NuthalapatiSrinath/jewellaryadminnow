import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../redux/slices/modalSlice";
import MainModal from "../MainModal/MainModal"; // Ensure you have this wrapper

// Import your separated Modal Components
import DiamondForm from "../DiamondModals/DiamondForm";
import DiamondViewer from "../DiamondModals/DiamondViewer";
import BulkUploadForm from "../DiamondModals/BulkUploadForm";
import GeneratorForm from "../DiamondModals/GeneratorForm";

// Map strings (action types) to Components
const MODAL_COMPONENTS = {
  DIAMOND_FORM: DiamondForm,
  DIAMOND_VIEW: DiamondViewer,
  BULK_UPLOAD: BulkUploadForm,
  GENERATOR: GeneratorForm,
};

function RenderModal() {
  const dispatch = useDispatch();
  // We expect state.modal to have { type: "STRING", props: { ... } }
  const { type, props } = useSelector((state) => state.modal);

  console.log("🛠 [RenderModal] Current Active Modal:", type);

  if (!type || !MODAL_COMPONENTS[type]) return null;

  const ActiveModal = MODAL_COMPONENTS[type];

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <MainModal onClose={handleClose}>
      <ActiveModal {...props} onClose={handleClose} />
    </MainModal>
  );
}

export default RenderModal;
