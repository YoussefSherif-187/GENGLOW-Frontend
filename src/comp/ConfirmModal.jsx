import React from "react";

const ConfirmModal = ({
  show,
  title = "Delete Confirmation",
  message,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  if (!show) return null;

  return (
    <div className="model-overlay">
      <div className="model-modal">
        {/* Header */}
        <div className="model-header">
          <h3 className="model-title">{title}</h3>
          <button className="model-close-btn" onClick={onCancel}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className="model-body">
          <div className="model-alert-danger">
            {message}
          </div>
        </div>

        {/* Footer */}
        <div className="model-footer">
          <button
            className="model-btn model-btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className="model-btn model-btn-danger"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
