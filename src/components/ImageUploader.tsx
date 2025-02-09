import React from "react";

export default function ImageUploader({images, setImages}) {


  // Manejar la subida de imágenes (Drag & Drop o File Input)
  const handleFileUpload = (event) => {
    event.preventDefault();
    const files = event.dataTransfer
      ? event.dataTransfer.files
      : event.target.files;

    const newImages = Array.from(files).map((file) => ({
      file: file as File,
      preview: URL.createObjectURL(file as Blob), // URL para la vista previa
      description: "",
    }));

    setImages([...images, ...newImages]);
  };

  // Manejar cambio de descripción de imagen
  const handleImageDescriptionChange = (index, value) => {
    const updatedImages = images.map((img, i) =>
      i === index ? { ...img, description: value } : img
    );
    setImages(updatedImages);
  };

  // Eliminar una imagen
  const deleteImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  return (
    <div className="w-4/6 mx-auto mt-8">
      {/* Zona de Drag & Drop */}
      <div
        className="border-2 border-dashed border-gray-700 rounded-lg p-6 bg-gray-800 text-white flex flex-col items-center cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileUpload}
      >
        <p className="text-gray-400">
          Arrastra y suelta imágenes aquí o haz clic para seleccionar
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="imageUpload"
        />
        <label
          htmlFor="imageUpload"
          className="cursor-pointer mt-4 bg-blue-500 px-4 py-2 rounded"
        >
          Subir Imágenes
        </label>
      </div>

      {/* Tabla de Imágenes */}
      <div className="overflow-x-auto rounded-lg border border-gray-700 mt-8">
        <table className="min-w-full divide-y divide-gray-700 bg-gray-900 text-white text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3">Imagen</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {images.map((img, index) => (
              <tr key={index} className="text-gray-200">
                <td className="px-4 py-3">
                  <img
                    src={img.preview}
                    alt="Preview"
className="w-16 h-16 object-cover rounded-full border border-gray-500 max-w-full"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    placeholder="Añadir descripción"
                    value={img.description}
                    onChange={(e) =>
                      handleImageDescriptionChange(index, e.target.value)
                    }
                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 w-full text-white"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => deleteImage(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
