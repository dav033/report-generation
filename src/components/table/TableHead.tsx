import React from "react";

export default function TableHead({children}) {
  return <thead className="ltr:text-left rtl:text-right">
    {children}
  </thead>;
}
