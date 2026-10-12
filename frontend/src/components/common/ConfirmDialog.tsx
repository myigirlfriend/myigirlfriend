import Button from './Button'
import Modal from './Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  /** Styles the confirm button as destructive */
  danger?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/** Asks before doing something that cannot be undone. */
export default function ConfirmDialog({
  isOpen, title, message, confirmLabel, cancelLabel = 'Cancel', danger = false, loading = false, onConfirm, onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <p className="text-sm leading-relaxed text-brand-muted">{message}</p>
      <div className="mt-6 flex gap-3">
        <Button variant="ghost" fullWidth onClick={onCancel} disabled={loading}>{cancelLabel}</Button>
        <Button variant={danger ? 'danger' : 'primary'} fullWidth onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
