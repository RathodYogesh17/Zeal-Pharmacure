import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  ArrowRight,
  Clock,
  RotateCcw,
  Check,
  Search,
} from 'lucide-react';

// ============================================================================
// 1. THEME SELECT COMPONENT (Standardized Dropdown)
// ============================================================================
export interface ThemeSelectOption {
  value: string | number;
  label: string;
}

export interface ThemeSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  icon?: React.ReactNode;
  options?: ThemeSelectOption[];
  containerStyle?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  searchable?: boolean;
  placeholder?: string;
  align?: 'left' | 'right' | 'auto';
}

export const ThemeSelect: React.FC<ThemeSelectProps> = ({
  icon,
  options,
  children,
  style,
  containerStyle,
  buttonStyle,
  className,
  value,
  onChange,
  disabled,
  searchable,
  placeholder,
  align = 'left',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Parse options from either `options` prop or `children` (<option> tags)
  const parsedOptions: { value: string; label: string; disabled?: boolean }[] = [];

  if (options && options.length > 0) {
    options.forEach((opt) => {
      parsedOptions.push({
        value: String(opt.value),
        label: opt.label,
        disabled: false,
      });
    });
  } else if (children) {
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const p = child.props as { value?: string | number; children?: React.ReactNode; disabled?: boolean };
        const optVal = p.value !== undefined ? String(p.value) : (typeof p.children === 'string' || typeof p.children === 'number' ? String(p.children) : '');
        const optLabel = typeof p.children === 'string' || typeof p.children === 'number' ? String(p.children) : optVal;
        parsedOptions.push({
          value: optVal,
          label: String(optLabel || optVal),
          disabled: p.disabled,
        });
      }
    });
  }

  const currentValStr = value !== undefined ? String(value) : '';
  const selectedOption = parsedOptions.find((opt) => opt.value === currentValStr);
  const displayLabel = selectedOption
    ? selectedOption.label
    : (parsedOptions[0]?.label || placeholder || 'Select...');

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  // Focus search input if searchable
  const shouldShowSearch = searchable !== undefined ? searchable : parsedOptions.length > 6;
  useEffect(() => {
    if (isOpen && shouldShowSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen, shouldShowSearch]);

  // Keyboard navigation: Escape key closes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const filteredOptions = parsedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOption = (optVal: string) => {
    if (onChange) {
      const syntheticEvent = {
        target: {
          value: optVal,
          name: props.name || '',
        },
        currentTarget: {
          value: optVal,
          name: props.name || '',
        },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        ...containerStyle,
      }}
    >
      {/* Hidden native select for form serialization & accessibility */}
      <select
        name={props.name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{ display: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
        {...props}
      >
        {parsedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Styled Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          background: '#FFFFFF',
          border: isOpen ? '1.5px solid #6828DC' : '1.5px solid #CBD5E1',
          borderRadius: '8px',
          padding: icon ? '8.5px 12px 8.5px 10px' : '8.5px 12px',
          fontSize: '13px',
          fontWeight: 600,
          color: selectedOption ? '#0F172A' : '#64748B',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          boxShadow: isOpen
            ? '0 0 0 3px rgba(104, 40, 220, 0.15)'
            : '0 1px 2px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.15s ease',
          width: '100%',
          boxSizing: 'border-box',
          ...style,
          ...buttonStyle,
        }}
        onMouseEnter={(e) => {
          if (!isOpen && !disabled) {
            e.currentTarget.style.borderColor = '#94A3B8';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen && !disabled) {
            e.currentTarget.style.borderColor = '#CBD5E1';
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          {icon && (
            <span style={{ display: 'flex', alignItems: 'center', color: '#6828DC', flexShrink: 0 }}>
              {icon}
            </span>
          )}
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'left',
            }}
          >
            {displayLabel}
          </span>
        </div>

        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            color: isOpen ? '#6828DC' : '#64748B',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
            marginLeft: '4px',
          }}
        >
          <ChevronDown size={15} />
        </span>
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: align === 'right' ? 'auto' : 0,
            right: align === 'right' ? 0 : 'auto',
            zIndex: 1050,
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '12px',
            boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.16), 0 4px 10px -2px rgba(15, 23, 42, 0.06)',
            width: '100%',
            minWidth: '220px',
            maxWidth: 'min(340px, calc(100vw - 24px))',
            padding: '6px',
            boxSizing: 'border-box',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {/* Live Search Input (if > 6 options) */}
          {shouldShowSearch && (
            <div style={{ position: 'relative', marginBottom: '6px', padding: '2px' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '11px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                  pointerEvents: 'none',
                }}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  background: '#F8FAFC',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#6828DC';
                  e.currentTarget.style.background = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.background = '#F8FAFC';
                }}
              />
            </div>
          )}

          {/* Options List */}
          <div
            style={{
              maxHeight: '260px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {filteredOptions.length === 0 ? (
              <div
                style={{
                  padding: '12px',
                  fontSize: '12.5px',
                  color: '#94A3B8',
                  textAlign: 'center',
                }}
              >
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === currentValStr;
                return (
                  <div
                    key={opt.value}
                    onClick={() => !opt.disabled && handleSelectOption(opt.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '7px',
                      fontSize: '12.5px',
                      fontWeight: isSelected ? 700 : 500,
                      color: opt.disabled ? '#94A3B8' : isSelected ? '#6828DC' : '#334155',
                      background: isSelected ? '#EDE9FE' : 'transparent',
                      cursor: opt.disabled ? 'not-allowed' : 'pointer',
                      transition: 'all 0.12s ease',
                      gap: '8px',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected && !opt.disabled) {
                        e.currentTarget.style.background = '#F8FAFC';
                        e.currentTarget.style.color = '#0F172A';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected && !opt.disabled) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#334155';
                      }
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {opt.label}
                    </span>

                    {isSelected && (
                      <Check size={14} style={{ color: '#6828DC', flexShrink: 0 }} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 1B. CUSTOM THEME SELECT (Fully Styled Custom Dropdown)
// ============================================================================
export interface CustomSelectOption {
  value: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface CustomThemeSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (CustomSelectOption | { value: string | number; label: string })[];
  placeholder?: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  searchable?: boolean;
  disabled?: boolean;
  align?: 'left' | 'right' | 'auto';
}

export const CustomThemeSelect: React.FC<CustomThemeSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  icon,
  style,
  containerStyle,
  searchable = false,
  disabled = false,
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const normalizedOptions: CustomSelectOption[] = options.map((opt) => ({
    value: String(opt.value),
    label: opt.label,
    count: 'count' in opt ? (opt as CustomSelectOption).count : undefined,
    icon: 'icon' in opt ? (opt as CustomSelectOption).icon : undefined,
  }));

  const selectedOption = normalizedOptions.find((opt) => opt.value === String(value));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
        ...containerStyle,
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          background: '#FFFFFF',
          border: isOpen ? '1.5px solid #6828DC' : '1.5px solid #CBD5E1',
          borderRadius: '8px',
          padding: icon ? '8.5px 12px 8.5px 10px' : '8.5px 12px',
          fontSize: '13px',
          fontWeight: 600,
          color: selectedOption ? '#0F172A' : '#64748B',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          boxShadow: isOpen
            ? '0 0 0 3px rgba(104, 40, 220, 0.15)'
            : '0 1px 2px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.15s ease',
          width: '100%',
          boxSizing: 'border-box',
          ...style,
        }}
        onMouseEnter={(e) => {
          if (!isOpen && !disabled) {
            e.currentTarget.style.borderColor = '#94A3B8';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen && !disabled) {
            e.currentTarget.style.borderColor = '#CBD5E1';
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          {icon && (
            <span style={{ display: 'flex', alignItems: 'center', color: '#6828DC', flexShrink: 0 }}>
              {icon}
            </span>
          )}
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'left',
            }}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            color: isOpen ? '#6828DC' : '#64748B',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
          }}
        >
          <ChevronDown size={15} />
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: align === 'right' ? 'auto' : 0,
            right: align === 'right' ? 0 : 'auto',
            zIndex: 1050,
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '12px',
            boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.16), 0 4px 10px -2px rgba(15, 23, 42, 0.06)',
            width: '100%',
            minWidth: '230px',
            maxWidth: 'min(340px, calc(100vw - 24px))',
            padding: '6px',
            boxSizing: 'border-box',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {/* Search inside dropdown */}
          {searchable && (
            <div style={{ position: 'relative', marginBottom: '6px', padding: '2px' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '11px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                  pointerEvents: 'none',
                }}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  background: '#F8FAFC',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#6828DC';
                  e.currentTarget.style.background = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.background = '#F8FAFC';
                }}
              />
            </div>
          )}

          {/* Options List */}
          <div
            style={{
              maxHeight: '260px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {filteredOptions.length === 0 ? (
              <div
                style={{
                  padding: '12px',
                  fontSize: '12.5px',
                  color: '#94A3B8',
                  textAlign: 'center',
                }}
              >
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === String(value);
                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '7px',
                      fontSize: '12.5px',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? '#6828DC' : '#334155',
                      background: isSelected ? '#EDE9FE' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                      gap: '8px',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#F8FAFC';
                        e.currentTarget.style.color = '#0F172A';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#334155';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      {opt.icon && <span>{opt.icon}</span>}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {opt.label}
                      </span>
                    </div>

                    {isSelected && (
                      <Check size={14} style={{ color: '#6828DC', flexShrink: 0 }} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 2. CALENDAR DATE RANGE PICKER & FILTER LOGIC
// ============================================================================
export type DatePresetType = 'ALL' | 'TODAY' | 'YESTERDAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'THIS_MONTH' | 'CUSTOM';

export interface DateRangeValue {
  preset?: DatePresetType;
  startDate?: string; // 'YYYY-MM-DD'
  endDate?: string;   // 'YYYY-MM-DD'
}

export type DateFilterType = DatePresetType | DateRangeValue;

export interface DateFilterSelectProps {
  value: DateFilterType;
  onChange: (value: DateFilterType) => void;
  style?: React.CSSProperties;
  placeholder?: string;
  align?: 'left' | 'right';
}

export const DateFilterSelect: React.FC<DateFilterSelectProps> = ({
  value,
  onChange,
  style,
  placeholder = 'Filter by Date',
  align = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize incoming value
  const preset: DatePresetType =
    typeof value === 'string'
      ? (value as DatePresetType)
      : (value?.preset || (value?.startDate || value?.endDate ? 'CUSTOM' : 'ALL'));

  const activeStart = typeof value === 'object' && value ? value.startDate || '' : '';
  const activeEnd = typeof value === 'object' && value ? value.endDate || '' : '';

  // Local state for calendar picker inputs
  const [tempStart, setTempStart] = useState(activeStart);
  const [tempEnd, setTempEnd] = useState(activeEnd);

  // Sync temp dates when value or popup opens
  useEffect(() => {
    setTempStart(activeStart);
    setTempEnd(activeEnd);
  }, [activeStart, activeEnd, isOpen]);

  // Click outside listener to close popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  // Helper to format 'YYYY-MM-DD' to 'DD/MM/YYYY'
  const toDMY = (dateStr?: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Determine trigger label
  const isCustom = preset === 'CUSTOM' || Boolean(activeStart || activeEnd);
  const isFiltered = preset !== 'ALL';

  let triggerLabel = placeholder;
  if (isCustom) {
    if (activeStart && activeEnd) {
      triggerLabel = activeStart === activeEnd ? toDMY(activeStart) : `${toDMY(activeStart)} to ${toDMY(activeEnd)}`;
    } else if (activeStart) {
      triggerLabel = `From ${toDMY(activeStart)}`;
    } else if (activeEnd) {
      triggerLabel = `Until ${toDMY(activeEnd)}`;
    }
  } else {
    switch (preset) {
      case 'TODAY':
        triggerLabel = 'Today';
        break;
      case 'YESTERDAY':
        triggerLabel = 'Yesterday';
        break;
      case 'LAST_7_DAYS':
        triggerLabel = 'Last 7 Days';
        break;
      case 'LAST_30_DAYS':
        triggerLabel = 'Last 30 Days';
        break;
      case 'THIS_MONTH':
        triggerLabel = 'This Month';
        break;
      default:
        triggerLabel = placeholder;
        break;
    }
  }

  const handleApplyCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tempStart && !tempEnd) {
      onChange('ALL');
      setIsOpen(false);
      return;
    }
    onChange({
      preset: 'CUSTOM',
      startDate: tempStart || undefined,
      endDate: tempEnd || undefined,
    });
    setIsOpen(false);
  };

  const handlePresetSelect = (p: DatePresetType) => {
    setTempStart('');
    setTempEnd('');
    onChange(p);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempStart('');
    setTempEnd('');
    onChange('ALL');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', ...style }}>
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '8px',
          border: isFiltered ? '1.5px solid #6828DC' : '1.5px solid #CBD5E1',
          background: isFiltered ? '#F5F3FF' : '#FFFFFF',
          color: isFiltered ? '#6828DC' : '#334155',
          fontSize: '13px',
          fontWeight: isFiltered ? 700 : 500,
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'all 0.15s ease',
          boxShadow: isFiltered ? '0 0 0 3px rgba(104, 40, 220, 0.12)' : '0 1px 2px rgba(0, 0, 0, 0.04)',
          whiteSpace: 'nowrap',
        }}
        title="Filter by creation date"
      >
        <Calendar size={14} style={{ color: isFiltered ? '#6828DC' : '#64748B', flexShrink: 0 }} />
        <span>{triggerLabel}</span>

        {isFiltered ? (
          <span
            onClick={handleClear}
            title="Clear date filter"
            style={{
              marginLeft: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#EDE9FE',
              color: '#6828DC',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#DDD6FE')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#EDE9FE')}
          >
            <X size={11} />
          </span>
        ) : (
          <ChevronDown size={14} style={{ color: '#94A3B8', marginLeft: '2px', flexShrink: 0 }} />
        )}
      </div>

      {/* Interactive Calendar Popover */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: align === 'left' ? 0 : 'auto',
            right: align === 'left' ? 'auto' : 0,
            zIndex: 9999,
            background: '#FFFFFF',
            borderRadius: '14px',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 14px 40px rgba(15, 23, 42, 0.18)',
            padding: '18px',
            width: '320px',
            maxWidth: 'min(340px, calc(100vw - 24px))',
            boxSizing: 'border-box',
          }}
        >
          {/* Popover Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
              <Calendar size={15} style={{ color: '#6828DC' }} />
              <span>Filter by Created Date</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                border: 'none',
                background: '#F1F5F9',
                borderRadius: '6px',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#64748B',
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Quick Presets
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {[
                { id: 'ALL' as DatePresetType, label: 'All Time' },
                { id: 'TODAY' as DatePresetType, label: 'Today' },
                { id: 'YESTERDAY' as DatePresetType, label: 'Yesterday' },
                { id: 'LAST_7_DAYS' as DatePresetType, label: 'Last 7 Days' },
                { id: 'LAST_30_DAYS' as DatePresetType, label: 'Last 30 Days' },
                { id: 'THIS_MONTH' as DatePresetType, label: 'This Month' },
              ].map((p) => {
                const isSelected = preset === p.id && !isCustom;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePresetSelect(p.id)}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: isSelected ? '1.5px solid #6828DC' : '1px solid #E2E8F0',
                      background: isSelected ? '#F5F3FF' : '#F8FAFC',
                      color: isSelected ? '#6828DC' : '#334155',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '11.5px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'center',
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px 0 12px' }}>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
              or Choose Calendar Range
            </span>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          </div>

          {/* Custom Date Inputs (From / To) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                From Date (Start):
              </label>
              <input
                type="date"
                value={tempStart}
                onChange={(e) => setTempStart(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '12.5px',
                  color: '#0F172A',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: '#F8FAFC',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                To Date (End):
              </label>
              <input
                type="date"
                value={tempEnd}
                min={tempStart || undefined}
                onChange={(e) => setTempEnd(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '12.5px',
                  color: '#0F172A',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: '#F8FAFC',
                }}
              />
            </div>
          </div>

          {/* Popover Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Reset
            </button>

            <button
              type="button"
              onClick={() => handleApplyCustom()}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export function filterByDateRange<T>(
  items: T[],
  arg2: DateFilterType | ((item: T) => string | number | Date | undefined | null),
  arg3?: DateFilterType | ((item: T) => string | number | Date | undefined | null)
): T[] {
  let rangeVal: DateFilterType = 'ALL';
  let getDate: (item: T) => string | number | Date | undefined | null = (item: any) => item?.createdAt;

  if (typeof arg2 === 'string' || (typeof arg2 === 'object' && arg2 !== null)) {
    rangeVal = arg2 as DateFilterType;
    if (typeof arg3 === 'function') getDate = arg3;
  } else if (typeof arg2 === 'function') {
    getDate = arg2;
    if (typeof arg3 === 'string' || (typeof arg3 === 'object' && arg3 !== null)) rangeVal = arg3 as DateFilterType;
  }

  // Determine preset and custom dates
  let preset: DatePresetType = 'ALL';
  let startDateStr: string | undefined;
  let endDateStr: string | undefined;

  if (typeof rangeVal === 'string') {
    preset = rangeVal;
  } else if (typeof rangeVal === 'object' && rangeVal !== null) {
    preset = rangeVal.preset || 'CUSTOM';
    startDateStr = rangeVal.startDate;
    endDateStr = rangeVal.endDate;
  }

  // If custom calendar date range is provided
  if (startDateStr || endDateStr) {
    const startTime = startDateStr ? new Date(startDateStr + 'T00:00:00').getTime() : -Infinity;
    const endTime = endDateStr ? new Date(endDateStr + 'T23:59:59.999').getTime() : Infinity;

    return items.filter((item) => {
      const rawDate = getDate(item);
      if (!rawDate) return false;
      const itemTime = new Date(rawDate).getTime();
      if (isNaN(itemTime)) return false;
      return itemTime >= startTime && itemTime <= endTime;
    });
  }

  if (preset === 'ALL') return items;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfToday = startOfToday + 24 * 60 * 60 * 1000 - 1;

  return items.filter((item) => {
    const rawDate = getDate(item);
    if (!rawDate) return false;
    const itemTime = new Date(rawDate).getTime();
    if (isNaN(itemTime)) return false;

    switch (preset) {
      case 'TODAY':
        return itemTime >= startOfToday && itemTime <= endOfToday;
      case 'YESTERDAY': {
        const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
        const endOfYesterday = startOfToday - 1;
        return itemTime >= startOfYesterday && itemTime <= endOfYesterday;
      }
      case 'LAST_7_DAYS': {
        const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
        return itemTime >= sevenDaysAgo && itemTime <= endOfToday;
      }
      case 'LAST_30_DAYS': {
        const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;
        return itemTime >= thirtyDaysAgo && itemTime <= endOfToday;
      }
      case 'THIS_MONTH': {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        return itemTime >= startOfMonth && itemTime <= endOfToday;
      }
      default:
        return true;
    }
  });
}

// ============================================================================
// 3. COMBINED DATE & AUDIT USER CELLS
// ============================================================================
export const formatTableCellDate = (dateStr?: string | null): string => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTableCellUser = (user: unknown): string => {
  if (!user) return 'System Admin';
  if (typeof user === 'object' && user !== null) {
    const u = user as { name?: string; email?: string; fullName?: string };
    return u.name || u.fullName || u.email || 'System Admin';
  }
  const str = String(user).trim();
  if (/^[0-9a-fA-F]{24}$/.test(str)) {
    return 'System Admin';
  }
  return str || 'System Admin';
};

export interface CombinedDateCellProps {
  createdAt?: string | null;
  updatedAt?: string | null;
}

export const CombinedDateCell: React.FC<CombinedDateCellProps> = ({
  createdAt,
  updatedAt,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <div
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#0F172A',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <Calendar size={13} style={{ color: '#6828DC', flexShrink: 0 }} />
        <span
          style={{
            fontSize: '10px',
            color: '#64748B',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
          }}
        >
          Created:
        </span>
        <span>{formatTableCellDate(createdAt)}</span>
      </div>

      <div
        style={{
          fontSize: '11.5px',
          color: '#64748B',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <Calendar size={13} style={{ color: '#94A3B8', flexShrink: 0 }} />
        <span
          style={{
            fontSize: '9.5px',
            color: '#94A3B8',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
          }}
        >
          Updated:
        </span>
        <span>{updatedAt ? formatTableCellDate(updatedAt) : formatTableCellDate(createdAt)}</span>
      </div>
    </div>
  );
};

export interface CombinedUserCellProps {
  createdBy?: unknown;
  updatedBy?: unknown;
  createdFallback?: string;
  updatedFallback?: string;
}

export const CombinedUserCell: React.FC<CombinedUserCellProps> = ({
  createdBy,
  updatedBy,
  createdFallback = 'Admin',
  updatedFallback = '-',
}) => {
  const createdName = createdBy ? formatTableCellUser(createdBy) : createdFallback;
  const updatedName = updatedBy ? formatTableCellUser(updatedBy) : updatedFallback;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <div
        style={{
          fontSize: '12px',
          fontWeight: 700,
          color: '#6828DC',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <User size={13} style={{ color: '#6828DC', flexShrink: 0 }} />
        <span
          style={{
            fontSize: '10px',
            color: '#64748B',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
          }}
        >
          By:
        </span>
        <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {createdName}
        </span>
      </div>

      <div
        style={{
          fontSize: '11.5px',
          color: '#475569',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <User size={13} style={{ color: '#94A3B8', flexShrink: 0 }} />
        <span
          style={{
            fontSize: '9.5px',
            color: '#94A3B8',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
          }}
        >
          Ed:
        </span>
        <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {updatedName}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// 4. STANDARDIZED TABLE PAGINATION COMPONENT
// ============================================================================
export interface TablePaginationProps {
  currentPage: number;
  totalPages?: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages: propTotalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  if (totalItems <= 0) return null;

  const totalPages = propTotalPages ?? Math.max(1, Math.ceil(totalItems / pageSize));
  const startEntry = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endEntry = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        background: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      {/* Left: Entries Counter & Rows Per Page */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '13px', color: '#64748B' }}>
          Showing <span style={{ fontWeight: 700, color: '#0F172A' }}>{startEntry}</span> to{' '}
          <span style={{ fontWeight: 700, color: '#0F172A' }}>{endEntry}</span> of{' '}
          <span style={{ fontWeight: 700, color: '#0F172A' }}>{totalItems}</span> entries
        </div>

        {onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12.5px', color: '#64748B' }}>Rows:</span>
            <ThemeSelect
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              style={{ padding: '4px 24px 4px 10px', fontSize: '12px', height: '30px' }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </ThemeSelect>
          </div>
        )}
      </div>

      {/* Right: Page Navigation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            background: '#FFFFFF',
            color: currentPage === 1 ? '#CBD5E1' : '#475569',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '32px',
            height: '32px',
          }}
          title="First Page"
        >
          <ChevronsLeft size={15} />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            background: '#FFFFFF',
            color: currentPage === 1 ? '#CBD5E1' : '#475569',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12.5px',
            fontWeight: 600,
            height: '32px',
          }}
        >
          <ChevronLeft size={15} />
          <span>Prev</span>
        </button>

        {/* Numbered Page Buttons */}
        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                style={{
                  padding: '4px 8px',
                  color: '#94A3B8',
                  fontSize: '13px',
                  userSelect: 'none',
                }}
              >
                ...
              </span>
            );
          }

          const pageNum = Number(p);
          const isActive = pageNum === currentPage;

          return (
            <button
              key={`page-${pageNum}`}
              type="button"
              onClick={() => onPageChange(pageNum)}
              style={{
                minWidth: '32px',
                height: '32px',
                padding: '0 6px',
                borderRadius: '6px',
                border: isActive ? 'none' : '1px solid #CBD5E1',
                background: isActive ? 'linear-gradient(135deg, #6828DC, #4F46E5)' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#334155',
                fontWeight: isActive ? 700 : 600,
                fontSize: '12.5px',
                cursor: 'pointer',
                boxShadow: isActive ? '0 2px 6px rgba(104, 40, 220, 0.3)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          style={{
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            background: '#FFFFFF',
            color: currentPage === totalPages || totalPages === 0 ? '#CBD5E1' : '#475569',
            cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12.5px',
            fontWeight: 600,
            height: '32px',
          }}
        >
          <span>Next</span>
          <ChevronRight size={15} />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            background: '#FFFFFF',
            color: currentPage === totalPages || totalPages === 0 ? '#CBD5E1' : '#475569',
            cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '32px',
            height: '32px',
          }}
          title="Last Page"
        >
          <ChevronsRight size={15} />
        </button>
      </div>
    </div>
  );
};
