// index.js

const role = localStorage.getItem('user_role'); // get role

// Menus for staff
const staffMenu = [
  {
    title: 'Dashboard',
    route: 'home',
    icon: 'HomeIcon',
  },
  {
    title: 'Courses',
    icon: 'BookOpenIcon',
    children: [
      {
        title: 'All Courses',
        icon: 'FileIcon',
        route: { name: 'all-courses' },
      },
      {
        title: 'Course Analytics',
        icon: 'BarChart2Icon',
        route: { name: 'course-analytics' },
      },
      {
        title: 'My Performance',
        icon: 'TrendingUpIcon',
        route: { name: 'my-performance' },
      },

    ],
  },
    {
    title: 'Certificates',
    icon: 'AwardIcon',
    children: [
      {
        title: 'All Certificates',
        icon: 'FileIcon',
        route: { name: 'certificates' },
      },
    ],
  },
    {
    title: 'File Manager',
    route: 'file-manager',
    icon: 'DatabaseIcon',
    children: [
      { title: 'Overview', route: 'file-manager' },
      { title: 'File Browser', route: { name: 'file-browser' } },

    ],
  },
    {
    title: 'Calendar',
    route: 'calendar',
    icon: 'CalendarIcon',
  },
  {
    title: 'Policies',
    route: 'policies',
    icon: 'ShieldIcon',
    children: [
      { title: 'All Policies', icon: 'FileIcon', route: { name: 'policies' } },
      
    ],
  },
  {
    title: 'Trainings',
    route: 'trainings',
    icon: 'FileIcon',
  },
  {
    title: 'Notifications',
    route: 'notifications',
    icon: 'BellIcon',
  },
];

// Menus for admin (full access)
const adminMenu = [
  {
    title: 'Dashboard',
    route: 'home',
    icon: 'HomeIcon',
  },
  {
    title: 'Manage Records',
    route: 'residents-management',
    icon: 'UsersIcon',
    children: [
      {
        title: 'Residents Records',
        icon: 'FileIcon',
        route: { name: 'residents-management' },
      },
      {
        title: 'Staff Records',
        icon: 'FileIcon',
        route: { name: 'staff-records' },
      },
    ],
  },
  {
    title: 'Courses',
    icon: 'BookOpenIcon',
    children: [
      {
        title: 'All Courses',
        icon: 'FileIcon',
        route: { name: 'all-courses' },
      },
      {
        title: 'Course Analytics',
        icon: 'BarChart2Icon',
        route: { name: 'course-analytics' },
      },
      {
        title: 'My Performance',
        icon: 'TrendingUpIcon',
        route: { name: 'my-performance' },
      },
      {
        title: 'Create Course',
        icon: 'PlusCircleIcon',
        route: { name: 'create-course' },
      },
    ],
  },
  {
    title: 'Certificates',
    icon: 'AwardIcon',
    children: [
      {
        title: 'All Certificates',
        icon: 'FileIcon',
        route: { name: 'certificates' },
      },
    ],
  },
  {
    title: 'File Manager',
    route: 'file-manager',
    icon: 'DatabaseIcon',
    children: [
      { title: 'Overview', route: 'file-manager' },
      { title: 'File Browser', route: { name: 'file-browser' } },
      { title: 'Activity', route: { name: 'file-activity-log' } },
      { title: 'Settings', route: { name: 'disk-settings' } },
    ],
  },
  {
    title: 'Calendar',
    route: 'calendar',
    icon: 'CalendarIcon',
  },
  {
    title: 'Policies',
    route: 'policies',
    icon: 'ShieldIcon',
    children: [
      { title: 'All Policies', icon: 'FileIcon', route: { name: 'policies' } },
      {
        title: 'Create Policy',
        icon: 'FileIcon',
        route: { name: 'create-policies' },
      },
    ],
  },
  {
    title: 'Trainings',
    route: 'trainings',
    icon: 'FileIcon',
  },
  {
    title: 'Notifications',
    route: 'notifications',
    icon: 'BellIcon',
  },
  {
    title: 'Settings',
    route: 'settings',
    icon: 'SettingsIcon',
  },
];

// Export based on role
export default role === 'staff' ? staffMenu : adminMenu;
