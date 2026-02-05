import { useState } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { useNavigate } from "react-router-dom";

export default function ToggleSwitch({
  firstRadio,
  secondRadio,
  firstPath,
  secondPath,
}) {
  const [radioValue, setRadioValue] = useState("login"); // login | signup

  const radios = [
    { name: firstRadio, value: firstRadio, path: firstPath },
    { name: secondRadio, value: secondRadio, path: secondPath },
  ];

  const navigate = useNavigate();

  const handleChange = (e, path) => {
    setRadioValue(e.currentTarget.value);
    navigate(path);
  };

  return (
    <>
      <ButtonGroup>
        {radios.map((radio, idx) => (
          <ToggleButton
            key={idx}
            id={`radio-${idx}`}
            type="radio"
            variant={idx % 2 ? "outline-warning" : "outline-primary"}
            name="radio"
            value={radio.value}
            checked={radioValue === radio.value}
            onChange={(e) => handleChange(e, radio.path)}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </>
  );
}
