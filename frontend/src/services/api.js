import axios from "axios";

const api = axios.create({
  baseURL:
    "https://rag-assistant-backend-6dca.onrender.com",
});

export const registerUser = async (data) => {
  const res = await api.post(
    "/auth/register",
    data
  );
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post(
    "/auth/login",
    data
  );
  return res.data;
};

export const uploadPdf = async (
  file,
  token
) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post(
    "/upload",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const askQuestion = async (
  question,
  token
) => {
  const res = await api.post(
    "/ask",
    { question },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export default api;