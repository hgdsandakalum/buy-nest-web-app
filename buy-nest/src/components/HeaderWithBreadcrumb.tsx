import React from "react";
import Link from "next/link";

interface HeaderWithBreadcrumbProps {
  title: string;
  buttonComponent?: React.ReactNode;
  isBreadcrumb?: boolean;
}

const HeaderWithBreadcrumb: React.FC<HeaderWithBreadcrumbProps> = ({
  title,
  buttonComponent,
  isBreadcrumb = true,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex flex-col ">
        <h1 className="text-2xl font-bold">{title}</h1>
        {isBreadcrumb ? (
          <div className="flex items-center space-x-2">
            <Link
              href="/dashboard"
              className="text-[#003f62] font-semibold hover:underline"
            >
              Dashboard
            </Link>
            <span className="text-gray-500">&gt;</span>
            <span className="text-gray-700">{title}</span>
          </div>
        ) : (
          <></>
        )}
      </div>
      {buttonComponent && <div>{buttonComponent}</div>}
    </div>
  );
};

export default HeaderWithBreadcrumb;
