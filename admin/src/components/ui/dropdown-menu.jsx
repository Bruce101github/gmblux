"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const DropdownMenu = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

const DropdownMenuTrigger = React.forwardRef(
  ({ className, children, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("outline-none", className)}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef(
  ({ className, children, align = "end", open, ...props }, ref) => {
    if (!open) return null;

    const alignClasses = {
      start: "left-0",
      center: "left-1/2 -translate-x-1/2",
      end: "right-0",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 mt-1 min-w-[160px] rounded-md border border-white/20 bg-[#121420] p-1 shadow-lg",
          alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef(
  (
    { className, children, onSelect, disabled, icon: Icon, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-white outline-none transition-colors",
          "hover:bg-white/10 focus:bg-white/10",
          disabled && "pointer-events-none opacity-50",
          className
        )}
        onClick={onSelect}
        disabled={disabled}
        {...props}
      >
        {Icon && <Icon size={16} className="text-white/60" />}
        {children}
      </button>
    );
  }
);
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("my-1 h-px bg-white/10", className)}
        {...props}
      />
    );
  }
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};

