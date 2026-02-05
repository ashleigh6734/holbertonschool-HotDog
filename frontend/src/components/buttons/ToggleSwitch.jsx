import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { useNavigate, useLocation } from "react-router-dom";

export default function ToggleSwitch({
  firstRadio,
  secondRadio,
  firstPath,
  secondPath,
}) {
  const radios = [
    { name: firstRadio, value: firstRadio, path: firstPath },
    { name: secondRadio, value: secondRadio, path: secondPath },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <ButtonGroup>
        {radios.map((radio, idx) => (
          <ToggleButton
            key={idx}
            id={`radio-${idx}-dummy`}
            type="radio"
            variant={idx % 2 ? "outline-warning" : "outline-primary"}
            name="radio"
            value={radio.value}
            checked={location.pathname === radio.path}
            onChange={() => navigate(radio.path)}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </>
  );
}
