import React from "react";
export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col px-8 items-center justify-center">
      <div className="mt-6 mb-16 w-full max-w-md space-y-8 ">{children}</div>
    </div>
  );
};
