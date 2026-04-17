"use client";
import React, { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, FormFieldProps {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, helperText, required, className = "", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`
            w-full px-4 py-2.5
            border border-gray-300 rounded-lg
            text-gray-900 placeholder-gray-400
            transition-all duration-200
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            hover:border-gray-400
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? "border-red-500 focus:ring-red-200 focus:border-red-500" : ""}
            ${className}
          `}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
      {helperText && !error && <p className="text-gray-500 text-xs mt-1.5">{helperText}</p>}
    </div>
  );
});
Input.displayName = "Input";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, FormFieldProps {
  options: Array<{ value: string; label: string }>;
}

/**
 * Reusable Select Component
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ label, error, helperText, required, options, className = "", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`
            w-full px-4 py-2.5
            border border-gray-300 rounded-lg
            text-gray-900 bg-white
            transition-all duration-200
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            hover:border-gray-400
            cursor-pointer
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? "border-red-500 focus:ring-red-200 focus:border-red-500" : ""}
            ${className}
          `}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
      {helperText && !error && <p className="text-gray-500 text-xs mt-1.5">{helperText}</p>}
    </div>
  );
});
Select.displayName = "Select";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FormFieldProps {}

/**
 * Reusable Textarea Component
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, helperText, required, className = "", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={`
            w-full px-4 py-2.5
            border border-gray-300 rounded-lg
            text-gray-900 placeholder-gray-400
            transition-all duration-200
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            hover:border-gray-400
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            resize-none
            ${error ? "border-red-500 focus:ring-red-200 focus:border-red-500" : ""}
            ${className}
          `}
        rows={4}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
      {helperText && !error && <p className="text-gray-500 text-xs mt-1.5">{helperText}</p>}
    </div>
  );
});
Textarea.displayName = "Textarea";
