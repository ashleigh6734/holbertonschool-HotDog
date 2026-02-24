import { Button, Modal } from "react-bootstrap";
import "../../pages/UserProfile/UserProfile.css";

export default function ConfirmModal({
  show,
  handleClose,
  handlePrimary,
  heading,
  body,
  secondaryButton,
  primaryButton,
}) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {secondaryButton}
        </Button>
        <Button
          variant="primary"
          style={{
            backgroundColor: "#1f3a5f",
            color: "#FFC72C",
            outline: "none",
            border: "none",
          }}
          onClick={handlePrimary}
        >
          {primaryButton}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
