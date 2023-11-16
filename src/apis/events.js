import axios from "axios";
import { API_URL, BACKEND_SERVER_PORT_ADDRESS } from "../utils/constants";

axios.defaults.baseURL = BACKEND_SERVER_PORT_ADDRESS;

export async function uploadPDF(payload) {
  try {
    const response = await axios.post(
      API_URL.UPLOAD_PDF,
      { file: payload },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status === 200) {
      return response;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function transformPDF(fileName, totalPages, checkboxStates) {
  console.log(fileName);
  try {
    const response = await axios.post(
      API_URL.TRANSFORM_PDF,
      {
        fileName: fileName,
        totalPages: totalPages,
        checkboxStates: checkboxStates,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      return response;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function downloadPDF(modifiedFilePath) {
  try {
    const response = await axios.get(API_URL.DOWNLOAD_NEW_PDF, {
      params: {
        modifiedFilePath: modifiedFilePath,
      },
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf",
      },
    });
    if (response.status === 200) {
      return response;
    }
  } catch (err) {
    console.error(err);
  }
}
