export default [{
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
// {
//   title: 'Departments',
//   route: 'departments',
//   icon: 'FileIcon',
// },
{
  title: 'File Manager',
  route: 'file-manager',
  icon: 'DatabaseIcon',
  children: [
    {
      title: 'Overview',
      route: 'file-manager',
    },
    {
      title: 'File Browser',
      route: { name: 'file-browser' },
    },

    {
      title: 'Activity',
      route: { name: 'file-activity-log' },
    },

    {
      title: 'Settings',
      route: { name: 'disk-settings' },
    },
  ],
},
// {
//   title: 'Payroll',
//   route: 'notifications',
//   icon: 'FileIcon',
// },
{
  title: 'Calendar',
  route: 'calendar',
  icon: 'CalendarIcon',
},
{
  title: 'Policies',
  route: 'policies',
  icon: 'ShieldIcon',
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
}]
