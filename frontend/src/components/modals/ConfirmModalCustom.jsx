import "./ConfirmModalCustom.css";

export default function ConfirmModalCustom({
  title,
  onConfirm,
  onClose,
  confirmText = "Confirm",
  isLoading = false,
}) {
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="confirm-modal-content">
          <p className="confirm-modal-title">{title}</p>
          <button
            className="confirm-modal-confirm-btn"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
