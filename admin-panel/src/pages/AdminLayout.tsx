import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Inbox,
  Briefcase,
  Users,
  Palette,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Layers,
  Sparkles,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  ShieldCheck,
  Image as GalleryIcon,
  Settings as SettingsIcon,
  FileText,
  ArrowRight,
  Maximize,
  Pill,
  Building2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CustomRoleDropdown } from '../components/common/CustomRoleDropdown';
import { useAppDispatch, useAppSelector } from '../store';
import {
  toggleSidebar,
  toggleMobileSidebar,
  setMobileSidebarOpen,
} from '../store/slices/uiSlice';
import {
  selectCurrentRole,
  selectEffectivePermissions,
  setSimulatedRole,
} from '../store/slices/authSlice';

export const AdminLayout: React.FC = () => {
  const { user: authContextUser, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isSidebarCollapsed = useAppSelector((state) => state.ui.isSidebarCollapsed);
  const isMobileSidebarOpen = useAppSelector((state) => state.ui.isMobileSidebarOpen);
  const activeRole = useAppSelector(selectCurrentRole);
  const effectivePermissions = useAppSelector(selectEffectivePermissions);

  const [productsSubmenuOpen, setProductsSubmenuOpen] = useState(
    location.pathname.startsWith('/admin/products')
  );

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Close mobile sidebar on route change
  React.useEffect(() => {
    dispatch(setMobileSidebarOpen(false));
  }, [location.pathname, dispatch]);

  if (!isAuthenticated) return null;

  const isCurrent = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const hasPerm = (perm: string | string[]) => {
    if (!effectivePermissions || effectivePermissions.length === 0 || effectivePermissions.includes('*')) return true;
    if (activeRole === 'SUPER_ADMIN' || activeRole === 'ADMIN') return true;
    if (Array.isArray(perm)) {
      return perm.some((p) => effectivePermissions.includes(p));
    }
    return effectivePermissions.includes(perm);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => dispatch(setMobileSidebarOpen(false))}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 998,
          }}
        />
      )}

      {/* 1. SIDEBAR (Collapsible Desktop + Slide-over Mobile) */}
      <aside
        style={{
          width: isSidebarCollapsed ? '80px' : '260px',
          background: '#FFFFFF',
          borderRight: '1.5px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s ease',
          zIndex: 999,
        }}
        className={`admin-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}
      >
        <div>
          {/* Brand Logo Header & Collapse Toggle */}
          <div
            style={{
              padding: isSidebarCollapsed ? '20px 14px' : '24px 20px 16px',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
            }}
          >
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                overflow: 'hidden',
              }}
            >
              <img
                src="/images/zeal-logo.png"
                alt="Zeal Pharma"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  objectFit: 'contain',
                  boxShadow: '0 2px 8px rgba(104, 40, 220, 0.15)',
                  flexShrink: 0,
                }}
              />
              {!isSidebarCollapsed && (
                <div>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '17px', lineHeight: 1.1 }}>
                    ZEAL PHARMA
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>
                    Better Health, Brighter Tomorrow.
                  </div>
                </div>
              )}
            </Link>

            {/* Desktop Collapse Toggle */}
            {!isSidebarCollapsed && (
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="desktop-only"
                title="Collapse Sidebar"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PanelLeftClose size={18} />
              </button>
            )}

            {/* Mobile Close Button */}
            <button
              onClick={() => dispatch(setMobileSidebarOpen(false))}
              className="mobile-only"
              title="Close Menu"
              style={{
                background: '#F1F5F9',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* If Collapsed, show Expand button */}
          {isSidebarCollapsed && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <button
                onClick={() => dispatch(toggleSidebar())}
                title="Expand Sidebar"
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  color: '#6828DC',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PanelLeft size={18} />
              </button>
            </div>
          )}

          {/* Navigation Links with Role & Permission Guarding */}
          <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* Dashboard */}
            {hasPerm('dashboard:view') && (
              <Link
                to="/admin"
                title="Dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: isCurrent('/admin', true) ? 700 : 500,
                  background: isCurrent('/admin', true) ? '#6828DC' : 'transparent',
                  color: isCurrent('/admin', true) ? '#FFFFFF' : '#475569',
                  transition: 'all 0.15s ease',
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                }}
              >
                <LayoutDashboard size={18} />
                {!isSidebarCollapsed && <span>Dashboard</span>}
              </Link>
            )}

            {/* Products (with Submenu) */}
            {hasPerm(['product:view', 'product:create']) && (
              <div>
                <button
                  onClick={() => {
                    if (isSidebarCollapsed) dispatch(toggleSidebar());
                    setProductsSubmenuOpen(!productsSubmenuOpen);
                  }}
                  title="Products"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: location.pathname.startsWith('/admin/products') ? 700 : 500,
                    background: location.pathname.startsWith('/admin/products') ? '#F5F3FF' : 'transparent',
                    color: location.pathname.startsWith('/admin/products') ? '#6828DC' : '#475569',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Package size={18} />
                    {!isSidebarCollapsed && <span>Products</span>}
                  </div>
                  {!isSidebarCollapsed && (
                    <ChevronDown
                      size={16}
                      style={{
                        transform: productsSubmenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    />
                  )}
                </button>

                {productsSubmenuOpen && !isSidebarCollapsed && (
                  <div style={{ paddingLeft: '40px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                    <Link
                      to="/admin/products"
                      style={{
                        padding: '7px 10px',
                        fontSize: '13px',
                        borderRadius: '6px',
                        fontWeight: location.pathname === '/admin/products' ? 700 : 500,
                        color: location.pathname === '/admin/products' ? '#6828DC' : '#64748B',
                        background: location.pathname === '/admin/products' ? '#EDE9FE' : 'transparent',
                        textDecoration: 'none',
                      }}
                    >
                      All Products
                    </Link>
                    {hasPerm('product:create') && (
                      <Link
                        to="/admin/products/new"
                        style={{
                          padding: '7px 10px',
                          fontSize: '13px',
                          borderRadius: '6px',
                          fontWeight: location.pathname === '/admin/products/new' ? 700 : 500,
                          color: location.pathname === '/admin/products/new' ? '#6828DC' : '#64748B',
                          background: location.pathname === '/admin/products/new' ? '#EDE9FE' : 'transparent',
                          textDecoration: 'none',
                        }}
                      >
                        Add Product
                      </Link>
                    )}
                    <Link
                      to="/admin/categories"
                      style={{
                        padding: '7px 10px',
                        fontSize: '13px',
                        borderRadius: '6px',
                        fontWeight: location.pathname === '/admin/categories' ? 700 : 500,
                        color: location.pathname === '/admin/categories' ? '#6828DC' : '#64748B',
                        background: location.pathname === '/admin/categories' ? '#EDE9FE' : 'transparent',
                        textDecoration: 'none',
                      }}
                    >
                      Categories & Divisions
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Standard Navigation Links */}
            {[
              { to: '/admin/enquiries', title: 'All Inquiries Pipeline', label: 'All Leads Pipeline', icon: Layers, perm: ['product_enquiry:view', 'sales_enquiry:view', 'franchise_enquiry:view', 'enquiry:view'] },
              { to: '/admin/product-enquiries', title: 'Product Formulation Enquiries', label: 'Product Enquiries', icon: Pill, perm: ['product_enquiry:view', 'sales_enquiry:view', 'enquiry:view'] },
              { to: '/admin/stockist-enquiries', title: 'Stockist Distribution Enquiries', label: 'Stockist Enquiries', icon: Building2, perm: ['franchise:view', 'franchise_enquiry:view', 'sales_enquiry:view', 'enquiry:view'] },
              { to: '/admin/career-enquiries', title: 'Career Applications & ATS', label: 'Career Enquiries', icon: Briefcase, perm: ['job:view', 'application:view', 'career:view', 'hr:view'] },
              { to: '/admin/gallery', title: 'Media Gallery & Assets', label: 'Gallery', icon: GalleryIcon, perm: ['gallery:view', 'media:view'] },
              { to: '/admin/cms', title: 'Website Content', label: 'Website Content', icon: Palette, perm: 'cms:view' },
              { to: '/admin/categories', title: 'Categories & Divisions', label: 'Categories & Divisions', icon: Layers, perm: 'category:view' },
              { to: '/admin/users', title: 'Users & Roles', label: 'Users & Roles', icon: Users, perm: ['user:view', 'permission:assign'] },
              { to: '/admin/settings', title: 'Account Settings', label: 'Settings', icon: SettingsIcon, perm: null },
            ].map((item) => {
              if (item.perm && !hasPerm(item.perm as any)) return null;
              const active = isCurrent(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={item.title}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: active ? 700 : 500,
                    background: active ? '#6828DC' : 'transparent',
                    color: active ? '#FFFFFF' : '#475569',
                    textDecoration: 'none',
                    justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={18} />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer matching Reference Screenshot */}
        <div>
          {!isSidebarCollapsed && (
            <div style={{ padding: '0 16px 16px' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #6828DC 0%, #8B5CF6 100%)',
                  borderRadius: '16px',
                  padding: '18px 16px',
                  color: '#FFFFFF',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 6px 18px rgba(104, 40, 220, 0.25)',
                }}
              >
                <div style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  opacity: 0.9,
                  marginBottom: '4px',
                }}>
                  Quality
                </div>
                <div style={{ fontSize: '15px', fontWeight: 800, lineHeight: 1.2, marginBottom: '14px' }}>
                  Drives<br />A Healthier<br />Tomorrow
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      color: '#6828DC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    }}
                  >
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Profile Card in Sidebar */}
          <div
            className="mobile-only"
            style={{
              padding: '12px 14px',
              margin: '0 12px 8px',
              borderRadius: '12px',
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#EDE9FE',
                border: '1.5px solid #DDD6FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <img src="/images/zeal-logo.png" alt="User" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {authContextUser?.name || 'Super Admin'}
              </span>
              <span
                style={{
                  fontSize: '9.5px',
                  color: '#6828DC',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  background: '#F3E8FF',
                  border: '1px solid #D8B4FE',
                  padding: '1px 6px',
                  borderRadius: '5px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  width: 'fit-content',
                  lineHeight: 1.2,
                }}
              >
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#10B981' }} />
                {activeRole || 'SUPER_ADMIN'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <div style={{ padding: '12px', borderTop: '1px solid #F1F5F9' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#EF4444',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              }}
              title="Logout"
            >
              <LogOut size={18} />
              {!isSidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header className="admin-header">
          {/* Mobile Hamburger Menu & Mobile Brand Logo & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
            <button
              onClick={() => dispatch(toggleMobileSidebar())}
              className="mobile-only"
              title="Open Navigation Menu"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#334155',
                cursor: 'pointer',
                padding: '5px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Brand Logo */}
            <Link
              to="/admin"
              className="mobile-only"
              title="Zeal Pharma"
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
            >
              <img
                src="/images/zeal-logo.png"
                alt="Zeal"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  objectFit: 'contain',
                }}
              />
            </Link>

            {/* Search Input */}
            <div className="header-search-wrap">
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder="Search...   Ctrl K"
                className="header-search-input"
              />
            </div>
          </div>

          {/* Right Header: Role Simulator, Notification & Profile */}
          <div className="header-right-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {/* Super Admin Role Simulator Dropdown */}
            <CustomRoleDropdown />

            {/* Notification Bell */}
            <div
              className="header-notif-btn"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '9px',
                border: '1.5px solid #E2E8F0',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B',
                cursor: 'pointer',
                position: 'relative',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#CBD5E1')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
              title="Notifications"
            >
              <Bell size={17} />
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  boxShadow: '0 0 0 2px #FFFFFF',
                }}
              />
            </div>

            {/* Profile Avatar & Info Stack */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexShrink: 0 }}>
              <div
                className="header-avatar-circle"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#EDE9FE',
                  border: '1.5px solid #DDD6FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 1px 4px rgba(104, 40, 220, 0.12)',
                }}
                title={authContextUser?.name || 'Super Admin'}
              >
                <img
                  src="/images/zeal-logo.png"
                  alt="Zeal User Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* User Name on top, Role Pill directly underneath */}
              <div
                className="header-user-info-stack"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  gap: '2px',
                  lineHeight: 1.2,
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#0F172A',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.2,
                    display: 'block',
                  }}
                >
                  {authContextUser?.name || 'Super Admin'}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#6828DC',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: '#F3E8FF',
                    border: '1px solid #D8B4FE',
                    padding: '1.5px 7px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    lineHeight: 1.2,
                    boxShadow: '0 1px 2px rgba(104, 40, 220, 0.08)',
                  }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      display: 'inline-block',
                    }}
                  />
                  {activeRole || 'SUPER_ADMIN'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="header-main-content">
          <Outlet />
        </main>
      </div>


    </div>
  );
};
