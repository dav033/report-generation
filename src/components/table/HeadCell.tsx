import React from "react";

export default function HeadCell({ children }) {
  return (
    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white text-start">
      {children}
    </th>
  );
}
