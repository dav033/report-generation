import { useEffect, useState } from "react";
import axios from "axios";
import Input from "./components/Input.jsx";
import TableHead from "./components/table/TableHead.tsx";
import HeadCell from "./components/table/HeadCell.tsx";
import TableBody from "./components/table/TableBody.tsx";
import RowInput from "./components/table/RowInput.tsx";
import RowTextArea from "./components/table/RowTextArea.tsx";
import ImageUploader from "./components/ImageUploader.tsx";

function App() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([
    { area: "", category: "", comments: "", data_Sheet: "" },
  ]);

  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    living_area: "",
    link: "",
    project_details: [],
    language: "",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get("data");

    if (encodedData) {
      try {
        const decodedData = atob(encodedData);

        console.log("Decoded data:", decodedData);
        const parsedData = JSON.parse(decodedData);

        console.log("Parsed data:", parsedData);

        setFormData({
          name: parsedData.name || "",
          address: parsedData.address || "",
          living_area: parsedData.living_area || "",
          link: parsedData.link || "",
          project_details: parsedData.project_details || [],
          language: parsedData.language || "",
        });

        if (parsedData.project_details) {
          setRows(
            parsedData.project_details.map((project) => ({
              area: project.area || "",
              category: project.category || "",
              comments: project.comments || "",
              data_sheet: project.dataSheet || "",
            }))
          );
        }
      } catch (error) {
        console.error("Error decoding or parsing data:", error);
      }
    }
  }, []);

  const sendImageRequest = async (image, index) => {
    setLoading(true);
    const apiUrl = "https://hook.us1.make.com/gzmqvlipalsjxohvjncgtoe7xb8yxmx5";
    const form = new FormData();

    form.append("imageFile", image.file);
    form.append("description", image.description);
    form.append("imageIndex", index);
    form.append("language", formData.language);

    try {
      const response = await axios.post(apiUrl, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);
      return {
        res: response.data,
        originalDescription: image.description,
      };
    } catch (error) {
      console.error(`Error uploading image ${index}:`, error);
      setLoading(false);
      throw error;
    }
  };

  const sendFinalRequest = async (imageResponses) => {
    setLoading(true);
    const apiUrl = "https://hook.us1.make.com/s5oznk6dyri2a9csbtyif4keiufhtwpw";

    try {
      const completeImageData = imageResponses.map((response, index) => ({
        ...response,
        uploadDescription: images[index].description, // Add the original upload description
      }));

      const response = await axios.post(apiUrl, {
        formData: {
          ...formData,
          project_details: rows,
        },
        imageResponses: completeImageData, // Send the complete image data
      });

      console.log("Final request response:", response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error("Error in final request:", error);
      setLoading(false);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload images and collect responses with descriptions
      const imageResponses = [];
      for (const [index, image] of images.entries()) {
        const response = await sendImageRequest(image, index);
        imageResponses.push(response);
      }

      console.log("All images uploaded successfully:", imageResponses);

      // Send final request with form data and complete image responses
      const finalResponse = await sendFinalRequest(imageResponses);

      console.log("Final request completed successfully:", finalResponse);
      console.log("All requests completed successfully:", finalResponse);

      //redirigir a finalResponse

      window.location.href = finalResponse;
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      { area: "", category: "", comments: "", data_sheet: "" },
    ]);
  };

  const deleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
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
          {/* Form Fields Container */}
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Name"
                id="name"
                onChange={handleInputChange}
                value={formData.name}
              />
              <Input
                label="Address"
                id="address"
                onChange={handleInputChange}
                value={formData.address}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Living area"
                id="living_area"
                onChange={handleInputChange}
                value={formData.living_area}
              />
              <Input
                label="Link"
                id="link"
                onChange={handleInputChange}
                value={formData.link}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <TableHead>
                  <tr>
                    <HeadCell>Area</HeadCell>
                    <HeadCell>Category</HeadCell>
                    <HeadCell>Comments</HeadCell>
                    <HeadCell>Data Sheet</HeadCell>
                    <HeadCell>Actions</HeadCell>
                  </tr>
                </TableHead>

                <TableBody>
                  {rows.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="p-4">
                        <RowInput
                          value={row.area}
                          onChange={(e) =>
                            handleRowChange(index, "area", e.target.value)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <RowInput
                          value={row.category}
                          onChange={(e) =>
                            handleRowChange(index, "category", e.target.value)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <RowTextArea
                          value={row.comments}
                          onChange={(e) =>
                            handleRowChange(index, "comments", e.target.value)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <RowTextArea
                          value={row.data_sheet}
                          onChange={(e) =>
                            handleRowChange(index, "data_sheet", e.target.value)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => deleteRow(index)}
                          className="inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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

          {/* Buttons Container */}
          <div className="flex flex-col sm:flex-row gap-4 justify-start mt-6">
            <button
              type="button"
              onClick={handleAddRow}
              className="inline-flex items-center justify-center rounded-md bg-blue-500 px-6 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Row
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-green-500 px-6 py-3 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Submit Form
            </button>
          </div>

          <ImageUploader images={images} setImages={setImages} />
        </form>
      </div>
    </section>
  );
}

export default App;
