export default [{
  title: 'Dashboard',
  route: 'home',
  icon: 'HomeIcon',
},
{
  title: 'Manage Records',
  route: 'residents-management',
  icon: 'FileIcon',
  children: [
    {
      title: 'Residents Records',
      route: { name: 'residents-management'},
    },

    {
      title: 'Staff Records',
      route: { name: 'residents-manangement'},
    },
  ]
},
// {
//   title: 'Departments',
//   route: 'departments',
//   icon: 'FileIcon',
// },
{
  title: 'File Manager',
  route: 'file-manager',
  icon: 'FileIcon',
  children: [
    {
      title: 'Overview',
      route: 'file-manager',
    },
    {
      title: 'File Browser',
      route: { name: 'file-browser'},
    },

    {
      title: 'Activity',
      route: { name: 'file-activity-log'},
    },

    {
      title: 'Settings',
      route: { name: 'disk-settings'},
    },
  ]
},
{
  title: 'Notifications',
  route: 'notifications',
  icon: 'FileIcon',
},
{
  title: 'Settings',
  route: 'settings',
  icon: 'FileIcon',
}]
