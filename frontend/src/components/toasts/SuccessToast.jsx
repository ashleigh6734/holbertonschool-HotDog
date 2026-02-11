import { Toast, ToastContainer } from "react-bootstrap";

export default function SuccessToast({ showToast, onClose, message }) {
  return (
    <ToastContainer position="top-center">
      <Toast show={showToast} onClose={onClose}>
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
