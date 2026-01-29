'use client';

import { ReactNode, cloneElement, isValidElement } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

const inputClassName = "w-full px-4 py-2.5 border border-medical-300 rounded-lg bg-white text-medical-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all";

export function FormField({ label, required, error, children, className = '' }: FormFieldProps) {
  // Автоматически применяем стили к input, textarea и select
  let styledChildren = children;
  
  if (isValidElement(children)) {
    const childType = children.type;
    const isInput = childType === 'input' || (typeof childType === 'string' && childType === 'input');
    const isTextarea = childType === 'textarea' || (typeof childType === 'string' && childType === 'textarea');
    const isSelect = childType === 'select' || (typeof childType === 'string' && childType === 'select');
    
    if (isInput || isTextarea || isSelect) {
      const existingClassName = (children.props as any)?.className || '';
      styledChildren = cloneElement(children as React.ReactElement<any>, {
        className: `${inputClassName} ${existingClassName}`.trim()
      });
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-medical-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="[&>input]:w-full [&>input]:px-4 [&>input]:py-2.5 [&>input]:border [&>input]:border-medical-300 [&>input]:rounded-lg [&>input]:bg-white [&>input]:text-medical-900 [&>input]:focus:outline-none [&>input]:focus:ring-2 [&>input]:focus:ring-primary-500 [&>input]:focus:border-primary-500 [&>textarea]:w-full [&>textarea]:px-4 [&>textarea]:py-2.5 [&>textarea]:border [&>textarea]:border-medical-300 [&>textarea]:rounded-lg [&>textarea]:bg-white [&>textarea]:text-medical-900 [&>textarea]:focus:outline-none [&>textarea]:focus:ring-2 [&>textarea]:focus:ring-primary-500 [&>textarea]:focus:border-primary-500 [&>select]:w-full [&>select]:px-4 [&>select]:py-2.5 [&>select]:border [&>select]:border-medical-300 [&>select]:rounded-lg [&>select]:bg-white [&>select]:text-medical-900 [&>select]:focus:outline-none [&>select]:focus:ring-2 [&>select]:focus:ring-primary-500 [&>select]:focus:border-primary-500">
        {styledChildren}
      </div>
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

