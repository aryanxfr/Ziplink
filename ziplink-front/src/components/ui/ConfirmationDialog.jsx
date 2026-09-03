import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  variant = "danger",
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex gap-3.5">
        <div
          className={
            variant === "danger"
              ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger"
              : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-accent"
          }
        >
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="text-sm text-body">{description}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant={variant} onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
