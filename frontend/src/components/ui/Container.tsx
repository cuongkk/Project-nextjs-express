"use client";
import React, { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  padding?: boolean;
}

/**
 * Container Component
 *
 * Replaces the custom .contain CSS class
 * Provides consistent max-width wrapping
 *
 * Sizes:
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px
 * - xl: 1280px (default)
 * - full: 100%
 */
export const Container: React.FC<ContainerProps> = ({ children, size = "xl", className = "", padding = true }) => {
  const sizeClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-5xl",
    xl: "max-w-7xl",
    full: "w-full",
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${padding ? "px-4 sm:px-6 lg:px-8" : ""}
        mx-auto
        ${className}
      `}
    >
      {children}
    </div>
  );
};
