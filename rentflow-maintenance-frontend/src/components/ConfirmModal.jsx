import React from "react";
import Modal from "./Modal";
export default function ConfirmModal({
  isOpen,
  title = "Confirm action",
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}) {
  if (!isOpen) return null;
  return (
    <Modal title={title} onClose={onCancel} busy={loading}>
      <div className="mb-6 text-sm leading-7 text-slate-600">{message}</div>
      <div className="flex justify-end gap-3">
        <button
          disabled={loading}
          onClick={onCancel}
          className="btn btn-secondary"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="btn btn-danger"
        >
          {loading ? "Processing…" : confirmText}
        </button>
      </div>
    </Modal>
  );
}
