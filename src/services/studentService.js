import apiClient from "./apiClient";

export const getStudentDetailsBasedOnUserId = async (user_id) => {
  try {
    const response = await apiClient.get(`/get_all_students_zip_files/${user_id}`);
    return response;
  } catch (error) {
    return error;
  }
};


export const getZipFileDetailsBasedOnZipFileId = async (zip_file_id) => {
  try {
    const response = await apiClient.get(`/get_all_files_within_zip_file/${zip_file_id}`);
    return response;
  } catch (error) {
    return error;
  }
};