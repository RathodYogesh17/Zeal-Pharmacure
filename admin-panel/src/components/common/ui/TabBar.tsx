import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number | string;
  badge?: string;
  disabled?: boolean;
}

export interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: any) => void;
  variant?: 'pills' | 'underline' | 'contained';
  className?: string;
  style?: React.CSSProperties;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  className = '',
  style,
}) => {
  if (variant === 'contained') {
    return (
      <div
        className={`zp-tab-bar-contained ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          background: '#F1F5F9',
          padding: '4px',
          borderRadius: '10px',
          ...style,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onChange(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#FFFFFF' : 'transparent',
                color: isActive ? '#6828DC' : '#64748B',
                fontWeight: isActive ? 700 : 600,
                fontSize: '12.5px',
                cursor: tab.disabled ? 'not-allowed' : 'pointer',
                opacity: tab.disabled ? 0.5 : 1,
                boxShadow: isActive ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: '10px',
                    background: isActive ? '#F5F3FF' : '#E2E8F0',
                    color: isActive ? '#6828DC' : '#64748B',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'underline') {
    return (
      <div
        className={`zp-tab-bar-underline ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          borderBottom: '1.5px solid #E2E8F0',
          paddingBottom: '2px',
          ...style,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onChange(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 4px 10px 4px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2.5px solid #6828DC' : '2.5px solid transparent',
                marginBottom: '-2px',
                color: isActive ? '#6828DC' : '#64748B',
                fontWeight: isActive ? 700 : 600,
                fontSize: '13.5px',
                cursor: tab.disabled ? 'not-allowed' : 'pointer',
                opacity: tab.disabled ? 0.5 : 1,
                transition: 'all 0.15s ease',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '1px 7px',
                    borderRadius: '10px',
                    background: isActive ? '#F5F3FF' : '#F1F5F9',
                    color: isActive ? '#6828DC' : '#64748B',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default 'pills'
  return (
    <div
      className={`zp-tab-bar-pills ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        ...style,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 15px',
              borderRadius: '9px',
              border: isActive ? '1px solid #6828DC' : '1px solid #E2E8F0',
              background: isActive ? '#6828DC' : '#FFFFFF',
              color: isActive ? '#FFFFFF' : '#475569',
              fontWeight: isActive ? 700 : 600,
              fontSize: '13px',
              cursor: tab.disabled ? 'not-allowed' : 'pointer',
              opacity: tab.disabled ? 0.5 : 1,
              boxShadow: isActive ? '0 2px 8px rgba(104, 40, 220, 0.20)' : '0 1px 2px rgba(15, 23, 42, 0.04)',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '8px',
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#F1F5F9',
                  color: isActive ? '#FFFFFF' : '#64748B',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
