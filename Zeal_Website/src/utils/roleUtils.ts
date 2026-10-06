/**
 * Role and Designation utility helpers for Zeal Website
 */

export const getRoleDisplayName = (role?: any): string => {
  if (!role) return '';
  let r = typeof role === 'object' ? (role.name || role.code || '') : String(role);
  r = r.trim();

  // If it's a 24-character hexadecimal MongoDB ObjectId (e.g. 6aa939c6577640b478ec7a03), ignore it
  if (/^[0-9a-fA-F]{24}$/.test(r)) {
    return '';
  }

  const roleUpper = r.toUpperCase();
  switch (roleUpper) {
    case 'SUPER_ADMIN':
      return 'Super Admin';
    case 'ADMIN':
      return 'Administrator';
    case 'SALES_MANAGER':
      return 'Sales Manager';
    case 'HR_MANAGER':
      return 'HR Manager';
    case 'CONTENT_MANAGER':
      return 'Content Manager';
    case 'EMPLOYEE':
    case 'STAFF':
      return 'Staff Member';
    case 'USER':
      return ''; // Regular user has no staff title
    default:
      return r;
  }
};

export const isStaffRole = (role?: any): boolean => {
  const name = getRoleDisplayName(role);
  return Boolean(name && name.toLowerCase() !== 'user');
};

export const cleanDesignationValue = (designation?: string | null): string => {
  if (!designation) return '';
  const trimmed = designation.trim();
  // Strip any raw 24-hex ObjectId or "USER" accidental value
  if (/^[0-9a-fA-F]{24}$/.test(trimmed) || trimmed.toUpperCase() === 'USER') {
    return '';
  }
  return trimmed;
};
