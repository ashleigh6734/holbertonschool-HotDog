import { useState } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

export default function ToggleSwitch({ firstRadio, secondRadio }) {
  const [radioValue, setRadioValue] = useState("1");

  const radios = [
    { name: firstRadio, value: "1" },
    { name: secondRadio, value: "2" },
  ];

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
            onChange={(e) => setRadioValue(e.currentTarget.value)}
            // style={{ backgroundColor: "pink" }}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>

      {/* <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
        <ToggleButton id="tbg-radio-1" value={1} variant="warning">
          {firstRadio}
        </ToggleButton>
        <ToggleButton id="tbg-radio-3" value={2} variant="primary">
          {secondRadio}
        </ToggleButton>
      </ToggleButtonGroup> */}
    </>
  );
}
