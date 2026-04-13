"use client";
import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { colors, spacing, transitions, borderRadius } from "@/theme/tokens";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  className = "",
  children,
  ...props
}) => {
  // Size styles
  const sizeStyles = {
    sm: `px-${spacing[3]} py-${spacing[1]} text-xs font-semibold`,
    md: `px-${spacing[4]} py-${spacing[2]} text-sm font-semibold`,
    lg: `px-${spacing[5]} py-${spacing[3]} text-base font-semibold`,
  };

  // Variant styles
  const variantStyles = {
    primary: `bg-[${colors.primary[500]}] text-white hover:bg-[${colors.primary[600]}] active:bg-[${colors.primary[700]}]`,
    secondary: `bg-[${colors.secondary[500]}] text-white hover:bg-[${colors.secondary[600]}] active:bg-[${colors.secondary[700]}]`,
    danger: `bg-[${colors.error[500]}] text-white hover:bg-[${colors.error[600]}] active:bg-[${colors.error[700]}]`,
    ghost: `bg-transparent text-[${colors.primary[500]}] hover:bg-[${colors.primary[50]}]`,
    outline: `border-2 border-[${colors.neutral[300]}] text-[${colors.neutral[700]}] hover:bg-[${colors.neutral[50]}]`,
  };

  const baseStyles = `
    inline-flex items-center justify-center gap-${spacing[2]}
    rounded-[${borderRadius.md}]
    transition-all ${transitions.fast}
    cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
    font-sans
  `;

  const finalClass = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  return (
    <button className={finalClass} disabled={isDisabled || isLoading} {...props}>
      {isLoading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
};
