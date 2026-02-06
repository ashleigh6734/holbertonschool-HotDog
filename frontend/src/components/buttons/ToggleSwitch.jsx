import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { useNavigate, useLocation } from "react-router-dom";

export default function ToggleSwitch({
  firstRadio,
  secondRadio,
  firstPath,
  secondPath,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <ButtonGroup className="mb-4 mt-2">
        <ToggleButton
          key={1}
          id={`radio-${1}`}
          type="radio"
          name="radio"
          style={{
            backgroundColor:
              location.pathname === firstPath ? "#FFC72C" : "#1f3a5f",
            border: "none",
            color: location.pathname === firstPath ? "#1f3a5f" : "#FFC72C",
            fontWeight: "bold",
          }}
          size="sm"
          value={firstRadio}
          onClick={() => {
            navigate(firstPath);
          }}
        >
          {firstRadio}
        </ToggleButton>
        <ToggleButton
          key={2}
          id={`radio-${2}`}
          type="radio"
          name="radio"
          style={{
            backgroundColor:
              location.pathname === secondPath ? "#FFC72C" : "#1f3a5f",
            color: location.pathname === secondPath ? "#1f3a5f" : "#FFC72C",
            border: "none",
            fontWeight: "bold",
          }}
          size="sm"
          value={secondRadio}
          onClick={() => {
            navigate(secondPath);
          }}
        >
          {secondRadio}
        </ToggleButton>
      </ButtonGroup>
    </>
  );
}
