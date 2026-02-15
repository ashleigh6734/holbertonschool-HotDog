import { Form, Col } from "react-bootstrap";

export default function FormLabel({
  className,
  controlId,
  type,
  placeholder,
  name, // stays as label text
  inputName, //for FORM state key
  value,
  onChange,
  id,
  disabled,
  readOnly,
}) {
  return (
    <Form.Group id={id} className={className} as={Col} controlId={controlId}>
      <Form.Label>{name}</Form.Label>
      <Form.Control
        type={type}
        name={inputName}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
      />
    </Form.Group>
  );
}
