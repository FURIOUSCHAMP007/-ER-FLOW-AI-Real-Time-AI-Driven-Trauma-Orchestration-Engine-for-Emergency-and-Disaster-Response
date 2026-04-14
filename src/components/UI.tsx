import React from 'react';
import { cn } from '../lib/utils';

export const Card = ({ className, children, onClick }: { className?: string, children: React.ReactNode, onClick?: () => void }) => (
  <div 
    className={cn("bg-[#151619] border border-[#2a2b2e] rounded-lg overflow-hidden", className)}
    onClick={onClick}
  >
    {children}
  </div>
);

export const Badge = ({ className, children, variant = 'default' }: { className?: string, children: React.ReactNode, variant?: 'default' | 'urgent' | 'warning' | 'success' }) => {
  const variants = {
    default: "bg-[#2a2b2e] text-[#8E9299]",
    urgent: "bg-[#FF4444]/20 text-[#FF4444] border border-[#FF4444]/30",
    warning: "bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/30",
    success: "bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/30",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider", variants[variant], className)}>
      {children}
    </span>
  );
};

export const Button = ({ className, children, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) => {
  const variants = {
    primary: "bg-[#FF4444] hover:bg-[#FF6666] text-white",
    secondary: "bg-[#2a2b2e] hover:bg-[#3a3b3e] text-[#FFFFFF]",
    ghost: "bg-transparent hover:bg-[#2a2b2e] text-[#8E9299] hover:text-white",
  };
  return (
    <button className={cn("px-4 py-2 rounded font-sans text-sm font-medium transition-colors disabled:opacity-50", variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

export const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    className={cn("w-full bg-[#0a0a0a] border border-[#2a2b2e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF4444] transition-colors placeholder:text-[#4a4b4e]", className)} 
    {...props} 
  />
);

export const TextArea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea 
    className={cn("w-full bg-[#0a0a0a] border border-[#2a2b2e] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF4444] transition-colors placeholder:text-[#4a4b4e] min-h-[100px]", className)} 
    {...props} 
  />
);
