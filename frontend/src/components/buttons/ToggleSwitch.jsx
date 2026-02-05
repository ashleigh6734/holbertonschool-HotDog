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
      <ButtonGroup>
        <ToggleButton
          key={1}
          id={`radio-${1}`}
          type="radio"
          // variant={
          //   location.pathname === firstPath
          //     ? "outline-warning"
          //     : "outline-primary"
          // }
          name="radio"
          style={{
            backgroundColor:
              location.pathname === firstPath ? "#FFA500" : "#191970",
          }}
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
          // variant={
          //   location.pathname === secondPath
          //     ? "outline-primary"
          //     : "outline-primary"
          // }
          name="radio"
          style={{
            backgroundColor:
              location.pathname === secondPath ? "#FFA500" : "#191970",
          }}
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
