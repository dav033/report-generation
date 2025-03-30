// utils/uploadImage.js
import axios from "axios";

export const uploadImage = async (image, identifier) => {
  const apiUrl = "https://hook.us1.make.com/gzmqvlipalsjxohvjncgtoe7xb8yxmx5";
  const form = new FormData();
  form.append("imageFile", image);
  form.append("imageIndex", identifier);
  const response = await axios.post(apiUrl, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
