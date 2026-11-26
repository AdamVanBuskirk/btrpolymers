import {
  LayoutDashboard,
  Layers,
  GraduationCap,
  Calculator,
  Grid,
  Headphones,
  Settings,
} from 'lucide-react';

export const salesNavigation = [
  {
    label: 'Dashboard',
    path: '/sales',
    icon: LayoutDashboard,
    end: true,
    adminOnly: false,
  },
  {
    label: 'Material Library',
    path: '/sales/materials',
    icon: Layers,
    end: false,
    adminOnly: false,
  },
  {
    label: 'Training Catalog',
    path: '/sales/training',
    icon: GraduationCap,
    end: false,
    adminOnly: false,
  },
  {
    label: 'Pricing Calculator',
    path: '/sales/pricing',
    icon: Calculator,
    end: false,
    adminOnly: false,
  },
  {
    label: 'Selling Stream Matrix',
    path: '/sales/selling-streams',
    icon: Grid,
    end: false,
    adminOnly: false,
  },
  {
    label: 'Mock Calls',
    path: '/sales/mock-calls',
    icon: Headphones,
    end: false,
    adminOnly: false,
  },
  {
    label: 'Admin',
    path: '/sales/admin',
    icon: Settings,
    end: false,
    adminOnly: true,
  },
];