import { Form, Col } from "react-bootstrap";

export default function FormLabel({
  className,
  controlId,
  type,
  placeholder,
  name,
}) {
  return (
    <Form.Group className={className} as={Col} controlId={controlId}>
      <Form.Label>{name}</Form.Label>
      <Form.Control type={type} placeholder={placeholder} />
    </Form.Group>
  );
}
