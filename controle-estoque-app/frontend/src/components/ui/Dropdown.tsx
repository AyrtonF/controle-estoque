'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { MoreVertical } from 'lucide-react';

interface DropdownProps {
  trigger?: ReactNode;
  children: ReactNode;
}

export function Dropdown({ trigger, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
      >
        {trigger || <MoreVertical size={18} />}
      </button>

      {isOpen && (
        <div className="fixed bg-white rounded-md shadow-lg border border-gray-200 z-50 w-48"
             style={{
               top: dropdownRef.current ? `${dropdownRef.current.getBoundingClientRect().bottom + 8}px` : '0',
               left: dropdownRef.current ? `${dropdownRef.current.getBoundingClientRect().right - 192}px` : '0'
             }}>
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  onClick: () => void;
  icon?: ReactNode;
  children: ReactNode;
  variant?: 'default' | 'danger';
}

export function DropdownItem({ onClick, icon, children, variant = 'default' }: DropdownItemProps) {
  const colors = variant === 'danger' 
    ? 'text-red-600 hover:bg-red-50' 
    : 'text-gray-700 hover:bg-gray-100';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${colors} transition-colors`}
    >
      {icon}
      {children}
    </button>
  );
}
