import React from "react";

export default function RowInput({ value, onChange, ...rest }) {
  return (
    <input
      value={value}
      onChange={onChange}
      className="border border-gray-700 bg-gray-800 text-white rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...rest}  // Mantiene el resto de las propiedades pasadas, como placeholder, etc.
    />
  );
}
