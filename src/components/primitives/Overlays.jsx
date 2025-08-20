import { createPortal } from "react-dom";

const Overlays = ({ ElementToRender, divContainerId }) => {
  return createPortal(ElementToRender, divContainerId);
};

export default Overlays;
