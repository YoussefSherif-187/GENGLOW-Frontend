import React from "react";

const ConfirmModal2 = ({
  show,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!show) return null;

  return (
    <div className="model-overlay">
      <div className="model2-modal">
        <p className="model2-message">{message}</p>

        <div className="model2-actions">
          <button
            className="model2-btn model2-btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className="model2-btn model2-btn-confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal2;
