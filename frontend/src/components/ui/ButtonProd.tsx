"use client";
import React, { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", isLoading = false, icon, iconPosition = "left", fullWidth = false, disabled, className = "", children, ...props }, ref) => {
    // Size classes
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm font-medium",
      md: "px-4 py-2.5 text-sm font-semibold",
      lg: "px-6 py-3 text-base font-semibold",
    };

    // Variant classes
    const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-300 disabled:bg-blue-300",
      secondary: "bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 focus:ring-gray-300 disabled:bg-gray-300",
      danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-300 disabled:bg-red-300",
      ghost: "bg-transparent text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus:ring-blue-300",
      outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-300",
    };

    const baseClasses =
      "inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed font-sans";

    const finalClasses = `
      ${baseClasses}
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${fullWidth ? "w-full" : ""}
      ${className}
    `;

    return (
      <button ref={ref} disabled={disabled || isLoading} className={finalClasses} {...props}>
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : null}

        {icon && iconPosition === "left" && !isLoading && icon}
        {children}
        {icon && iconPosition === "right" && !isLoading && icon}
      </button>
    );
  },
);

Button.displayName = "Button";
