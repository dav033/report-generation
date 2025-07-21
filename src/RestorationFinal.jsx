// FinalRestorationReport.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import useFormData from "./hooks/useFormData";
import Input from "./components/Input.jsx";
import TableHead from "./components/table/TableHead.tsx";
import HeadCell from "./components/table/HeadCell.tsx";
import TableBody from "./components/table/TableBody.tsx";
import RowInput from "./components/table/RowInput.tsx";
import FileUploader from "./components/FileUploader";
import { uploadImage } from "./utils.js";

// Función para limpiar datos (convierte null a valores seguros)
const cleanInitialData = (data) => {
  return {
    project_name: data.project_name || "",
    project_location: data.project_location || "",
    customer_name: data.customer_name || "",
    email: data.email || "",
    phone: data.phone || "",
    completion_date: data.completion_date || "",
    language: data.language || "",
    final_evaluation: data.final_evaluation || "",
    overview: data.overview || "",
    completed_activities: data.completed_activities || [],
    evidence_images: (data.evidence_images || []).map(e => ({
      description: e.description || "",
      imageFiles: e.imageFiles || [],
      imageIds: e.imageIds || []
    })),
    client_name: data.client_name || "",
  };
};

const initialData = cleanInitialData({
  project_name: "",
  project_location: "",
  customer_name: "",
  email: "",
  phone: "",
  completion_date: "",
  language: "",
  final_evaluation: "",
  overview: "",
  completed_activities: [],
  evidence_images: [],
  client_name: "",
});

function FinalRestorationReport() {
  const { formData, setFormData, handleInputChange } = useFormData(initialData);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      customer_name: prev.client_name || ""
    }));
  }, [formData.client_name, setFormData]);

  const [loading, setLoading] = useState(false);

  // Función segura para manejar cambios
  const safeHandleInputChange = (e) => {
    handleInputChange({
      ...e,
      target: {
        ...e.target,
        value: e.target.value === null ? "" : e.target.value
      }
    });
  };

  // Funciones para Completed Activities (array de strings)
  const handleActivityChange = (index, value) => {
    const safeValue = value === null ? "" : value;
    const updated = (formData.completed_activities || []).map((item, i) =>
      i === index ? safeValue : item
    );
    setFormData({ ...formData, completed_activities: updated });
  };

  const addActivityRow = () => {
    setFormData({
      ...formData,
      completed_activities: [...(formData.completed_activities || []), ""],
    });
  };

  const deleteActivityRow = (index) => {
    const updated = (formData.completed_activities || []).filter((_, i) => i !== index);
    setFormData({ ...formData, completed_activities: updated });
  };

  // Funciones para Evidence Images (objeto con description, imageFiles y imageIds)
  const handleEvidenceChange = (index, field, value) => {
    const safeValue = value === null ? "" : value;
    const updated = (formData.evidence_images || []).map((item, i) =>
      i === index ? { ...item, [field]: safeValue } : item
    );
    setFormData({ ...formData, evidence_images: updated });
  };

  const addEvidenceRow = () => {
    setFormData({
      ...formData,
      evidence_images: [
        ...(formData.evidence_images || []),
        { description: "", imageFiles: [], imageIds: [] },
      ],
    });
  };

  const deleteEvidenceRow = (index) => {
    const updated = (formData.evidence_images || []).filter((_, i) => i !== index);
    setFormData({ ...formData, evidence_images: updated });
  };

  const handleEvidenceFilesChange = (index, files) => {
    const safeFiles = files || [];
    handleEvidenceChange(index, "imageFiles", safeFiles);
  };

  // Manejo seguro de eliminación de archivos
  const handleRemoveEvidenceFile = (index, fileIndex) => {
    const currentFiles = formData.evidence_images[index]?.imageFiles || [];
    const newFiles = currentFiles.filter((_, idx) => idx !== fileIndex);
    handleEvidenceChange(index, "imageFiles", newFiles);
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Subir imágenes para evidence_images
      const evidenceImagesResponses = [];
      for (let i = 0; i < (formData.evidence_images || []).length; i++) {
        const row = formData.evidence_images[i];
        if (row.imageFiles && row.imageFiles.length > 0) {
          const responsesForRow = [];
          for (let j = 0; j < row.imageFiles.length; j++) {
            const res = await uploadImage(row.imageFiles[j], `${i}-${j}`);
            responsesForRow.push(res);
          }
          evidenceImagesResponses[i] = responsesForRow;
        }
      }

      // Actualizar imageIds para evidence_images
      const updatedEvidenceImages = (formData.evidence_images || []).map((row, i) => {
        if (row.imageFiles && evidenceImagesResponses[i]) {
          return { ...row, imageIds: evidenceImagesResponses[i] };
        }
        return row;
      });

      const finalData = {
        ...formData,
        evidence_images: updatedEvidenceImages,
      };

      // Envío de datos a la API
      const finalApiUrl =
        "https://hook.us1.make.com/ryrmjj7h6py9c0apei1lo186r80j4r5p";
      const response = await axios.post(finalApiUrl, { formData: finalData });
      window.location.href = response.data;
      setLoading(false);
    } catch (error) {
      console.error("Error durante el envío del formulario:", error);
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Campos generales */}
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Project Name"
                id="project_name"
                onChange={safeHandleInputChange}
                value={formData.project_name || ""}
              />
              <Input
                label="Project Location"
                id="project_location"
                onChange={safeHandleInputChange}
                value={formData.project_location || ""}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Client Name"
                id="client_name"
                onChange={safeHandleInputChange}
                value={formData.client_name || ""}
              />
              <Input
                label="Customer Name"
                id="customer_name"
                onChange={safeHandleInputChange}
                value={formData.customer_name || ""}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email"
                id="email"
                onChange={safeHandleInputChange}
                value={formData.email || ""}
              />
              <Input
                label="Phone"
                id="phone"
                onChange={safeHandleInputChange}
                value={formData.phone || ""}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Completion Date"
                id="completion_date"
                onChange={safeHandleInputChange}
                value={formData.completion_date || ""}
              />
              <Input
                label="Language"
                id="language"
                onChange={safeHandleInputChange}
                value={formData.language || ""}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label
                  htmlFor="final_evaluation"
                  className="relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 dark:border-gray-700 pt-4"
                >
                  <textarea
                    id="final_evaluation"
                    value={formData.final_evaluation || ""}
                    onChange={safeHandleInputChange}
                    placeholder="Final Evaluation"
                    rows="4"
                    className="peer w-full border-none bg-transparent p-0 placeholder-transparent focus:outline-none focus:ring-0 sm:text-sm dark:text-white"
                  ></textarea>
                  <span className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs dark:text-gray-200">
                    Final Evaluation
                  </span>
                </label>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="overview"
                  className="relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 dark:border-gray-700 pt-4"
                >
                  <textarea
                    id="overview"
                    value={formData.overview || ""}
                    onChange={safeHandleInputChange}
                    placeholder="Overview"
                    rows="4"
                    className="peer w-full border-none bg-transparent p-0 placeholder-transparent focus:outline-none focus:ring-0 sm:text-sm dark:text-white"
                  ></textarea>
                  <span className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs dark:text-gray-200">
                    Overview
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Tabla de Completed Activities */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Activities</h2>
            <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                  <TableHead>
                    <tr>
                      <HeadCell>Activity</HeadCell>
                      <HeadCell>Actions</HeadCell>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {(formData.completed_activities || []).map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <td className="p-4">
                          <RowInput
                            value={item || ""}
                            onChange={(e) =>
                              handleActivityChange(index, e.target.value)
                            }
                          />
                        </td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => deleteActivityRow(index)}
                            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
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
              className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Activity
            </button>
          </div>

          {/* Tabla de Evidence Images */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Evidence Images</h2>
            <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                  <TableHead>
                    <tr>
                      <HeadCell>Description</HeadCell>
                      <HeadCell>Images</HeadCell>
                      <HeadCell>Actions</HeadCell>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {(formData.evidence_images || []).map((row, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <td className="p-4">
                          <RowInput
                            value={row.description || ""}
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
                          <FileUploader
                            files={row.imageFiles || []}
                            onFilesChange={(files) =>
                              handleEvidenceFilesChange(index, files)
                            }
                            onRemoveFile={(fileIndex) => {
                              handleRemoveEvidenceFile(index, fileIndex);
                            }}
                            label="Upload Images"
                          />
                        </td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => deleteEvidenceRow(index)}
                            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
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
              className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Evidence Image
            </button>
          </div>

          {/* Botón para enviar el formulario */}
          <div className="flex flex-col sm:flex-row gap-4 justify-start mt-6">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700"
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