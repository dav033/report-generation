import React from "react";

export default function BodyCell({ children }) {
  return (
    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
      {children}
    </td>
  );
}
