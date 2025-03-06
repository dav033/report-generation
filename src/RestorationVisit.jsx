import { useState, useEffect } from "react";
import axios from "axios";
import Input from "./components/Input.jsx";
import TableHead from "./components/table/TableHead.tsx";
import HeadCell from "./components/table/HeadCell.tsx";
import TableBody from "./components/table/TableBody.tsx";
import RowInput from "./components/table/RowInput.tsx";

function RestorationVisit() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
    // Cada actividad tiene la descripción y opcionalmente la imagen asociada.
    activities: [], // Ejemplo: { activity: "", imageId: "", imageFile: null }
    additional_activities: [], // Misma estructura que activities
    // next_activities y observations son arrays de strings
    next_activities: [],
    observations: [],
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get("data");
    if (encodedData) {
      try {
        const decodedData = JSON.parse(atob(encodedData));
        setFormData({
          project_number: decodedData.project_number || "",
          project_name: decodedData.project_name || "",
          project_location: decodedData.project_location || "",
          client_name: decodedData.client_name || "",
          customer_name: decodedData.customer_name || "",
          email: decodedData.email || "",
          phone: decodedData.phone || "",
          date_started: decodedData.date_started || "",
          overview: decodedData.overview || "",
          language: decodedData.language || "",
          activities: decodedData.activities || [],
          additional_activities: decodedData.additional_activities || [],
          next_activities: decodedData.next_activities || [],
          observations: decodedData.observations || [],
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

  // Funciones para la tabla de Activities
  const handleActivityChange = (index, field, value) => {
    const updated = formData.activities.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, activities: updated });
  };

  const addActivityRow = () => {
    setFormData({
      ...formData,
      activities: [
        ...formData.activities,
        { activity: "", imageId: "", imageFile: null },
      ],
    });
  };

  const deleteActivityRow = (index) => {
    const updated = formData.activities.filter((_, i) => i !== index);
    setFormData({ ...formData, activities: updated });
  };

  // Funciones para la tabla de Additional Activities
  const handleAdditionalActivityChange = (index, field, value) => {
    const updated = formData.additional_activities.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, additional_activities: updated });
  };

  const addAdditionalActivityRow = () => {
    setFormData({
      ...formData,
      additional_activities: [
        ...formData.additional_activities,
        { activity: "", imageId: "", imageFile: null },
      ],
    });
  };

  const deleteAdditionalActivityRow = (index) => {
    const updated = formData.additional_activities.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, additional_activities: updated });
  };

  // Funciones para Next Activities (array de strings)
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

  // Funciones para Observations (array de strings)
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

  // Función para subir la imagen, igual que en el primer componente (sin descripción)
  const sendImageRequest = async (image, index) => {
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
      // Subir imágenes de activities
      const activitiesImageResponses = [];
      for (let i = 0; i < formData.activities.length; i++) {
        const row = formData.activities[i];
        if (row.imageFile) {
          const res = await sendImageRequest(row.imageFile, i);
          activitiesImageResponses[i] = res;
        }
      }
      // Subir imágenes de additional activities
      const additionalActivitiesImageResponses = [];
      for (let i = 0; i < formData.additional_activities.length; i++) {
        const row = formData.additional_activities[i];
        if (row.imageFile) {
          const res = await sendImageRequest(row.imageFile, i);
          additionalActivitiesImageResponses[i] = res;
        }
      }
      // Actualizar imageId en cada fila de activities y additional activities
      const updatedActivities = formData.activities.map((row, i) => {
        if (row.imageFile && activitiesImageResponses[i])
          return {
            ...row,
            imageId:
              activitiesImageResponses[i].imageId ||
              activitiesImageResponses[i],
          };
        return row;
      });
      const updatedAdditionalActivities = formData.additional_activities.map(
        (row, i) => {
          if (row.imageFile && additionalActivitiesImageResponses[i])
            return {
              ...row,
              imageId:
                additionalActivitiesImageResponses[i].imageId ||
                additionalActivitiesImageResponses[i],
            };
          return row;
        }
      );
      const finalData = {
        ...formData,
        activities: updatedActivities,
        additional_activities: updatedAdditionalActivities,
      };

      // Enviar los datos finales a la API
      setLoading(true);
      const finalApiUrl =
        "https://hook.us1.make.com/m8aizswomvuyttlq4mepsbbs6g1fr5ya";
      const response = await axios.post(finalApiUrl, { formData: finalData });

      console.log(response.data, "Owo")
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
                label="Project Number"
                id="project_number"
                onChange={handleInputChange}
                value={formData.project_number}
              />
              <Input
                label="Project Name"
                id="project_name"
                onChange={handleInputChange}
                value={formData.project_name}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Project Location"
                id="project_location"
                onChange={handleInputChange}
                value={formData.project_location}
              />
              <Input
                label="Client Name"
                id="client_name"
                onChange={handleInputChange}
                value={formData.client_name}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Customer Name"
                id="customer_name"
                onChange={handleInputChange}
                value={formData.customer_name}
              />
              <Input
                label="Email"
                id="email"
                onChange={handleInputChange}
                value={formData.email}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Phone"
                id="phone"
                onChange={handleInputChange}
                value={formData.phone}
              />
              <Input
                label="Date Started"
                id="date_started"
                onChange={handleInputChange}
                value={formData.date_started}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Overview"
                id="overview"
                onChange={handleInputChange}
                value={formData.overview}
              />
              <Input
                label="Language"
                id="language"
                onChange={handleInputChange}
                value={formData.language}
              />
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
                      <HeadCell>Image (opcional)</HeadCell>
                      <HeadCell>Actions</HeadCell>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {formData.activities.map((row, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="p-4">
                          <RowInput
                            value={row.activity}
                            onChange={(e) =>
                              handleActivityChange(
                                index,
                                "activity",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="file"
                            onChange={(e) =>
                              handleActivityChange(
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
                      <HeadCell>Image (opcional)</HeadCell>
                      <HeadCell>Actions</HeadCell>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {formData.additional_activities.map((row, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="p-4">
                          <RowInput
                            value={row.activity}
                            onChange={(e) =>
                              handleAdditionalActivityChange(
                                index,
                                "activity",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="file"
                            onChange={(e) =>
                              handleAdditionalActivityChange(
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
                  onChange={(e) =>
                    handleNextActivityChange(index, e.target.value)
                  }
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
                  onChange={(e) =>
                    handleObservationChange(index, e.target.value)
                  }
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
