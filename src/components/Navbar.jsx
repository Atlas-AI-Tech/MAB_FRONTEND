import { useEffect, useRef, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import logo from "../assets/logo.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutBoxOpen, setIsLogoutBoxOpen] = useState(false);
  const logoutBoxRef = useRef(null);

  const handleUserLogout = () => {
    setIsLogoutBoxOpen(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("customer_uuid");
    navigate("/");
  };

  useEffect(() => {
    if (isLogoutBoxOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener on component unmount or when isLogoutBoxOpen changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLogoutBoxOpen]);

  const handleClickOutside = (event) => {
    if (logoutBoxRef.current && !logoutBoxRef.current.contains(event.target)) {
      setIsLogoutBoxOpen(false); // Close the logout box if clicked outside
    }
  };

  return (
    <div className={`navbar `}>
      <div className="logo">
        <img src={logo} alt="Atlas AI logo" />
      </div>

      {/* <div className="logo-name">Atlas verification Agent</div> */}

      {!(location.pathname === "/") && (
        <>
          <div
            onClick={() => setIsLogoutBoxOpen(true)}
            className="profile-view"
          >
            <p>RR</p>
          </div>

          {isLogoutBoxOpen && (
            <div className="user-logout" ref={logoutBoxRef}>
              <div className="user-logout-header">
                <span>Logout</span>
                <span
                  onClick={() => setIsLogoutBoxOpen(false)}
                  style={{ cursor: "pointer" }}
                >
                  <FaXmark />
                </span>
              </div>
              <div className="user-logout-body">
                Are you sure you want to logout?
              </div>
              <div className="user-logout-footer">
                <button
                  onClick={() => setIsLogoutBoxOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button onClick={handleUserLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Navbar;
