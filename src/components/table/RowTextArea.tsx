import React from "react";

export default function RowTextArea(props) {
  return (
    <textarea
      {...props}
className="resize-none border border-gray-700 bg-gray-800 text-white rounded px-4 py-2 w-full min-h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
    ></textarea>
  );
}
