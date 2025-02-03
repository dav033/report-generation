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
    const apiUrl = "https://hook.us1.make.com/gzmqvlipalsjxohvjncgtoe7xb8yxmx5";
    const form = new FormData();

    form.append("imageFile", image.file);
    form.append("description", image.description);
    form.append("imageIndex", index);

    try {
      const response = await axios.post(apiUrl, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Include the original description in the response
      return {
        res: response.data,
        originalDescription: image.description,
      };
    } catch (error) {
      console.error(`Error uploading image ${index}:`, error);
      throw error;
    }
  };

  const sendFinalRequest = async (imageResponses) => {
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
      return response.data;
    } catch (error) {
      console.error("Error in final request:", error);
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
    <section className="py-20 px-20">
      <form onSubmit={handleSubmit}>
        <div className="mr-auto ml-auto bg-blue-">
          <div className="grid grid-cols-2 gap-4 mb-6 w-3/4 mr-auto ml-auto">
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

          <div className="grid grid-cols-2 gap-4 w-3/4 mr-auto ml-auto">
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

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 w-4/6 mr-auto ml-auto mt-16">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm dark:divide-gray-700 dark:bg-gray-900">
            <TableHead>
              <tr>
                <HeadCell>area</HeadCell>
                <HeadCell>category</HeadCell>
                <HeadCell>comments</HeadCell>
                <HeadCell>data Sheet</HeadCell>
                <HeadCell>Actions</HeadCell>
              </tr>
            </TableHead>

            <TableBody>
              {rows.map((row, index) => (
                <tr key={index} className="text-gray-700 dark:text-gray-200">
                  <td className="px-4 py-3">
                    <RowInput
                      value={row.area}
                      onChange={(e) =>
                        handleRowChange(index, "area", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <RowInput
                      value={row.category}
                      onChange={(e) =>
                        handleRowChange(index, "category", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <RowTextArea
                      value={row.comments}
                      onChange={(e) =>
                        handleRowChange(index, "comments", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <RowTextArea
                      value={row.data_sheet}
                      onChange={(e) =>
                        handleRowChange(index, "data_sheet", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteRow(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </TableBody>
          </table>

          <button
            type="button"
            onClick={handleAddRow}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Add Row
          </button>
        </div>

        <ImageUploader images={images} setImages={setImages} />

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded mt-6"
        >
          Submit Form
        </button>
      </form>
    </section>
  );
}

export default App;
