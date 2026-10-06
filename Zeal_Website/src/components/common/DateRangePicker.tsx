import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onApply: (start: string, end: string) => void;
  onClear: () => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onApply, onClear,}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempStart(startDate);
    setTempEnd(endDate);
  }, [startDate, endDate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveDateRange = Boolean(startDate || endDate);

  const formatDisplayDate = (d: string) => {
    if (!d) return '';
    try {
      const parts = d.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0].slice(2)}`;
      return d;
    } catch {
      return d;
    }
  };

  const handlePreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    const sStr = start.toISOString().split('T')[0];
    const eStr = end.toISOString().split('T')[0];
    setTempStart(sStr);
    setTempEnd(eStr);
    onApply(sStr, eStr);
    setIsOpen(false);
  };

  return (
    <div ref={pickerRef} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{  width: '100%', display: 'flex', alignItems: 'center',  justifyContent: 'space-between',  gap: '8px',  padding: '11px 14px',  background: hasActiveDateRange ? 'var(--zp-primary-light)' : isOpen ? '#FFFFFF' : '#F8FAFC', border: hasActiveDateRange || isOpen ? '1.5px solid var(--zp-primary)' : '1.5px solid var(--zp-border-input)',  borderRadius: '12px', fontSize: '13.5px', fontWeight: 600, color: hasActiveDateRange ? 'var(--zp-primary)' : '#334155', cursor: 'pointer', outline: 'none', boxShadow: isOpen ? '0 0 0 3px var(--zp-primary-glow)' : 'none', transition: 'all 0.18s ease', boxSizing: 'border-box', }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <Calendar size={15} style={{ color: 'var(--zp-primary)', flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {hasActiveDateRange
              ? `${formatDisplayDate(startDate) || 'Start'} → ${formatDisplayDate(endDate) || 'Today'}`
              : 'Date Range (Calendar)'}
          </span>
        </div>
        <ChevronDown
          size={16}
          style={{ color: 'var(--zp-primary)',flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', }}/>
      </button>

      {isOpen && (
        <div style={{  position: 'absolute',top: 'calc(100% + 6px)', left: 0, width: '320px', maxWidth: '90vw', background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid var(--zp-border-light)', boxShadow: '0 16px 36px rgba(15, 23, 42, 0.16)', zIndex: 999, padding: '18px', animation: 'zpFadeIn 0.15s ease-out', }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '14px', color: 'var(--zp-text-dark)' }}>
              <Calendar size={15} style={{ color: 'var(--zp-primary)' }} />
              <span>Select Date Range</span>
            </div>
            {hasActiveDateRange && (
              <button
                type="button"
                onClick={() => {
                  setTempStart('');
                  setTempEnd('');
                  onClear();
                  setIsOpen(false);
                }}
                style={{ background: 'none', border: 'none', color: 'var(--zp-red)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', padding: 0, }} >
                Clear
              </button>
            )}
          </div>

          {/* Quick Presets */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
            <button
              type="button"
              onClick={() => handlePreset(7)}
              style={{ flex: 1,  padding: '5px 8px', borderRadius: '8px',  border: '1px solid var(--zp-border-light)', background: '#F8FAFC', fontSize: '11.5px', fontWeight: 700, color: '#475569', cursor: 'pointer', }}>
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => handlePreset(30)}
              style={{ flex: 1, padding: '5px 8px', borderRadius: '8px', border: '1px solid var(--zp-border-light)', background: '#F8FAFC', fontSize: '11.5px', fontWeight: 700, color: '#475569', cursor: 'pointer', }}>
              Last 30 Days
            </button>
            <button
              type="button"
              onClick={() => handlePreset(90)}
              style={{ flex: 1, padding: '5px 8px', borderRadius: '8px', border: '1px solid var(--zp-border-light)', background: '#F8FAFC', fontSize: '11.5px', fontWeight: 700, color: '#475569', cursor: 'pointer',  }}>
              Last 3 Mos
            </button>
          </div>

          {/* Date Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <div>
              <label className="zp-label">FROM DATE</label>
              <input type="date" value={tempStart} onChange={e => setTempStart(e.target.value)} className="zp-input"/>
            </div>

            <div>
              <label className="zp-label">TO DATE</label>
              <input type="date" value={tempEnd} onChange={e => setTempEnd(e.target.value)}  className="zp-input"/>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={() => setIsOpen(false)} className="zp-btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button
              type="button"
              onClick={() => { onApply(tempStart, tempEnd); setIsOpen(false); }}
              className="zp-btn-primary" style={{ flex: 1 }}>
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
