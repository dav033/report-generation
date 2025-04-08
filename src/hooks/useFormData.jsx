// hooks/useFormData.js
import { useState, useEffect } from "react";

const useFormData = (initialData) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get("data");
    if (encodedData) {
      try {
        const decodedData = JSON.parse(atob(encodedData));

        // Si client_name existe, lo reemplazamos con el valor de customer_name
        if ("client_name" in decodedData && "customer_name" in decodedData) {
          decodedData.client_name = decodedData.customer_name;
        }

        // Actualizamos solo los campos que ya existan en initialData
        setFormData((prev) => ({ ...prev, ...decodedData }));
      } catch (error) {
        console.error("Error decodificando los datos:", error);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return { formData, setFormData, handleInputChange };
};

export default useFormData;
