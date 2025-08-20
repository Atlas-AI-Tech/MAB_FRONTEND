import apiClient from "./apiClient";

// Upload a single file using FormData under the 'file' key
export const uploadSingleZipFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/upload-zip", formData);
  return response?.data ?? response;
};

// Upload multiple files sequentially (one request at a time)
export const uploadZipFilesSequentially = async (files = []) => {
  const results = [];
  for (const file of files) {
    try {
      const data = await uploadSingleZipFile(file);
      results.push({ fileName: file?.name, status: "fulfilled", data });
    } catch (error) {
      results.push({
        fileName: file?.name,
        status: "rejected",
        error: error?.response?.data ?? error?.message ?? error,
      });
    }
  }
  return results;
};
