import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
  IconPlayerPlayFilled,
  IconClipboardList,
} from '@tabler/icons-react';

import { uniqueId } from 'lodash';

// Function to generate menu items based on user role
const MenuItems = (userRole) => {
  const baseItems = [
    {
      navlabel: true,
      subheader: 'Home',
    },
    {
      id: uniqueId(),
      title: 'Dashboard',
      icon: IconLayoutDashboard,
      href: '/dashboard',
    },
  ];

  if (userRole === 'student') {
    return [
      ...baseItems,
      {
        navlabel: true,
        subheader: 'Student',
      },
      {
        id: uniqueId(),
        title: 'Exams',
        icon: IconTypography,
        href: '/exam',
      },
      {
        id: uniqueId(),
        title: 'My Results',
        icon: IconCopy,
        href: '/student/results/all',
      },
    ];
  } else if (userRole === 'teacher') {
    return [
      ...baseItems,
      {
        navlabel: true,
        subheader: 'Teacher',
      },
      {
        id: uniqueId(),
        title: 'Create Exam',
        icon: IconMoodHappy,
        href: '/create-exam',
      },
      {
        id: uniqueId(),
        title: 'Add Questions',
        icon: IconLogin,
        href: '/add-questions',
      },
      {
        id: uniqueId(),
        title: 'My Exams',
        icon: IconClipboardList,
        href: '/teacher/exams/overview',
      },
      {
        id: uniqueId(),
        title: 'Exam Logs',
        icon: IconUserPlus,
        href: '/exam-log',
      },
    ];
  }

  // Fallback for unknown roles
  return baseItems;
};

// For backward compatibility, export the original static menu
const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  {
    navlabel: true,
    subheader: 'Student',
  },
  {
    id: uniqueId(),
    title: 'Exams',
    icon: IconTypography,
    href: '/exam',
  },
  {
    id: uniqueId(),
    title: 'Results',
    icon: IconCopy,
    href: '/student/results/all',
  },
  {
    navlabel: true,
    subheader: 'Teacher',
  },
  {
    id: uniqueId(),
    title: 'Create Exam',
    icon: IconMoodHappy,
    href: '/create-exam',
  },
  {
    id: uniqueId(),
    title: 'Add Questions',
    icon: IconLogin,
    href: '/add-questions',
  },
  {
    id: uniqueId(),
    title: 'Exam Logs',
    icon: IconUserPlus,
    href: '/exam-log',
  },
];

export default MenuItems;
export { Menuitems };
