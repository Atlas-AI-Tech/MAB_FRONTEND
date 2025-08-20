import React, { useEffect, useMemo, useState } from 'react'
import "./ZipFileDetails.scss"
import { useParams } from 'react-router-dom';
import { getZipFileDetailsBasedOnZipFileId } from '../../services/studentService';

const ZipFileDetails = () => {
  const { zip_file_id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchZipFileDetails = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await getZipFileDetailsBasedOnZipFileId(zip_file_id);
        const payload = response?.data;
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload?.data
          : [];
        setDocuments(items);
      } catch (err) {
        setErrorMessage("Failed to load documents.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchZipFileDetails();
  }, [zip_file_id]);

  const normalizeStatus = (status) => {
    if (!status || typeof status !== "string") return "NULL";
    const trimmed = status.trim();
    if (trimmed === "") return "NULL";
    return trimmed.toUpperCase();
  };

  const statusToClass = (status) => {
    const s = normalizeStatus(status);
    switch (s) {
      case "PENDING":
        return "is-pending";
      case "SUCCESS":
        return "is-completed";
      case "FAILED":
        return "is-failed";
      case "NOT_APPLICABLE":
        return "is-na";
      case "NULL":
      default:
        return "is-null";
    }
  };

  const formatDocType = (docType) => {
    if (!docType) return "-";
    return String(docType)
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const cards = useMemo(() => {
    return documents.map((doc) => ({
      id: doc?.uuid || doc?.id || `${doc?.document_name}-${doc?.created_at}`,
      documentName: doc?.document_name || "-",
      documentType: doc?.document_type || "-",
      extractionStatus: normalizeStatus(doc?.extraction_status),
      classificationStatus: normalizeStatus(doc?.classification_status),
      applicationId: zip_file_id,
      createdAt: doc?.created_at || "",
    }));
  }, [documents, zip_file_id]);

  return (
    <div className='zip-file-details-container'>
      <div className='zip-file-details-header'>
        <h1>Zip File Details</h1>
        <div className='meta'>
          <span className='label'>Total Documents</span>
          <span className='count'>{cards.length} documents</span>
        </div>
      </div>

      <div className='zip-file-details-content'>
        {isLoading && (
          <div className='state loading'>Loading documents...</div>
        )}
        {!isLoading && errorMessage && (
          <div className='state error'>{errorMessage}</div>
        )}
        {!isLoading && !errorMessage && cards.length === 0 && (
          <div className='state empty'>No documents found.</div>
        )}

        <div className='cards-grid'>
          {cards.map((item) => (
            <div className='doc-card' key={item.id}>
              <div className='doc-card-header'>
                <div className='doc-name' title={item.documentName}>{item.documentName}</div>
              </div>

              <div className='doc-state-box'>
                <div className='state-row'>
                  <span className='state-label'>Classification</span>
                  <span className={`status-pill ${statusToClass(item.classificationStatus)}`}>
                    {item.classificationStatus.replace(/_/g, " ")}
                  </span>
                </div>
                <div className='state-row'>
                  <span className='state-label'>Extraction</span>
                  <span className={`status-pill ${statusToClass(item.extractionStatus)}`}>
                    {item.extractionStatus.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              <div className='doc-card-body'>
                {/* <div className='field'>
                  <span className='field-label'>Application ID</span>
                  <span className='field-value mono'>{item.applicationId}</span>
                </div> */}
                <div className='field'>
                  <span className='field-label'>Document Type</span>
                  <span className='field-value'>{formatDocType(item.documentType)}</span>
                </div>
                <div className='field'>
                  <span className='field-label'>Extraction Status</span>
                  <span className={`field-value pill ${statusToClass(item.extractionStatus)}`}>
                    {item.extractionStatus.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ZipFileDetails