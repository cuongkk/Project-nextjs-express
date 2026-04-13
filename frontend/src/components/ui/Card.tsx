"use client";
import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  isHoverable?: boolean;
  onClick?: () => void;
}

/**
 * Reusable Card Component
 * - Clean minimal design with proper elevation
 * - Responsive padding
 * - Hover state for interactive cards
 */
export const Card: React.FC<CardProps> = ({ children, className = "", isHoverable = false, onClick }) => {
  return (
    <div
      className={`
        bg-white rounded-lg border border-neutral-200
        shadow-sm hover:shadow-md
        transition-all duration-300
        p-4 md:p-6
        ${isHoverable ? "cursor-pointer hover:border-blue-300 hover:shadow-lg" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex items-start justify-between mb-4 pb-4 border-b border-neutral-100">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
};

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = "" }) => {
  return <div className={`${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = "" }) => {
  return <div className={`flex items-center gap-3 mt-4 pt-4 border-t border-neutral-100 ${className}`}>{children}</div>;
};
