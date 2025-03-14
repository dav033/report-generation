import { useState, useEffect } from "react";
import axios from "axios";
import Input from "./components/Input.jsx";
import TableHead from "./components/table/TableHead.tsx";
import HeadCell from "./components/table/HeadCell.tsx";
import TableBody from "./components/table/TableBody.tsx";
import RowInput from "./components/table/RowInput.tsx";

function FinalRestorationReport() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Campos generales (sin project_number)
    project_name: "",
    project_location: "",
    client_name: "",
    customer_name: "",
    email: "",
    phone: "",
    // Renombrado date_started a completion_date
    completion_date: "",
    // Se agrega language para enviarlo en el submit
    language: "",
    // Se agrega final_evaluation que ahora será un textarea
    final_evaluation: "",
    overview: "",
    // completed_activities es ahora un array de strings
    completed_activities: [],
    // Sección para evidencias con imágenes
    evidence_images: [],
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get("data");
    if (encodedData) {
      try {
        const decodedData = JSON.parse(atob(encodedData));
        console.log("Decoded data:", decodedData);

        setFormData({
          project_name: decodedData.project_name || "",
          project_location: decodedData.project_location || "",
          client_name: decodedData.client_name || "",
          customer_name: decodedData.contact_name || "",
          email: decodedData.email || "",
          phone: decodedData.phone || "",
          completion_date: decodedData.completion_date || "",
          language: decodedData.language || "",
          final_evaluation: decodedData.final_evaluation || "",
          overview: decodedData.overview || "",
          completed_activities: decodedData.completed_activities || [],
          evidence_images: decodedData.evidence_images || [],
        });
      } catch (error) {
        console.error("Error decodificando los datos:", error);
      }
    }
  }, []);

  // Manejo de inputs generales
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Manejo de Completed Activities (array de strings)
  const handleActivityChange = (index, value) => {
    const updated = formData.completed_activities.map((item, i) =>
      i === index ? value : item
    );
    setFormData({ ...formData, completed_activities: updated });
  };

  const addActivityRow = () => {
    setFormData({
      ...formData,
      completed_activities: [...formData.completed_activities, ""],
    });
  };

  const deleteActivityRow = (index) => {
    const updated = formData.completed_activities.filter((_, i) => i !== index);
    setFormData({ ...formData, completed_activities: updated });
  };

  // Manejo de Evidence Images (descripción + imagen)
  const handleEvidenceChange = (index, field, value) => {
    const updated = formData.evidence_images.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, evidence_images: updated });
  };

  const addEvidenceRow = () => {
    setFormData({
      ...formData,
      evidence_images: [
        ...formData.evidence_images,
        { description: "", imageFile: null, imageId: "" },
      ],
    });
  };

  const deleteEvidenceRow = (index) => {
    const updated = formData.evidence_images.filter((_, i) => i !== index);
    setFormData({ ...formData, evidence_images: updated });
  };

  // Función para subir la imagen (solo se usa en Evidence Images)
  const sendImageRequest = async (image, index) => {
    console.log("Subiendo imagen", image, index);
    setLoading(true);
    const apiUrl = "https://hook.us1.make.com/gzmqvlipalsjxohvjncgtoe7xb8yxmx5";
    const form = new FormData();
    form.append("imageFile", image);
    form.append("imageIndex", index);
    try {
      const response = await axios.post(apiUrl, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error(`Error uploading image ${index}:`, error);
      setLoading(false);
      throw error;
    }
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Subir imágenes de evidence_images
      const evidenceImagesResponses = [];
      for (let i = 0; i < formData.evidence_images.length; i++) {
        const row = formData.evidence_images[i];
        if (row.imageFile) {
          const res = await sendImageRequest(row.imageFile, i);
          evidenceImagesResponses[i] = res;
        }
      }

      // Actualizar imageId en cada fila de evidence_images
      const updatedEvidenceImages = formData.evidence_images.map((row, i) => {
        if (row.imageFile && evidenceImagesResponses[i]) {
          return {
            ...row,
            imageId:
              evidenceImagesResponses[i].imageId || evidenceImagesResponses[i],
          };
        }
        return row;
      });

      // Generamos la data final a enviar, incluyendo language y final_evaluation
      const finalData = {
        ...formData,
        evidence_images: updatedEvidenceImages,
      };

      // Enviar los datos finales a la API
      setLoading(true);
      const finalApiUrl =
        "https://hook.us1.make.com/ryrmjj7h6py9c0apei1lo186r80j4r5p";
      const response = await axios.post(finalApiUrl, { formData: finalData });

      console.log(response.data, "Owo");
      window.location.href = response.data;
      setLoading(false);
    } catch (error) {
      console.error("Error durante el envío del formulario:", error);
    }
  };

  return (
    <section className="min-h-screen w-full bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Campos generales */}
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Project Name"
                id="project_name"
                onChange={handleInputChange}
                value={formData.project_name}
              />
              <Input
                label="Project Location"
                id="project_location"
                onChange={handleInputChange}
                value={formData.project_location}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Client Name"
                id="client_name"
                onChange={handleInputChange}
                value={formData.client_name}
              />
              <Input
                label="Customer Name"
                id="customer_name"
                onChange={handleInputChange}
                value={formData.customer_name}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email"
                id="email"
                onChange={handleInputChange}
                value={formData.email}
              />
              <Input
                label="Phone"
                id="phone"
                onChange={handleInputChange}
                value={formData.phone}
              />
            </div>
            {/* Completion Date, Language y Final Evaluation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Completion Date"
                id="completion_date"
                onChange={handleInputChange}
                value={formData.completion_date}
              />
              <Input
                label="Language"
                id="language"
                onChange={handleInputChange}
                value={formData.language}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Final Evaluation como textarea */}
              <div className="flex flex-col">
                <label
                  htmlFor="final_evaluation"
                  className="relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 focus-within:border-blue-600 dark:border-gray-700 pt-4"
                >
                  <textarea
                    id="final_evaluation"
                    value={formData.final_evaluation}
                    onChange={handleInputChange}
                    placeholder="Final Evaluation"
                    rows="4"
                    className="peer w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm dark:text-white"
                  ></textarea>
                  <span className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs dark:text-gray-200">
                    Final Evaluation
                  </span>
                </label>
              </div>
              {/* Textarea para Overview */}
              <div className="flex flex-col">
                <label
                  htmlFor="overview"
                  className="relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 focus-within:border-blue-600 dark:border-gray-700 pt-4"
                >
                  <textarea
                    id="overview"
                    value={formData.overview}
                    onChange={handleInputChange}
                    placeholder="Overview"
                    rows="4"
                    className="peer w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm dark:text-white"
                  ></textarea>
                  <span className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs dark:text-gray-200">
                    Overview
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Tabla de Completed Activities (array de strings) */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Activities</h2>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <TableHead>
                    <tr>
                      <HeadCell>Activity</HeadCell>
                      <HeadCell>Actions</HeadCell>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {formData.completed_activities.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="p-4">
                          <RowInput
                            value={item}
                            onChange={(e) =>
                              handleActivityChange(index, e.target.value)
                            }
                          />
                        </td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => deleteActivityRow(index)}
                            className="inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </TableBody>
                </table>
              </div>
            </div>
            <button
              type="button"
              onClick={addActivityRow}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-500 px-6 py-3 text-sm font-medium text-white hover:bg-blue-600"
            >
              Add Activity
            </button>
          </div>

          {/* Sección: Evidence Images (con imágenes) */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Evidence Images</h2>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <TableHead>
                    <tr>
                      <HeadCell>Description</HeadCell>
                      <HeadCell>Image</HeadCell>
                      <HeadCell>Actions</HeadCell>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {formData.evidence_images.map((row, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="p-4">
                          <RowInput
                            value={row.description}
                            onChange={(e) =>
                              handleEvidenceChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="file"
                            onChange={(e) =>
                              handleEvidenceChange(
                                index,
                                "imageFile",
                                e.target.files[0]
                              )
                            }
                          />
                        </td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => deleteEvidenceRow(index)}
                            className="inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </TableBody>
                </table>
              </div>
            </div>
            <button
              type="button"
              onClick={addEvidenceRow}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-500 px-6 py-3 text-sm font-medium text-white hover:bg-blue-600"
            >
              Add Evidence Image
            </button>
          </div>

          {/* Botón para enviar el formulario */}
          <div className="flex flex-col sm:flex-row gap-4 justify-start mt-6">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-green-500 px-6 py-3 text-sm font-medium text-white hover:bg-green-600"
            >
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default FinalRestorationReport;
