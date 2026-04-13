"use client";
import React from "react";

export type BadgeVariant = "success" | "warning" | "error" | "info" | "default" | "primary";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Badge Component - For status, tags, and labels
 * Used for: Job status, skill tags, application status
 */
export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", size = "md", className = "" }) => {
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    error: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    primary: "bg-blue-50 text-blue-700 border-blue-200",
    default: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs font-medium rounded",
    md: "px-3 py-1.5 text-sm font-medium rounded-md",
  };

  return <span className={`inline-block border ${variants[variant]} ${sizes[size]} ${className}`}>{children}</span>;
};

interface SkillTagProps {
  name: string;
  onRemove?: () => void;
}

/**
 * Skill Tag - Used for display technology skills
 */
export const SkillTag: React.FC<SkillTagProps> = ({ name, onRemove }) => {
  return (
    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5 text-sm">
      <span className="text-blue-700 font-medium">{name}</span>
      {onRemove && (
        <button onClick={onRemove} className="text-blue-400 hover:text-blue-600 transition-colors" aria-label="Remove skill">
          ✕
        </button>
      )}
    </div>
  );
};

interface StatusBadgeProps {
  status: string;
  label?: string;
}

/**
 * Application Status Badge
 * Maps application statuses to colors
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const statusMap: Record<string, BadgeVariant> = {
    applied: "info",
    screening: "warning",
    accepted: "success",
    rejected: "error",
    pending: "warning",
  };

  return <Badge variant={statusMap[status] || "default"}>{label || status}</Badge>;
};
