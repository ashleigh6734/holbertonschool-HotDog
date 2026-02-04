import { Form } from "react-bootstrap";

export default function FormRadio({ name, firstLabel, secondLabel }) {
  return (
    <div key={"inline-radio"} className="mb-3">
      <Form.Check
        inline
        label={firstLabel}
        name={name}
        type="radio"
        id="inline-radio-1"
      />
      <Form.Check
        inline
        label={secondLabel}
        name={name}
        type="radio"
        id="inline-radio-2"
      />
    </div>
  );
}
