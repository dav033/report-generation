// hooks/useFormData.js
import { useState, useEffect } from "react";

// Función para limpiar datos (convierte null a valores seguros)
const cleanData = (data) => {
  return {
    project_number: data.project_number || "",
    project_name: data.project_name || "",
    project_location: data.project_location || "",
    client_name: data.client_name || "",
    customer_name: data.customer_name || "",
    email: data.email || "",
    phone: data.phone || "",
    date_started: data.date_started || "",
    overview: data.overview || "",
    language: data.language || "",
    activities: (data.activities || []).map(a => ({
      activity: a.activity || "",
      imageFiles: a.imageFiles || [],
      imageIds: a.imageIds || []
    })),
    additional_activities: (data.additional_activities || []).map(a => ({
      activity: a.activity || "",
      imageFiles: a.imageFiles || [],
      imageIds: a.imageIds || []
    })),
    next_activities: data.next_activities || [],
    observations: data.observations || [],
  };
};

const useFormData = (initialData) => {
  const [formData, setFormData] = useState(cleanData(initialData));

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get("data");
    if (encodedData) {
      try {
        const decodedData = JSON.parse(atob(encodedData));
        
        // Limpiamos los datos decodificados
        const cleanedDecodedData = cleanData(decodedData);

        // Si client_name existe, lo reemplazamos con el valor de customer_name
        if ("client_name" in cleanedDecodedData && "customer_name" in cleanedDecodedData) {
          cleanedDecodedData.client_name = cleanedDecodedData.customer_name;
        }

        // Actualizamos solo los campos que ya existan en initialData
        setFormData((prev) => cleanData({ ...prev, ...cleanedDecodedData }));
      } catch (error) {
        console.error("Error decodificando los datos:", error);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value === null ? "" : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: value
    }));
  };

  return { 
    formData, 
    setFormData: (newData) => setFormData(cleanData(newData)),
    handleInputChange 
  };
};

export default useFormData;