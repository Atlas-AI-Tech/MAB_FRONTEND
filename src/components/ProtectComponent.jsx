import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectComponent = (WrappedComponent) => {
  const ComponentWithAuth = (props) => {
    const navigate = useNavigate();
    useEffect(() => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Please sign in to proceed.");
        navigate("/");
        return;
      }
    }, [navigate]);

    // Render the wrapped component only if authenticated
    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default ProtectComponent;
