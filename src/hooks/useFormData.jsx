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
        // Actualizamos sólo los campos que ya existan en initialData para evitar
        // sobreescribir propiedades específicas de cada formulario.
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
