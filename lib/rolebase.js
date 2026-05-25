import { 
  FiLayout, 
  FiBriefcase, 
  FiBarChart2, 
  FiUsers, 
  FiSettings,
  FiTrendingUp,
  FiCheckSquare
} from 'react-icons/fi';

export const sidebarTabs = {
  admin: [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FiLayout },
    { name: 'Companies List', path: '/admin/companies', icon: FiBriefcase },
    { name: 'Onboarded', path: '/admin/converted-companies', icon: FiCheckSquare },
    { name: 'Conversions', path: '/admin/conversions', icon: FiBarChart2 },
  ],
  consultant: [
    { name: 'Dashboard', path: '/consultant/dashboard', icon: FiLayout },
    { name: 'Companies List', path: '/consultant/companies', icon: FiBriefcase },
    { name: 'My Clients', path: '/consultant/clients', icon: FiUsers },
    { name: 'Performance', path: '/consultant/performance', icon: FiTrendingUp },
    { name: 'Settings', path: '/consultant/settings', icon: FiSettings },
  ]
};

export const getTabsByRole = (role) => {
  return sidebarTabs[role] || sidebarTabs.consultant; // Default to consultant if role unknown
};

