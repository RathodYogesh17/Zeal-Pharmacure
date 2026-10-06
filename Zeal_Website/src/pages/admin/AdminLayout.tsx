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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  toggleSidebar,
  toggleMobileSidebar,
  setMobileSidebarOpen,
} from '../../store/slices/uiSlice';
import {
  selectCurrentRole,
  selectEffectivePermissions,
  setSimulatedRole,
} from '../../store/slices/authSlice';

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
    if (effectivePermissions.includes('*')) return true;
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
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6828DC 0%, #8B5CF6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '20px',
                  boxShadow: '0 4px 12px rgba(104, 40, 220, 0.25)',
                  flexShrink: 0,
                }}
              >
                Z
              </div>
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
                  </div>
                )}
              </div>
            )}

            {/* Categories & Subcategories */}
            {hasPerm('category:view') && (
              <Link
                to="/admin/categories"
                title="Categories & Divisions"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: isCurrent('/admin/categories') ? 700 : 500,
                  background: isCurrent('/admin/categories') ? '#6828DC' : 'transparent',
                  color: isCurrent('/admin/categories') ? '#FFFFFF' : '#475569',
                  textDecoration: 'none',
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                }}
              >
                <Layers size={18} />
                {!isSidebarCollapsed && <span>Categories</span>}
              </Link>
            )}

            {/* Product Enquiries */}
            {hasPerm(['product_enquiry:view', 'sales_enquiry:view']) && (
              <Link
                to="/admin/enquiries"
                title="Product Enquiries"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: isCurrent('/admin/enquiries') ? 700 : 500,
                  background: isCurrent('/admin/enquiries') ? '#6828DC' : 'transparent',
                  color: isCurrent('/admin/enquiries') ? '#FFFFFF' : '#475569',
                  textDecoration: 'none',
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                }}
              >
                <Inbox size={18} />
                {!isSidebarCollapsed && <span>Product Enquiries</span>}
              </Link>
            )}

            {/* Career Applications */}
            {hasPerm(['job:view', 'application:view']) && (
              <Link
                to="/admin/careers"
                title="Career Applications"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: isCurrent('/admin/careers') ? 700 : 500,
                  background: isCurrent('/admin/careers') ? '#6828DC' : 'transparent',
                  color: isCurrent('/admin/careers') ? '#FFFFFF' : '#475569',
                  textDecoration: 'none',
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                }}
              >
                <Briefcase size={18} />
                {!isSidebarCollapsed && <span>Career Applications</span>}
              </Link>
            )}

            {/* Users & Roles (Permissions Matrix) */}
            {hasPerm(['user:view', 'permission:assign']) && (
              <Link
                to="/admin/users"
                title="Users & Roles (Permissions)"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: isCurrent('/admin/users') ? 700 : 500,
                  background: isCurrent('/admin/users') ? '#6828DC' : 'transparent',
                  color: isCurrent('/admin/users') ? '#FFFFFF' : '#475569',
                  textDecoration: 'none',
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                }}
              >
                <Users size={18} />
                {!isSidebarCollapsed && <span>Users & Roles</span>}
              </Link>
            )}

            {/* Website Content / CMS */}
            {hasPerm('cms:view') && (
              <Link
                to="/admin/cms"
                title="Website Content (CMS)"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: isCurrent('/admin/cms') ? 700 : 500,
                  background: isCurrent('/admin/cms') ? '#6828DC' : 'transparent',
                  color: isCurrent('/admin/cms') ? '#FFFFFF' : '#475569',
                  textDecoration: 'none',
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                }}
              >
                <Palette size={18} />
                {!isSidebarCollapsed && <span>Website Content</span>}
              </Link>
            )}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div>
          {!isSidebarCollapsed && (
            <div style={{ padding: '0 16px 16px' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #6828DC 0%, #8B5CF6 100%)',
                  borderRadius: '14px',
                  padding: '16px',
                  color: '#FFFFFF',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Sparkles size={16} style={{ color: '#FDE047' }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Zeal Standards
                  </span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.3 }}>
                  Quality Drives A Healthier Tomorrow
                </div>
              </div>
            </div>
          )}

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
        <header
          style={{
            height: '70px',
            background: '#FFFFFF',
            borderBottom: '1.5px solid #E2E8F0',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 90,
            gap: '16px',
          }}
        >
          {/* Mobile Hamburger Menu & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
            <button
              onClick={() => dispatch(toggleMobileSidebar())}
              className="mobile-only"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#334155',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {isMobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                }}
              />
              <input
                type="text"
                placeholder="Search anything...   Ctrl K"
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                  background: '#F8FAFC',
                }}
              />
            </div>
          </div>

          {/* Right Header: Role Simulator & Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Super Admin Role Simulator Dropdown */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#F5F3FF',
                border: '1.5px solid #DDD6FE',
                borderRadius: '8px',
                padding: '4px 10px',
              }}
            >
              <ShieldCheck size={16} style={{ color: '#6828DC' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#6828DC', textTransform: 'uppercase' }}>
                  Role Simulator
                </span>
                <select
                  value={activeRole}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    dispatch(setSimulatedRole(newRole === 'SUPER_ADMIN' ? null : newRole));
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#0F172A',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="SUPER_ADMIN">👑 Super Admin (Full Access)</option>
                  <option value="ADMIN">🛡️ Admin</option>
                  <option value="HR_MANAGER">💼 HR Manager (Careers Only)</option>
                  <option value="SALES_MANAGER">📈 Sales Manager (Products/Leads)</option>
                  <option value="CONTENT_MANAGER">✍️ Content Manager (CMS)</option>
                  <option value="EMPLOYEE">👤 Employee (View Only)</option>
                </select>
              </div>
            </div>

            {/* Notification Bell */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1.5px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <Bell size={18} />
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                }}
              />
            </div>

            {/* Profile Avatar & Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#EDE9FE',
                  color: '#6828DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '15px',
                }}
              >
                A
              </div>
              <div className="desktop-only">
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                  {authContextUser?.name || 'Dr. Amit Shah'}
                </div>
                <div style={{ fontSize: '11px', color: '#6828DC', fontWeight: 600 }}>
                  {activeRole}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .desktop-only {
            display: none !important;
          }
          .admin-sidebar {
            position: fixed !important;
            left: -280px;
            top: 0;
            bottom: 0;
            width: 260px !important;
            z-index: 999;
          }
          .admin-sidebar.mobile-open {
            left: 0 !important;
          }
        }
        @media (min-width: 901px) {
          .mobile-only {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
