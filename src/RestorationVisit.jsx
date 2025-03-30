// RestorationVisit.jsx
import { useState } from "react";
import axios from "axios";
import useFormData from "./hooks/useFormData";
import FileUploader from "./components/FileUploader";
import Input from "./components/Input.jsx";
import TableHead from "./components/table/TableHead.tsx";
import HeadCell from "./components/table/HeadCell.tsx";
import TableBody from "./components/table/TableBody.tsx";
import RowInput from "./components/table/RowInput.tsx";
import { uploadImage } from "./utils";

const initialData = {
  project_number: "",
  project_name: "",
  project_location: "",
  client_name: "",
  customer_name: "",
  email: "",
  phone: "",
  date_started: "",
  overview: "",
  language: "",
  activities: [],
  additional_activities: [],
  next_activities: [],
  observations: [],
};

function RestorationVisit() {
  const { formData, setFormData, handleInputChange } = useFormData(initialData);
  const [loading, setLoading] = useState(false);

  // Funciones para Activities
  const handleActivityChange = (index, field, value) => {
    const updated = formData.activities.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, activities: updated });
  };

  const handleActivityFilesChange = (index, files) => {
    const updated = formData.activities.map((item, i) =>
      i === index ? { ...item, imageFiles: files } : item
    );
    setFormData({ ...formData, activities: updated });
  };

  const removeActivityFile = (rowIndex, fileIndex) => {
    const updated = formData.activities.map((row, i) => {
      if (i === rowIndex) {
        const newFiles = row.imageFiles.filter((_, idx) => idx !== fileIndex);
        return { ...row, imageFiles: newFiles };
      }
      return row;
    });
    setFormData({ ...formData, activities: updated });
  };

  const addActivityRow = () => {
    setFormData({
      ...formData,
      activities: [
        ...formData.activities,
        { activity: "", imageFiles: [], imageIds: [] },
      ],
    });
  };

  const deleteActivityRow = (index) => {
    const updated = formData.activities.filter((_, i) => i !== index);
    setFormData({ ...formData, activities: updated });
  };

  // Funciones para Additional Activities
  const handleAdditionalActivityChange = (index, field, value) => {
    const updated = formData.additional_activities.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, additional_activities: updated });
  };

  const handleAdditionalActivityFilesChange = (index, files) => {
    const updated = formData.additional_activities.map((item, i) =>
      i === index ? { ...item, imageFiles: files } : item
    );
    setFormData({ ...formData, additional_activities: updated });
  };

  const removeAdditionalActivityFile = (rowIndex, fileIndex) => {
    const updated = formData.additional_activities.map((row, i) => {
      if (i === rowIndex) {
        const newFiles = row.imageFiles.filter((_, idx) => idx !== fileIndex);
        return { ...row, imageFiles: newFiles };
      }
      return row;
    });
    setFormData({ ...formData, additional_activities: updated });
  };

  const addAdditionalActivityRow = () => {
    setFormData({
      ...formData,
      additional_activities: [
        ...formData.additional_activities,
        { activity: "", imageFiles: [], imageIds: [] },
      ],
    });
  };

  const deleteAdditionalActivityRow = (index) => {
    const updated = formData.additional_activities.filter((_, i) => i !== index);
    setFormData({ ...formData, additional_activities: updated });
  };

  // Funciones para Next Activities
  const handleNextActivityChange = (index, value) => {
    const updated = formData.next_activities.map((item, i) =>
      i === index ? value : item
    );
    setFormData({ ...formData, next_activities: updated });
  };

  const addNextActivity = () => {
    setFormData({
      ...formData,
      next_activities: [...formData.next_activities, ""],
    });
  };

  const deleteNextActivity = (index) => {
    const updated = formData.next_activities.filter((_, i) => i !== index);
    setFormData({ ...formData, next_activities: updated });
  };

  // Funciones para Observations
  const handleObservationChange = (index, value) => {
    const updated = formData.observations.map((item, i) =>
      i === index ? value : item
    );
    setFormData({ ...formData, observations: updated });
  };

  const addObservation = () => {
    setFormData({
      ...formData,
      observations: [...formData.observations, ""],
    });
  };

  const deleteObservation = (index) => {
    const updated = formData.observations.filter((_, i) => i !== index);
    setFormData({ ...formData, observations: updated });
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mostrar loading inmediatamente
    setLoading(true);
    try {
      // Subir imágenes para activities
      const activitiesImageResponses = [];
      for (let i = 0; i < formData.activities.length; i++) {
        const row = formData.activities[i];
        if (row.imageFiles && row.imageFiles.length > 0) {
          const responsesForRow = [];
          for (let j = 0; j < row.imageFiles.length; j++) {
            const res = await uploadImage(row.imageFiles[j], `${i}-${j}`);
            responsesForRow.push(res);
          }
          activitiesImageResponses[i] = responsesForRow;
        }
      }

      // Subir imágenes para additional activities
      const additionalActivitiesImageResponses = [];
      for (let i = 0; i < formData.additional_activities.length; i++) {
        const row = formData.additional_activities[i];
        if (row.imageFiles && row.imageFiles.length > 0) {
          const responsesForRow = [];
          for (let j = 0; j < row.imageFiles.length; j++) {
            const res = await uploadImage(row.imageFiles[j], `${i}-${j}`);
            responsesForRow.push(res);
          }
          additionalActivitiesImageResponses[i] = responsesForRow;
        }
      }

      // Actualizar imageIds en cada fila
      const updatedActivities = formData.activities.map((row, i) => {
        if (row.imageFiles && activitiesImageResponses[i]) {
          return { ...row, imageIds: activitiesImageResponses[i] };
        }
        return row;
      });

      const updatedAdditionalActivities = formData.additional_activities.map((row, i) => {
        if (row.imageFiles && additionalActivitiesImageResponses[i]) {
          return { ...row, imageIds: additionalActivitiesImageResponses[i] };
        }
        return row;
      });

      const finalData = {
        ...formData,
        activities: updatedActivities,
        additional_activities: updatedAdditionalActivities,
      };

      // Envío de datos a la API
      const finalApiUrl = "https://hook.us1.make.com/m8aizswomvuyttlq4mepsbbs6g1fr5ya";
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
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Campos generales */}
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Project Number" id="project_number" onChange={handleInputChange} value={formData.project_number} />
              <Input label="Project Name" id="project_name" onChange={handleInputChange} value={formData.project_name} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Project Location" id="project_location" onChange={handleInputChange} value={formData.project_location} />
              <Input label="Client Name" id="client_name" onChange={handleInputChange} value={formData.client_name} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Customer Name" id="customer_name" onChange={handleInputChange} value={formData.customer_name} />
              <Input label="Email" id="email" onChange={handleInputChange} value={formData.email} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Phone" id="phone" onChange={handleInputChange} value={formData.phone} />
              <Input label="Date Started" id="date_started" onChange={handleInputChange} value={formData.date_started} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label
                  htmlFor="overview"
                  className="relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 dark:border-gray-700 pt-4"
                >
                  <textarea
                    id="overview"
                    value={formData.overview}
                    onChange={handleInputChange}
                    placeholder="Overview"
                    rows="4"
                    className="peer w-full border-none bg-transparent p-0 placeholder-transparent focus:outline-none focus:ring-0 sm:text-sm dark:text-white"
                  ></textarea>
                  <span className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs dark:text-gray-200">
                    Overview
                  </span>
                </label>
              </div>
              <Input label="Language" id="language" onChange={handleInputChange} value={formData.language} />
            </div>
          </div>

          {/* Tabla de Activities */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Activities</h2>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <TableHead>
                    <tr>
                      <HeadCell>Activity</HeadCell>
                      <HeadCell>Images (opcional)</HeadCell>
                      <HeadCell>Actions</HeadCell>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {formData.activities.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="p-4">
                          <RowInput
                            value={row.activity}
                            onChange={(e) => handleActivityChange(index, "activity", e.target.value)}
                          />
                        </td>
                        <td className="p-4">
                          <FileUploader
                            files={row.imageFiles}
                            onFilesChange={(files) => handleActivityFilesChange(index, files)}
                            onRemoveFile={(fileIndex) => removeActivityFile(index, fileIndex)}
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

          {/* Tabla de Additional Activities */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Additional Activities</h2>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <TableHead>
                    <tr>
                      <HeadCell>Activity</HeadCell>
                      <HeadCell>Images (opcional)</HeadCell>
                      <HeadCell>Actions</HeadCell>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {formData.additional_activities.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="p-4">
                          <RowInput
                            value={row.activity}
                            onChange={(e) => handleAdditionalActivityChange(index, "activity", e.target.value)}
                          />
                        </td>
                        <td className="p-4">
                          <FileUploader
                            files={row.imageFiles}
                            onFilesChange={(files) => handleAdditionalActivityFilesChange(index, files)}
                            onRemoveFile={(fileIndex) => removeAdditionalActivityFile(index, fileIndex)}
                          />
                        </td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => deleteAdditionalActivityRow(index)}
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
              onClick={addAdditionalActivityRow}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-500 px-6 py-3 text-sm font-medium text-white hover:bg-blue-600"
            >
              Add Additional Activity
            </button>
          </div>

          {/* Sección de Next Activities */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Next Activities</h2>
            {formData.next_activities.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  className="border p-2 rounded"
                  value={item}
                  onChange={(e) => handleNextActivityChange(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => deleteNextActivity(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addNextActivity}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Add Next Activity
            </button>
          </div>

          {/* Sección de Observations */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Observations</h2>
            {formData.observations.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  className="border p-2 rounded"
                  value={item}
                  onChange={(e) => handleObservationChange(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => deleteObservation(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addObservation}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Add Observation
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

export default RestorationVisit;
