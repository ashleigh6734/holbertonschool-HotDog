import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

export default function BasicPopover({
  placement,
  heading,
  body,
  buttonText,
  buttonClassName,
  headerClassName,
  bodyClassName,
}) {
  return (
    <>
      <OverlayTrigger
        trigger="click"
        key={placement}
        placement={placement}
        overlay={
          <Popover id={`popover-positioned-${placement}`}>
            <Popover.Header as="h3" className={headerClassName}>
              {heading}
            </Popover.Header>
            <Popover.Body className={bodyClassName}>{body}</Popover.Body>
          </Popover>
        }
      >
        <Button className={buttonClassName}>{buttonText}</Button>
      </OverlayTrigger>
    </>
  );
}
