import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { InputProps as InputPropsType } from "@/lib/types/input/input.types";

const inputVariants = cva(
  "block w-full rounded-md border bg-[hsl(var(--color-background))] text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted-foreground))] transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary))] focus:border-[hsl(var(--color-primary))]",
  {
    variants: {
      size: {
        sm: "px-2 py-1 text-xs h-8",
        md: "px-3 py-2 text-sm h-10",
        lg: "px-4 py-3 text-base h-12",
      },
      variant: {
        default: "border-[hsl(var(--color-input))]",
        error:
          "border-[hsl(var(--color-destructive))] focus:ring-[hsl(var(--color-destructive))] focus:border-[hsl(var(--color-destructive))]",
        success:
          "border-[hsl(var(--color-primary))] focus:ring-[hsl(var(--color-primary))] focus:border-[hsl(var(--color-primary))]",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      hasIcon: {
        true: "pl-10",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      fullWidth: false,
      hasIcon: false,
    },
  }
);

interface InputProps
  extends Omit<InputPropsType, "ref">,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  register?: unknown;
  labelPosition?: "top" | "bottom" | "left" | "right";
  success?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      name,
      type = "text",
      placeholder,
      error,
      helperText,
      leftIcon,
      rightIcon,
      size = "md",
      variant = "default",
      fullWidth = false,
      labelClassName,
      labelPosition = "top",
      className,
      register,
      success,
      ...props
    },
    ref
  ) => {
    const inputRef =
      register && typeof register === "function" ? undefined : ref;
    const inputProps =
      register && typeof register === "function" ? register(name) : {};
    const hasIcon = !!leftIcon;

    // Define flex direction based on labelPosition
    let direction = "flex-col";
    if (labelPosition === "bottom") direction = "flex-col-reverse";
    if (labelPosition === "left") direction = "flex-row";
    if (labelPosition === "right") direction = "flex-row-reverse";

    // Label margin logic
    const labelMargin =
      labelPosition === "left" || labelPosition === "right"
        ? "mb-0 mr-2"
        : "mb-1";

    // Compose aria-describedby for accessibility
    const describedBy =
      [
        helperText ? `${name}-helper-text` : null,
        error ? `${name}-error` : null,
        !error && success ? `${name}-success` : null,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className={cn("gap-1", fullWidth && "w-full", "flex", direction)}>
        {label && (
          <label
            htmlFor={name}
            className={cn(
              "text-sm font-medium text-[hsl(var(--color-foreground))]",
              labelMargin,
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <div className="relative flex-1 flex items-center">
          {leftIcon && (
            <span className="absolute left-3 flex items-center pointer-events-none text-[hsl(var(--color-muted-foreground))]">
              {leftIcon}
            </span>
          )}
          <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            ref={inputRef}
            className={cn(
              inputVariants({
                size,
                variant: error ? "error" : variant,
                fullWidth,
                hasIcon,
              }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            {...inputProps}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 flex items-center pointer-events-none text-[hsl(var(--color-muted-foreground))]">
              {rightIcon}
            </span>
          )}
        </div>
        {/* Helper text sempre visível, fonte pequena e cor sutil */}
        {helperText && (
          <span
            id={`${name}-helper-text`}
            className="mt-1 text-[10px] leading-tight text-[hsl(var(--color-muted-foreground))] font-normal"
          >
            {helperText}
          </span>
        )}
        {/* Mensagem de erro */}
        {error && (
          <span
            id={`${name}-error`}
            className="mt-1 text-xs text-[hsl(var(--color-destructive))] font-medium"
          >
            {error}
          </span>
        )}
        {/* Mensagem de sucesso (opcional) */}
        {!error && success && (
          <span
            id={`${name}-success`}
            className="mt-1 text-xs text-[hsl(var(--color-primary))] font-medium"
          >
            {success}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
