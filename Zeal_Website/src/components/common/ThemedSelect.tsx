import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, Check, Search, X, AlertCircle } from 'lucide-react';

export interface OptionItem {
  value: string;
  label: string;
  count?: number;
  subtitle?: string;
  category?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ThemedSelectProps {
  label?: string;
  name?: string;
  id?: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (val: string, name?: string) => void;
  options: (OptionItem | string)[];
  placeholder?: string;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  menuStyle?: React.CSSProperties;
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export const ThemedSelect: React.FC<ThemedSelectProps> = ({label,name, id,icon, value,onChange, options, placeholder = 'Select an option...',style, buttonStyle, menuStyle, searchable = false, searchPlaceholder = 'Search options...',disabled = false, error, helperText, required = false, className,}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize string array or OptionItem array
  const normalizedOptions: OptionItem[] = useMemo(() => {
    return options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt));
  }, [options]);

  const selectedOption = normalizedOptions.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen, searchable]);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return normalizedOptions;
    const q = searchTerm.toLowerCase();
    return normalizedOptions.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.subtitle && o.subtitle.toLowerCase().includes(q)) ||
        (o.category && o.category.toLowerCase().includes(q)) ||
        o.value.toLowerCase().includes(q)
    );
  }, [normalizedOptions, searchable, searchTerm]);

  const handleSelect = (optValue: string) => {
    onChange(optValue, name);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={className}
      style={{ position: 'relative', width: '100%', boxSizing: 'border-box', ...style, }}>
      {/* Optional Top Label */}
      {label && (
        <label
          htmlFor={id}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.4px', }}>
          {icon && <span style={{ color: 'var(--zp-primary, #6828DC)', display: 'inline-flex' }}>{icon}</span>}
          <span>{label}</span>
          {required && <span style={{ color: '#EF4444' }}>*</span>}
        </label>
      )}

      {/* Dropdown Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          padding: '11px 14px',
          background: disabled ? '#F1F5F9' : isOpen ? '#FFFFFF' : '#FFFFFF',
          border: error
            ? '1.5px solid #EF4444'
            : isOpen
            ? '1.5px solid var(--zp-primary, #6828DC)'
            : '1.5px solid #CBD5E1',
          borderRadius: '12px',
          fontSize: '13.5px',
          fontWeight: 600,
          color: disabled ? '#94A3B8' : '#0F172A',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: isOpen
            ? '0 0 0 3px rgba(104, 40, 220, 0.14)'
            : '0 1px 2px rgba(15, 23, 42, 0.04)',
          transition: 'all 0.18s ease',
          outline: 'none',
          textAlign: 'left',
          boxSizing: 'border-box',
          ...buttonStyle,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
          {!label && icon && (
            <span style={{ color: 'var(--zp-primary, #6828DC)', display: 'flex', flexShrink: 0 }}>{icon}</span>
          )}
          {selectedOption?.icon && (
            <span style={{ display: 'inline-flex', flexShrink: 0 }}>{selectedOption.icon}</span>
          )}
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: selectedOption ? '#0F172A' : '#94A3B8', fontWeight: selectedOption ? 700 : 500, }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          size={16}
          style={{ color: disabled ? '#94A3B8' : 'var(--zp-primary, #6828DC)', flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',}}/>
      </button>

      {/* Floating Theme Dropdown Popover */}
      {isOpen && !disabled && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: '100%', minWidth: '220px',  background: '#FFFFFF', borderRadius: '14px',  border: '1.5px solid #E2E8F0', boxShadow: '0 14px 34px rgba(15, 23, 42, 0.14), 0 0 0 1px rgba(104, 40, 220, 0.08)', zIndex: 9999, overflow: 'hidden',  boxSizing: 'border-box', ...menuStyle, }}>
          {/* Search Bar inside Dropdown */}
          {searchable && (
            <div style={{ padding: '8px 12px', borderBottom: '1px solid #F1F5F9', background: '#FAF5FF', display: 'flex', alignItems: 'center', gap: '8px',}}
              onClick={(e) => e.stopPropagation()}
            >
              <Search size={14} color="var(--zp-primary, #6828DC)" style={{ flexShrink: 0 }} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '12.5px', fontWeight: 600, color: '#0F172A',}}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{background: '#EDE9FE', border: 'none', borderRadius: '50%',  width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--zp-primary, #6828DC)', flexShrink: 0,}}>
                  <X size={10} />
                </button>
              )}
            </div>
          )}

          {/* Options List with Theme Styling */}
          <div style={{ maxHeight: '250px', overflowY: 'auto', padding: '6px' }}>
            {filteredOptions.length === 0 ? (
              <div style={{ padding: '14px 12px', textAlign: 'center', fontSize: '12px', color: '#94A3B8' }}>
                No matching options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => !opt.disabled && handleSelect(opt.value)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: '10px', border: 'none', background: isSelected ? '#EDE9FE' : 'transparent', color: isSelected ? 'var(--zp-primary, #6828DC)' : opt.disabled ? '#94A3B8' : '#1E293B', fontSize: '12.5px', fontWeight: isSelected ? 800 : 500,  cursor: opt.disabled ? 'not-allowed' : 'pointer', textAlign: 'left', transition: 'background 0.15s ease', marginBottom: '2px', gap: '8px', boxSizing: 'border-box',}}
                    onMouseEnter={(e) => {
                      if (!isSelected && !opt.disabled) e.currentTarget.style.background = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected && !opt.disabled) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {opt.icon && <span style={{ flexShrink: 0 }}>{opt.icon}</span>}
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3, }}>
                          {opt.label}
                        </div>
                        {opt.subtitle && (
                          <div style={{fontSize: '10.5px', color: isSelected ? '#6828DC' : '#64748B', fontWeight: 500, marginTop: '2px', }}>
                            {opt.subtitle}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      {opt.count !== undefined && (
                        <span style={{ fontSize: '11px', color: isSelected ? 'var(--zp-primary, #6828DC)' : '#64748B', background: isSelected ? '#DDD6FE' : '#F1F5F9', padding: '2px 7px', borderRadius: '999px',  fontWeight: 700, }}>
                          {opt.count}
                        </span>
                      )}
                      {isSelected && <Check size={14} style={{ color: 'var(--zp-primary, #6828DC)' }} />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#EF4444', marginTop: '4px', fontWeight: 600, }}>
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text */}
      {!error && helperText && (
        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>{helperText}</div>
      )}
    </div>
  );
};
