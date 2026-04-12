type Route = {
  path: string;
  allowedRoles: string[];
};

export const ROUTES_ACCESS: Route[] = [
  { path: '/dashboard', allowedRoles: ['admin', 'manager', 'sales', 'inventory','other'] }, 
  { path: '/dashboard/customer', allowedRoles: ['sales', 'admin', 'manager'] },
  { path: '/dashboard/item', allowedRoles: ['admin', 'manager', 'inventory'] },
  { path: '/dashboard/stock-alerts', allowedRoles: ['admin', 'manager', 'inventory'] },
  { path: '/dashboard/order', allowedRoles: ['sales', 'admin', 'manager'] },
  { path: '/dashboard/settings', allowedRoles: ['admin', 'manager', 'sales', 'inventory','other'] }, 
  { path: '/dashboard/user', allowedRoles: ['admin'] },
  { path: '/dashboard/staff', allowedRoles: ['admin'] },
  { path: '/dashboard/transaction', allowedRoles: ['admin'] },
  { path: '/dashboard/attendance', allowedRoles: ['admin'] }
];

export function hasAccess(userRole: string, path: string): boolean {
  const route = ROUTES_ACCESS.find(r => r.path === path);
  if (!route) return false;
  // Case-insensitive role comparison
  return route.allowedRoles.some(role => role.toLowerCase() === userRole.toLowerCase());
}
