import React, { useCallback, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { uploadSingleZipFile } from "../../services/zipService";
import "./Upload.scss";

const Upload = () => {
  const { user_id } = useParams();
  const fileInputRef = useRef(null);

  const [queuedFiles, setQueuedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const totalFiles = queuedFiles?.length || 0;
  const isAllSuccessful = useMemo(
    () => totalFiles > 0 && results.length === totalFiles && results.every((r) => r.status === "fulfilled"),
    [results, totalFiles]
  );

  const resetAll = useCallback(() => {
    setQueuedFiles([]);
    setIsUploading(false);
    setCurrentIndex(0);
    setResults([]);
  }, []);

  const validateZipFiles = (filesList) => {
    const allFiles = Array.from(filesList || []);
    const valid = [];
    const invalid = [];
    for (const file of allFiles) {
      const isZip = (file?.name || "").toLowerCase().endsWith(".zip");
      if (isZip) valid.push(file);
      else invalid.push(file?.name || "Unknown file");
    }
    if (invalid.length) {
      toast.error(`Only .zip files allowed. Ignored: ${invalid.slice(0, 3).join(", ")}${
        invalid.length > 3 ? ` and ${invalid.length - 3} more` : ""
      }`);
    }
    return valid;
  };

  const handleChooseFiles = useCallback(() => {
    if (isUploading) return;
    fileInputRef.current?.click();
  }, [isUploading]);

  const handleFilesSelected = async (e) => {
    if (isUploading) return;
    const files = validateZipFiles(e.target.files);
    if (!files.length) return;
    setQueuedFiles(files);
    setResults([]);
    setCurrentIndex(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (isUploading) return;
    const dt = e.dataTransfer;
    const files = validateZipFiles(dt?.files);
    if (!files.length) return;
    setQueuedFiles(files);
    setResults([]);
    setCurrentIndex(0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const startSequentialUpload = useCallback(async () => {
    if (!queuedFiles.length || isUploading) return [];
    const localResults = [];
    try {
      setIsUploading(true);
      setResults([]);
      for (let i = 0; i < queuedFiles.length; i += 1) {
        const file = queuedFiles[i];
        setCurrentIndex(i);
        try {
          const data = await uploadSingleZipFile(file);
          const successItem = { fileName: file?.name, status: "fulfilled", data };
          localResults.push(successItem);
          setResults((prev) => [...prev, successItem]);
        } catch (error) {
          const errorItem = {
            fileName: file?.name,
            status: "rejected",
            error: error?.response?.data ?? error?.message ?? error,
          };
          localResults.push(errorItem);
          setResults((prev) => [...prev, errorItem]);
        }
      }
      return localResults;
    } finally {
      setIsUploading(false);
    }
  }, [queuedFiles, isUploading]);

  const handleStartUpload = async () => {
    if (!queuedFiles.length) {
      toast.info("Please select .zip files to upload");
      return;
    }
    const finalResults = await startSequentialUpload();
    const total = finalResults.length;
    const finalFails = finalResults.filter((r) => r.status === "rejected").length;
    if (total > 0 && finalFails === 0) {
      toast.success("ZIP files uploaded successfully");
    } else if (total > 0) {
      toast.error(`${finalFails}/${total} ZIP files failed to upload`);
    }
  };

  const progressLabel = isUploading
    ? `Uploading ${Math.min(currentIndex + 1, totalFiles)} of ${totalFiles}...`
    : totalFiles
    ? `${totalFiles} file${totalFiles > 1 ? "s" : ""} in queue`
    : "No files selected";

  return (
    <div className="upload-page">
      <div
        className={`upload-rectangle ${isUploading ? "is-disabled" : ""} ${
          isDragActive ? "is-drag-active" : ""
        }`}
        onClick={handleChooseFiles}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        aria-disabled={isUploading}
        tabIndex={0}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,application/zip,application/x-zip-compressed"
          multiple
          onChange={handleFilesSelected}
          style={{ display: "none" }}
          disabled={isUploading}
        />
        <div className="rectangle-content">
          <div className="title">Upload ZIP files</div>
          <div className="subtitle">Only .zip files are allowed</div>
          {isUploading && (
            <div className="spinner" aria-label="Uploading" />
          )}
        </div>
      </div>

      <div className="queue-status">
        <div className="left">
          <span className="label">{progressLabel}</span>
          {isAllSuccessful && (
            <span className="success-pill">All uploads completed</span>
          )}
        </div>
        <div className="right">
          <button
            className="secondary"
            type="button"
            onClick={resetAll}
            disabled={isUploading || !totalFiles}
          >
            Clear
          </button>
          <button
            className={`primary ${isUploading ? "loading" : ""}`}
            type="button"
            onClick={handleStartUpload}
            disabled={isUploading || !totalFiles}
          >
            {isUploading ? "Uploading..." : "Start Upload"}
          </button>
        </div>
      </div>

      {!!queuedFiles.length && (
        <ul className="file-list">
          {queuedFiles.map((file, idx) => {
            const result = results[idx];
            return (
              <li key={`${file.name}-${idx}`} className="file-row">
                <span className="file-name" title={file.name}>
                  {file.name}
                </span>
                <span className={`status ${
                  result?.status === "fulfilled"
                    ? "is-success"
                    : result?.status === "rejected"
                    ? "is-error"
                    : idx < currentIndex
                    ? "is-pending"
                    : idx === currentIndex && isUploading
                    ? "is-in-progress"
                    : "is-waiting"
                }`}>
                  {result?.status === "fulfilled"
                    ? "Uploaded"
                    : result?.status === "rejected"
                    ? "Failed"
                    : idx === currentIndex && isUploading
                    ? "Uploading"
                    : idx < currentIndex
                    ? "Processed"
                    : "Waiting"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Upload;