import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";
import App from "./App.jsx";
import ProtectComponent from "./components/ProtectComponent.jsx";
import Login from "./pages/auth/Login.jsx";
// import CompanyInsights from "./pages/company_insights/CompanyInsights.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
// import LoanOfficer from "./pages/loan_officer/LoanOfficer.jsx";
import store from "./redux/store.js";
import Upload from "./pages/upload/Upload.jsx";
import ZipFileDetails from "./pages/zipfileDetails/ZipFileDetails.jsx";
// user should sign in or access_token should be valid to access below components
const ProtectedDashboard = ProtectComponent(Dashboard);
const ProtectedUpload = ProtectComponent(Upload);
const ProtectedZipFileDetails = ProtectComponent(ZipFileDetails);

// const ProtectedCompanyInsights = ProtectComponent(CompanyInsights);
// const ProtectedLoanOfficer = ProtectComponent(LoanOfficer, "loan_officer_view");

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [ 
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/dashboard/:user_id",
        element: <ProtectedDashboard />,
      },

      {
        path: "/upload/:user_id",
        element: <ProtectedUpload />,
      },
      {
        path: "/zip/:zip_file_id",
        element: <ProtectedZipFileDetails />,
      },
    ],
    errorElement: <div>Error Page</div>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <RouterProvider router={appRouter} />
  </Provider>
);