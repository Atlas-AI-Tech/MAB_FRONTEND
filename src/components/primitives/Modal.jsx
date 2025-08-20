import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateIsModalOpen } from "../../redux/overlayElementsSlice";
import Overlays from "./Overlays";

// All Modal Styles are written in app.scss
const ModalBox = ({ children, closeModal }) => {
  const { isModalOpen } = useSelector((store) => store.overlayElements);
  const dispatch = useDispatch();

  useEffect(() => {
    // Trigger animation after component mount
    requestAnimationFrame(() => {
      dispatch(updateIsModalOpen(true));
    });
  }, [dispatch]);

  // This handleOverlayClick is use to close the modal if user clicks outside the modal box
  const handleOverlayClick = (e) => {
    if (
      typeof e?.target?.className === "string" &&
      e?.target?.className?.includes("modal-overlay")
    ) {
      dispatch(updateIsModalOpen(false));
      // Wait for animation to complete before closing
      setTimeout(closeModal, 300);
    }
  };

  return (
    <div
      className={`modal-overlay ${isModalOpen ? "active" : ""}`}
      onClick={handleOverlayClick}
    >
      <div className={`modal ${isModalOpen ? "active" : ""}`}>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

// Modal content is only the content like input-box,button, charts etc and not Modal Box
// This modal takes to arguments, 1st Is the react element 2nd is the function to toggle state
const Modal = ({ children, setIsModalOpen }) => {
  const divContainerId = document.getElementById("overlays");

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Overlays
      ElementToRender={<ModalBox closeModal={closeModal}>{children}</ModalBox>}
      divContainerId={divContainerId}
    />
  );
};

export default Modal;
