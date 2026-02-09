import { Form, Col } from "react-bootstrap";

export default function FormLabel({
  className,
  controlId,
  type,
  placeholder,
  name,
  id,
  disabled,
  readOnly,
}) {
  return (
    <Form.Group id={id} className={className} as={Col} controlId={controlId}>
      <Form.Label>{name}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
      />
    </Form.Group>
  );
}
