import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "../../components/primitives/Modal";
import { updateUserInfo } from "../../redux/currentUserSlice";
import { updateIsModalOpen } from "../../redux/overlayElementsSlice";
import { getStudentDetailsBasedOnUserId } from "../../services/studentService";
// import { getAllProducts } from "../../services/dashboardService";
import "./Dashboard.scss";

const setCustomerContext = (customerId) => {};

const AddBorrowerModalContent = ({ closeModalHandler, setAllCustomers }) => {
  const dispatch = useDispatch();
  const { customerId } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    borrower_name: "",
    borrower_id: "",
    company_name: "",
    program: "",
    instrument_provider_name: "",
    instrument_provider_account_number: "",
    instrument_type: "",
  });
  const [errors, setErrors] = useState({});

  // Set up customer context when component mounts
  useEffect(() => {
    if (customerId) {
      setCustomerContext(customerId);
    }
  }, [customerId]);

  // Load products on component mount
  useEffect(() => {
    const getProducts = async () => {
      try {
        // const response = await getAllProducts();

        // // Filter products based on customerId
        // let filteredProducts = response.data;

        // // Check if customerId matches the specified values
        // const restrictedCustomerIds = [
        //   "f939f6f4-bfee-4344-9f9b-667dc8c48ccf",
        //   "7ab48a10-ed44-431a-99a4-4b3eae9db864",
        // ];

        // if (customerId && restrictedCustomerIds.includes(customerId)) {
        //   // Only show "education" for these specific customer IDs
        //   filteredProducts = response.data.filter(
        //     (product) => product.toLowerCase() === "education"
        //   );
        // }
        // setProducts(filteredProducts);

        // Sentry logging removed
      } catch (error) {
        console.error("Failed to fetch products:", error);
        // Sentry error logging removed
        toast.error("Could not load products. Please try again.");
      }
    };

    getProducts();
  }, [customerId]);

  const handleModalClose = () => {
    dispatch(updateIsModalOpen(false));
    setTimeout(closeModalHandler, 300);
  };

  const handleKeyDown = (e) => {
    // Prevent form submission on Enter key for all inputs
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Ensure we're getting the actual value and not undefined/null
    const cleanValue = value || "";

    setFormData((prev) => {
      const newFormData = { ...prev, [name]: cleanValue };
      return newFormData;
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Reset instrument provider name field when program changes from KOTAK to something else
  useEffect(() => {
    if (formData.program !== "KOTAK" && formData.instrument_provider_name) {
      setFormData((prev) => ({ ...prev, instrument_provider_name: "" }));
      // Clear instrument provider name error if it exists
      if (errors.instrument_provider_name) {
        setErrors((prev) => ({ ...prev, instrument_provider_name: "" }));
      }
    }
  }, [formData.program]);

  const validateForm = () => {
    const newErrors = {};

    // Trim and validate borrower name
    const borrowerName = (formData.borrower_name || "").trim();
    if (!borrowerName) {
      newErrors.borrower_name = "User name is required";
    }

    // Trim and validate borrower ID (phone)
    const borrowerId = (formData.borrower_id || "").trim();
    if (!borrowerId) {
      newErrors.borrower_id = "Phone number is required";
    } else if (!/^\d{10}$/.test(borrowerId)) {
      newErrors.borrower_id = "Phone number must be a valid 10-digit number";
    }

    // Trim and validate company name
    const companyName = (formData.company_name || "").trim();
    if (!companyName) {
      newErrors.company_name = "Company name is required";
    }

    // Validate program selection
    if (!formData.program || formData.program.trim() === "") {
      newErrors.program = "Please select a product";
    }

    // If program is KOTAK, instrument provider name is required
    if (formData.program === "KOTAK") {
      const instrumentProviderName = (
        formData.instrument_provider_name || ""
      ).trim();
      if (!instrumentProviderName) {
        newErrors.instrument_provider_name =
          "Instrument Provider name is required for Account Opening";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBorrowerInfoSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Create a cleaned version of formData for submission
    const cleanedFormData = {
      borrower_name: (formData.borrower_name || "").trim(),
      borrower_id: (formData.borrower_id || "").trim(),
      company_name: (formData.company_name || "").trim(),
      program: (formData.program || "").trim(),
      instrument_provider_name: (
        formData.instrument_provider_name || ""
      ).trim(),
      instrument_provider_account_number: (
        formData.instrument_provider_account_number || ""
      ).trim(),
    };

    // Temporarily update formData with cleaned values for validation
    const originalFormData = { ...formData };
    setFormData(cleanedFormData);

    if (!validateForm()) {
      // Restore original formData if validation fails
      setFormData(originalFormData);

      // Sentry validation logging removed
      return;
    }

    try {
      setIsLoading(true);

      // Prepare payload for addCustomer - always pass all required parameters
      let response;

      if (cleanedFormData.program === "KOTAK") {
        // For KOTAK, instrument provider name is required and should be passed
        // response = await addCustomer(
        //   cleanedFormData.borrower_name,
        //   cleanedFormData.borrower_id,
        //   cleanedFormData.company_name,
        //   cleanedFormData.program,
        //   cleanedFormData.instrument_provider_name,
        //   cleanedFormData.instrument_provider_account_number
        // );
      } else {
        // For other programs, don't pass instrument provider parameters at all
        // response = await addCustomer(
        //   cleanedFormData.borrower_name,
        //   cleanedFormData.borrower_id,
        //   cleanedFormData.company_name,
        //   cleanedFormData.program
        // );
      }

      if (response.status !== 201) {
        throw new Error("Error while adding customer");
      }

      setAllCustomers((prev) => [response.data, ...prev]);

      // Sentry breadcrumb logging removed

      toast.success("New borrower added successfully");
      handleModalClose();
    } catch (error) {
      // Sentry error logging removed
      toast.error("Error while adding new borrower");
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-borrower-modal-content">
      <form onSubmit={handleBorrowerInfoSubmit}>
        <div className="text-input">
          <label htmlFor="borrower_name">User Name</label>
          <input
            name="borrower_name"
            id="borrower_name"
            type="text"
            value={formData.borrower_name || ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={errors.borrower_name ? "error" : ""}
            autoComplete="off"
          />
          {errors.borrower_name && (
            <span className="error-message">{errors.borrower_name}</span>
          )}
        </div>

        <div className="text-input">
          <label htmlFor="borrower_id">Phone Number</label>
          <input
            name="borrower_id"
            id="borrower_id"
            type="tel"
            maxLength={10}
            value={formData.borrower_id || ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={errors.borrower_id ? "error" : ""}
            autoComplete="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
            }
          />
          {errors.borrower_id && (
            <span className="error-message">{errors.borrower_id}</span>
          )}
        </div>

        <div className="text-input">
          <label htmlFor="company_name">Company Name</label>
          <input
            name="company_name"
            id="company_name"
            type="text"
            value={formData.company_name || ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={errors.company_name ? "error" : ""}
            autoComplete="organization"
          />
          {errors.company_name && (
            <span className="error-message">{errors.company_name}</span>
          )}
        </div>

        <div className="text-input select-input">
          <label htmlFor="program">Product</label>
          <select
            name="program"
            id="program"
            value={formData.program || ""}
            onChange={handleInputChange}
            className={errors.program ? "error" : ""}
            disabled={isLoading || products?.length === 0}
          >
            <option value="">Select a product</option>
            {products?.map((product) => (
              <option key={product} value={product}>
                {product === "KOTAK"
                  ? "Account Opening"
                  : product === "MSME_OVERDRAFT"
                  ? "MSME Overdraft"
                  : product === "BANDHAN_BANK"
                  ? "Bandhan Bank"
                  : product}
              </option>
            ))}
          </select>
          {errors.program && (
            <span className="error-message">{errors.program}</span>
          )}
        </div>

        {/* Conditionally render Instrument Provider Name field if program is KOTAK */}
        {formData.program === "KOTAK" && (
          <>
            <div className="text-input">
              <label htmlFor="instrument_provider_name">
                Instrument Provider Name
              </label>
              <input
                name="instrument_provider_name"
                id="instrument_provider_name"
                type="text"
                value={formData.instrument_provider_name || ""}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className={errors.instrument_provider_name ? "error" : ""}
                autoComplete="off"
              />
              {errors.instrument_provider_name && (
                <span className="error-message">
                  {errors.instrument_provider_name}
                </span>
              )}
            </div>

            <div className="text-input">
              <label htmlFor="instrument_provider_account_number">
                Instrument Provider Account Number
              </label>
              <input
                name="instrument_provider_account_number"
                id="instrument_provider_account_number"
                type="text"
                value={formData.instrument_provider_account_number || ""}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginBottom: "5px",
              }}
            >
              <label
                htmlFor="instrument_type"
                style={{ margin: 0, minWidth: "120px", fontSize: "14px" }}
              >
                Instrument Type
              </label>
              <select
                name="instrument_type"
                id="instrument_type"
                value={formData.instrument_type || ""}
                onChange={handleInputChange}
                style={{
                  padding: "10px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <option value="">Select instrument type</option>
                <option value="Cheque">Cheque</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginBottom: "5px",
              }}
            >
              <label
                htmlFor="relationship"
                style={{ margin: 0, minWidth: "120px", fontSize: "14px" }}
              >
                Relationship
              </label>
              <select
                name="relationship"
                id="relationship"
                value={formData.relationship || ""}
                onChange={handleInputChange}
                style={{
                  padding: "10px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <option value="">Select relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Sibling">Sibling</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </>
        )}

        <div className="buttons">
          <button
            type="submit"
            disabled={isLoading}
            className={isLoading ? "loading" : ""}
          >
            {isLoading ? "Creating..." : "Create New User"}
          </button>
          <button type="button" onClick={handleModalClose} disabled={isLoading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const Dashboard = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user_id } = useParams();

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getStudentDetailsBasedOnUserId(user_id);
        setAllStudents(response?.data || []);
      } catch (e) {
        setAllStudents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudentDetails();
  }, [user_id]);

  const normalizeStatus = (value) => {
    const v = value ? String(value).toUpperCase() : "NULL";
    return v;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "is-pending";
      case "IN_PROGRESS":
        return "is-in-progress";
      case "COMPLETED":
        return "is-completed";
      case "FAILED":
        return "is-failed";
      case "UPLOADED":
        return "is-completed";
      case "NOT_APPLICABLE":
        return "is-na";
      case "NULL":
      default:
        return "is-null";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "In Progress";
      case "NOT_APPLICABLE":
        return "N/A";
      default:
        return status?.charAt(0) + status?.slice(1).toLowerCase();
    }
  };

  const truncateFileName = (name = "") => {
    if (!name) return "—";
    return name.length > 20 ? `${name.slice(0, 17)}...` : name;
  };

  const handleNavigateToExtractedFiles = (zipFileId) => {
    navigate(`/zip/${zipFileId}`);
  };

  const filteredRows = (allStudents || []).filter((row) =>
    (row?.file_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="main-content-dashboard"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div className="main-content-box">
        <div className="main-content-header">
          <button
            onClick={() => navigate(`/upload/${user_id}`)}
            className="add-user-btn"
          >
            Upload ZIP Files
          </button>

          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="main-content-table">
          <table>
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>File Name</th>
                <th>Upload Status</th>
                <th>Extraction Status</th>
                <th>Spreadsheet Status</th>
                <th style={{textAlign:"center"}}>File Details</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="loading-state">
                    Loading data...
                  </td>
                </tr>
              ) : filteredRows?.length ? (
                filteredRows?.map((row, index) => {
                  const uploadStatus = normalizeStatus(row?.upload_status);
                  const extractionStatus = normalizeStatus(row?.extraction_status);
                  const spreadsheetStatus = normalizeStatus(row?.spreadsheet_status);
                  return (
                    <tr key={row.uuid}>
                      <td>{index + 1}</td>
                      <td className="file-name-cell" title={row?.file_name || ""}>
                        {truncateFileName(row?.file_name)}
                      </td>
                      <td>
                        <span className={`status-pill ${getStatusClass(uploadStatus)}`}>
                          {getStatusLabel(uploadStatus)}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${getStatusClass(extractionStatus)}`}>
                          {getStatusLabel(extractionStatus)}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${getStatusClass(spreadsheetStatus)}`}>
                          {getStatusLabel(spreadsheetStatus)}
                        </span>
                      </td>
                      <td>
                        <button
                          className="extract-btn"
                          onClick={() => handleNavigateToExtractedFiles(row?.uuid)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    {searchTerm ? "No matching users found" : "No data found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
