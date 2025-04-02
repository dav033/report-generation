function FileUploader({ files = [], onFilesChange, onRemoveFile, label = "Upload Images" }) {
  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Combine existing files with newly selected files
    const newFiles = [...files, ...selectedFiles];
    onFilesChange(newFiles);
  };

  return (
    <div>
      <label className="block cursor-pointer">
        <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
        <input type="file" multiple onChange={handleChange} className="hidden" />
        <span className="inline-block rounded-md border border-gray-300 bg-white py-2 px-4 text-center text-sm text-gray-600 hover:bg-gray-50">
          Choose Files
        </span>
      </label>
      {files && files.length > 0 && (
        <ul className="mt-2">
          {files.map((file, fileIndex) => (
            <li key={fileIndex} className="flex items-center justify-between border p-1 rounded mb-1">
              <span className="text-sm text-gray-700 truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => onRemoveFile(fileIndex)}
                className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default FileUploader;