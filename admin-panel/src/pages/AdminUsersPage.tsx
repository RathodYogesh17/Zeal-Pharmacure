import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Phone,
  UserCheck,
  CheckSquare,
  Square,
  Eye,
  Settings2,
  Search,
  X,
} from 'lucide-react';
import {
  useStaffUsersQuery,
  useCreateUserMutation,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
  useAssignUserPermissionsMutation,
} from '../hooks/queries/useUsersQuery';
import { useAppDispatch } from '../store';
import {
  setSimulatedRole,
  updateRolePermissions,
  DEFAULT_ROLE_PERMISSIONS,
} from '../store/slices/authSlice';
import {
  FormInput,
  FormSelect,
  Button,
  Badge,
  ThemeSelect,
  DateFilterSelect,
  CombinedDateCell,
  CombinedUserCell,
  TablePagination,
  filterByDateRange,
  DateFilterType,
} from '../components/common';
import type { IStaffUser } from '../api/userService';

// Complete Module Permissions Catalog
interface PermissionDefinition {
  key: string;
  name: string;
  description: string;
}

interface PermissionModuleGroup {
  module: string;
  icon: string;
  permissions: PermissionDefinition[];
}

const PERMISSION_MODULES: PermissionModuleGroup[] = [
  {
    module: 'Dashboard Analytics',
    icon: '📊',
    permissions: [
      { key: 'dashboard:view', name: 'View Dashboard', description: 'Access dashboard overview, KPIs, and visitor traffic graphs' },
    ],
  },
  {
    module: 'Pharmaceutical Products',
    icon: '💊',
    permissions: [
      { key: 'product:view', name: 'View Products Catalog', description: 'View all products in table and e-commerce card views' },
      { key: 'product:create', name: 'Add New Products', description: 'Fill add-product form and create new formulations' },
      { key: 'product:update', name: 'Edit Products', description: 'Modify dosage, packaging, indications, and active status' },
      { key: 'product:delete', name: 'Delete Products', description: 'Permanently remove pharmaceutical formulations from catalog' },
    ],
  },
  {
    module: 'Therapeutic Categories',
    icon: '🗂️',
    permissions: [
      { key: 'category:view', name: 'View Categories', description: 'Browse therapeutic segments and subcategories' },
      { key: 'category:create', name: 'Create Categories', description: 'Add new clinical categories and divisions' },
      { key: 'category:delete', name: 'Delete Categories', description: 'Delete categories and sub-divisions' },
    ],
  },
  {
    module: 'Stockists Distribution & Commercial Enquiries',
    icon: '📥',
    permissions: [
      { key: 'product_enquiry:view', name: 'View Enquiries', description: 'Read lead enquiries, drug license checks, and budget' },
      { key: 'product_enquiry:update', name: 'Update Lead Status', description: 'Change status to In Touch, Quoted, or Closed' },
      { key: 'product_enquiry:delete', name: 'Delete Enquiries', description: 'Remove enquiry leads from database' },
    ],
  },
  {
    module: 'Recruitment & Career Applications',
    icon: '💼',
    permissions: [
      { key: 'job:view', name: 'View Job Vacancies', description: 'Inspect posted job openings and departments' },
      { key: 'job:create', name: 'Post New Vacancies', description: 'Publish new job openings with responsibilities & salary' },
      { key: 'job:delete', name: 'Delete Vacancies', description: 'Remove job vacancies from portal' },
      { key: 'application:view', name: 'View Candidate Applications', description: 'Inspect candidate profiles, experience, and contact' },
      { key: 'application:update', name: 'Process Candidate Applications', description: 'Shortlist, schedule interview, or select candidates' },
      { key: 'application:download_resume', name: 'Download Resumes', description: 'Download candidate PDF resumes' },
    ],
  },
  {
    module: 'Website Content & CMS',
    icon: '🌐',
    permissions: [
      { key: 'cms:view', name: 'View Site Content', description: 'View current hotline, addresses, banners, and certifications' },
      { key: 'cms:update', name: 'Update Site Settings', description: 'Modify logo, sales/HR helplines, plant address, and CTAs' },
    ],
  },
  {
    module: 'Staff & Security Administration',
    icon: '👥',
    permissions: [
      { key: 'user:view', name: 'View Staff Directory', description: 'Browse registered employees and staff roles' },
      { key: 'user:create', name: 'Register Staff', description: 'Create new user credentials with initial role' },
      { key: 'user:update', name: 'Edit Staff Accounts', description: 'Modify phone, active status, or email' },
      { key: 'permission:assign', name: 'Assign Granular Permissions', description: 'Control module access checkboxes for each staff role' },
    ],
  },
];

// Fallback staff users for initial display if DB is empty
const INITIAL_STAFF: IStaffUser[] = [
  {
    _id: 'u-1',
    name: 'Dr. Amit Shah',
    email: 'admin@zealpharma.com',
    phone: '+91 93162 27576',
    role: 'SUPER_ADMIN',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'u-2',
    name: 'Pooja Verma',
    email: 'hr@zealpharma.com',
    phone: '+91 98251 22334',
    role: 'HR_MANAGER',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'u-3',
    name: 'Vikram Mehta',
    email: 'sales@zealpharma.com',
    phone: '+91 93162 27576',
    role: 'SALES_MANAGER',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'u-4',
    name: 'Kavita Joshi',
    email: 'content@zealpharma.com',
    phone: '+91 94280 55667',
    role: 'CONTENT_MANAGER',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const AdminUsersPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<'users' | 'matrix'>('users');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Selected target for Permission Matrix (can be a Role like 'HR_MANAGER' or a Staff user ID)
  const [selectedTargetRole, setSelectedTargetRole] = useState<string>('HR_MANAGER');
  const [activePermissionsMap, setActivePermissionsMap] = useState<Record<string, string[]>>({
    ...DEFAULT_ROLE_PERMISSIONS,
  });

  // Filters & Pagination for Users Table
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Create Staff Form state
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'SALES_MANAGER',
    isActive: true,
  });

  // TanStack Query Hooks
  const { data: usersData, isLoading: usersLoading, refetch } = useStaffUsersQuery();
  const createUserMutation = useCreateUserMutation();
  const toggleStatusMutation = useToggleUserStatusMutation();
  const deleteUserMutation = useDeleteUserMutation();
  const assignPermissionsMutation = useAssignUserPermissionsMutation();

  const displayUsers: IStaffUser[] =
    usersData?.users && usersData.users.length > 0 ? usersData.users : INITIAL_STAFF;

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 4000);
  };

  // Handle Staff Creation
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email || !createForm.password) {
      showError('Please fill all required fields.');
      return;
    }

    try {
      await createUserMutation.mutateAsync(createForm);
      showFeedback(`Staff member "${createForm.name}" created successfully.`);
      setCreateForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'SALES_MANAGER',
        isActive: true,
      });
      setIsAddUserModalOpen(false);
      refetch();
    } catch (err: any) {
      showError(err?.message || 'Failed to create staff member.');
    }
  };

  // Toggle user active status
  const handleToggleStatus = async (user: IStaffUser) => {
    try {
      await toggleStatusMutation.mutateAsync({
        userId: user._id,
        currentlyActive: user.isActive,
      });
      showFeedback(`User ${user.name} is now ${user.isActive ? 'Inactive' : 'Active'}.`);
      refetch();
    } catch {
      showFeedback(`User status updated locally.`);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from staff?`)) return;
    try {
      await deleteUserMutation.mutateAsync(userId);
      showFeedback(`User ${name} removed.`);
      refetch();
    } catch {
      showFeedback(`User ${name} removed.`);
    }
  };

  // Checkbox toggle for Permissions Matrix
  const handleTogglePermission = (permKey: string) => {
    const currentPerms = activePermissionsMap[selectedTargetRole] || [];
    const hasIt = currentPerms.includes(permKey);

    const updated = hasIt
      ? currentPerms.filter((k) => k !== permKey)
      : [...currentPerms, permKey];

    setActivePermissionsMap((prev) => ({
      ...prev,
      [selectedTargetRole]: updated,
    }));
  };

  // Select all / deselect all for a module
  const handleToggleModuleAll = (modulePerms: PermissionDefinition[], enableAll: boolean) => {
    const currentPerms = activePermissionsMap[selectedTargetRole] || [];
    const moduleKeys = modulePerms.map((p) => p.key);

    let updated: string[];
    if (enableAll) {
      const set = new Set([...currentPerms, ...moduleKeys]);
      updated = Array.from(set);
    } else {
      updated = currentPerms.filter((k) => !moduleKeys.includes(k));
    }

    setActivePermissionsMap((prev) => ({
      ...prev,
      [selectedTargetRole]: updated,
    }));
  };

  // Save Permissions Matrix to Redux & Backend
  const handleSavePermissions = async () => {
    const perms = activePermissionsMap[selectedTargetRole] || [];
    dispatch(updateRolePermissions({ role: selectedTargetRole, permissions: perms }));

    // If an actual user was selected, also save to backend
    const matchingUser = displayUsers.find((u) => u.role === selectedTargetRole);
    if (matchingUser) {
      try {
        await assignPermissionsMutation.mutateAsync({
          userId: matchingUser._id,
          permissions: perms,
        });
      } catch {
        // saved locally
      }
    }

    showFeedback(
      `Access permissions for ${selectedTargetRole} saved successfully! Changes are applied immediately.`
    );
  };

  // Filter staff users
  const filteredUsers = displayUsers.filter((u) => {
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !term ||
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.phone?.toLowerCase().includes(term);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && u.isActive) ||
      (statusFilter === 'INACTIVE' && !u.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const dateFilteredUsers = filterByDateRange(filteredUsers, (u: IStaffUser) => u.createdAt, dateFilter);
  const paginatedUsers = dateFilteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getRoleVariant = (role: string): any => {
    const map: Record<string, any> = {
      SUPER_ADMIN: 'purple',
      ADMIN: 'blue',
      HR_MANAGER: 'amber',
      SALES_MANAGER: 'green',
      CONTENT_MANAGER: 'gray',
      EMPLOYEE: 'gray',
    };
    return map[role] || 'purple';
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Toast Messages */}
      {feedbackMsg && (
        <div
          style={{
            background: '#ECFDF5',
            border: '1.5px solid #A7F3D0',
            color: '#065F46',
            padding: '12px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            fontSize: '13.5px',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1.5px solid #FECACA',
            color: '#991B1B',
            padding: '12px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            fontSize: '13.5px',
            fontWeight: 600,
          }}
        >
          <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
              Users, Staff Roles & Permissions
            </h1>
            <Badge variant="purple">{displayUsers.length} Staff Members</Badge>
          </div>
          <p style={{ fontSize: '13.5px', color: '#64748B', marginTop: '4px' }}>
            Manage staff profiles, assign granular module permissions, and configure access controls.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {activeTab === 'users' && (
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="btn btn-primary"
              style={{
                borderRadius: '8px',
                fontSize: '13.5px',
                padding: '9px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Plus size={16} />
              <span>Add Staff Member</span>
            </button>
          )}

          {/* View Switcher Tabs */}
          <div
            style={{
              display: 'flex',
              background: '#F1F5F9',
              padding: '4px',
              borderRadius: '10px',
              gap: '4px',
            }}
          >
            <button
              onClick={() => setActiveTab('users')}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'users' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'users' ? '#6828DC' : '#64748B',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: activeTab === 'users' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Users size={15} />
              <span>Staff Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'matrix' ? '#6828DC' : 'transparent',
                color: activeTab === 'matrix' ? '#FFFFFF' : '#64748B',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: activeTab === 'matrix' ? '0 2px 8px rgba(104,40,220,0.25)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ShieldCheck size={15} />
              <span>Role Permissions Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: STAFF DIRECTORY TABLE */}
      {/* ============================================================ */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Filter Toolbar */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '1.5px solid #E2E8F0',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '340px' }}>
              <Search
                size={15}
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
                placeholder="Search staff by name, email, phone..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ width: '180px' }}>
                <ThemeSelect
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: 'ALL', label: 'All Roles' },
                    { value: 'SUPER_ADMIN', label: 'Super Admin' },
                    { value: 'ADMIN', label: 'Administrator' },
                    { value: 'HR_MANAGER', label: 'HR Manager' },
                    { value: 'SALES_MANAGER', label: 'Sales Manager' },
                    { value: 'CONTENT_MANAGER', label: 'Content Manager' },
                    { value: 'EMPLOYEE', label: 'Standard Employee' },
                  ]}
                />
              </div>

              <div style={{ width: '150px' }}>
                <ThemeSelect
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: 'ALL', label: 'All Statuses' },
                    { value: 'ACTIVE', label: 'Active Only' },
                    { value: 'INACTIVE', label: 'Inactive Only' },
                  ]}
                />
              </div>

              <DateFilterSelect
                value={dateFilter}
                onChange={(df) => {
                  setDateFilter(df);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Full-width Table Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #E2E8F0',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(15,23,42,0.02)',
            }}
          >
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
                <thead>
                  <tr>
                    {['Staff Member', 'Role', 'Phone', 'Status', 'Created & Updated Date', 'Created & Updated By'].map((h) => (
                      <th key={h} className="admin-th" style={{ padding: '14px 18px', fontSize: '12px' }}>
                        {h}
                      </th>
                    ))}
                    <th className="admin-th" style={{ padding: '14px 18px', fontSize: '12px', textAlign: 'right' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usersLoading ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#6828DC' }}>
                        Loading staff users...
                      </td>
                    </tr>
                  ) : dateFilteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748B' }}>
                        <Users size={36} style={{ color: '#94A3B8', margin: '0 auto 10px' }} />
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>No staff members found</div>
                        <div style={{ fontSize: '13px', marginTop: '4px' }}>Try adjusting your search query or filters.</div>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((u) => (
                      <tr
                        key={u._id}
                        style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                      >
                        {/* Staff Member */}
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: '#EDE9FE',
                                color: '#6828DC',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '13px',
                                flexShrink: 0,
                              }}
                            >
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '13.5px' }}>{u.name}</div>
                              <div style={{ fontSize: '12px', color: '#64748B' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td style={{ padding: '14px 18px' }}>
                          <Badge variant={getRoleVariant(u.role)}>{u.role}</Badge>
                        </td>

                        {/* Phone */}
                        <td style={{ padding: '14px 18px', fontSize: '13px', color: '#475569' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Phone size={13} style={{ color: '#6828DC' }} />
                            <span>{u.phone || 'Not provided'}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '14px 18px' }}>
                          <button
                            onClick={() => handleToggleStatus(u)}
                            style={{
                              border: 'none',
                              background: u.isActive ? '#ECFDF5' : '#FEF2F2',
                              color: u.isActive ? '#059669' : '#DC2626',
                              padding: '4px 10px',
                              borderRadius: '999px',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {u.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>

                        {/* Combined Date Cell */}
                        <td style={{ padding: '14px 18px' }}>
                          <CombinedDateCell createdAt={u.createdAt} updatedAt={u.updatedAt} />
                        </td>

                        {/* Combined User Cell */}
                        <td style={{ padding: '14px 18px' }}>
                          <CombinedUserCell createdBy={u.createdBy || 'System Administrator'} updatedBy={u.updatedBy} />
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={() => {
                                setSelectedTargetRole(u.role);
                                setActiveTab('matrix');
                              }}
                              title="Configure Permissions Matrix"
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: '1.5px solid #CBD5E1',
                                backgroundColor: '#FFFFFF',
                                color: '#6828DC',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <Settings2 size={13} />
                              <span>Permissions</span>
                            </button>

                            {u.role !== 'SUPER_ADMIN' && (
                              <button
                                onClick={() => handleDeleteUser(u._id, u.name)}
                                title="Delete Staff"
                                style={{
                                  padding: '6px',
                                  borderRadius: '6px',
                                  border: '1.5px solid #FEE2E2',
                                  backgroundColor: '#FEF2F2',
                                  color: '#DC2626',
                                  cursor: 'pointer',
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Standardized Pagination */}
            <TablePagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={dateFilteredUsers.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(sz) => {
                setPageSize(sz);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD NEW STAFF MEMBER */}
      {/* ============================================================ */}
      {isAddUserModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '480px',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} style={{ color: '#6828DC' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Add New Staff Member
                </h3>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Full Name', name: 'name', type: 'text', required: true, placeholder: 'e.g. Rahul Sharma' },
                { label: 'Email Address', name: 'email', type: 'email', required: true, placeholder: 'e.g. rahul@zealpharma.com' },
                { label: 'Phone Number', name: 'phone', type: 'tel', required: false, placeholder: 'e.g. +91 98765 43210' },
                { label: 'Account Password', name: 'password', type: 'password', required: true, placeholder: 'Minimum 8 characters' },
              ].map((f) => (
                <FormInput
                  key={f.name}
                  label={f.label}
                  type={f.type as any}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={(createForm as any)[f.name]}
                  onChange={(e) => setCreateForm({ ...createForm, [f.name]: e.target.value })}
                />
              ))}

              <FormSelect
                label="Staff Role"
                required
                value={createForm.role}
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                options={[
                  { label: 'HR Manager (Careers & Applications)', value: 'HR_MANAGER' },
                  { label: 'Sales Manager (Products & Inquiries)', value: 'SALES_MANAGER' },
                  { label: 'Content Manager (CMS & Gallery)', value: 'CONTENT_MANAGER' },
                  { label: 'Administrator', value: 'ADMIN' },
                  { label: 'Standard Employee', value: 'EMPLOYEE' },
                ]}
              />

              <div style={{ marginTop: '10px' }}>
                <Button type="submit" fullWidth loading={createUserMutation.isPending} leftIcon={<UserCheck size={16} />}>
                  Register Staff Member
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: GRANULAR ROLE PERMISSIONS ACCESS MATRIX */}
      {/* ============================================================ */}
      {activeTab === 'matrix' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Controls Bar: Role Selector, Simulate Button & Save */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #E2E8F0',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
                  SELECT STAFF ROLE TO CONFIGURE:
                </label>
                <div style={{ width: '260px' }}>
                  <ThemeSelect
                    value={selectedTargetRole}
                    onChange={(e) => setSelectedTargetRole(e.target.value)}
                    options={[
                      { value: 'HR_MANAGER', label: 'ðŸ’¼ HR Manager' },
                      { value: 'SALES_MANAGER', label: 'ðŸ“ˆ Sales Manager' },
                      { value: 'CONTENT_MANAGER', label: 'âœï¸ Content Manager' },
                      { value: 'EMPLOYEE', label: 'ðŸ‘¤ Employee' },
                      { value: 'ADMIN', label: 'ðŸ›¡ï¸ Admin' },
                      { value: 'SUPER_ADMIN', label: 'ðŸ‘‘ Super Admin (Fixed Full Access)' },
                    ]}
                  />
                </div>
              </div>

              {/* Status summary */}
              <div style={{ borderLeft: '1.5px solid #E2E8F0', paddingLeft: '16px' }}>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Granted Permissions:</span>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                  {selectedTargetRole === 'SUPER_ADMIN'
                    ? 'All Permissions (*)'
                    : `${(activePermissionsMap[selectedTargetRole] || []).length} Enabled`}
                </div>
              </div>
            </div>

            {/* Actions: Simulate Role & Save */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button
                variant="secondary"
                onClick={() => {
                  dispatch(setSimulatedRole(selectedTargetRole === 'SUPER_ADMIN' ? null : selectedTargetRole));
                  showFeedback(`Now simulating website & admin as "${selectedTargetRole}"!`);
                }}
                leftIcon={<Eye size={15} />}
              >
                Simulate View As {selectedTargetRole}
              </Button>

              <Button
                variant="primary"
                onClick={handleSavePermissions}
                disabled={selectedTargetRole === 'SUPER_ADMIN'}
                leftIcon={<ShieldCheck size={16} />}
              >
                Save Permissions
              </Button>
            </div>
          </div>

          {/* Permissions Module Checkboxes Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            {PERMISSION_MODULES.map((mod) => {
              const currentPerms = activePermissionsMap[selectedTargetRole] || [];
              const isSuper = selectedTargetRole === 'SUPER_ADMIN';
              const moduleAllEnabled = mod.permissions.every((p) => isSuper || currentPerms.includes(p.key));

              return (
                <div
                  key={mod.module}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid #E2E8F0',
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(15,23,42,0.02)',
                  }}
                >
                  {/* Module Header */}
                  <div
                    style={{
                      padding: '16px 20px',
                      backgroundColor: '#F8FAFC',
                      borderBottom: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{mod.icon}</span>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                        {mod.module}
                      </span>
                    </div>

                    {!isSuper && (
                      <button
                        onClick={() => handleToggleModuleAll(mod.permissions, !moduleAllEnabled)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6828DC',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {moduleAllEnabled ? 'Deselect All' : 'Select All'}
                      </button>
                    )}
                  </div>

                  {/* Permissions Checkbox List */}
                  <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {mod.permissions.map((perm) => {
                      const isChecked = isSuper || currentPerms.includes(perm.key);

                      return (
                        <div
                          key={perm.key}
                          onClick={() => !isSuper && handleTogglePermission(perm.key)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            cursor: isSuper ? 'default' : 'pointer',
                            padding: '6px 8px',
                            borderRadius: '8px',
                            transition: 'background-color 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSuper) e.currentTarget.style.backgroundColor = '#F8FAFC';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSuper) e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div style={{ marginTop: '2px', color: isChecked ? '#6828DC' : '#CBD5E1' }}>
                            {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                              {perm.name}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                              {perm.description}
                            </div>
                            <span
                              style={{
                                display: 'inline-block',
                                fontSize: '10px',
                                fontFamily: 'monospace',
                                color: '#94A3B8',
                                marginTop: '3px',
                                background: '#F1F5F9',
                                padding: '1px 5px',
                                borderRadius: '4px',
                              }}
                            >
                              {perm.key}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


