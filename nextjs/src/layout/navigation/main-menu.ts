export const adminMenuArray = () => {
  return [
    {
      name: "dashboard",
      href: "/admin",
    },
    {
      name: "clients",
      href: "/admin/clients",
    },
    // {
    //   name: "messages",
    //   href: "/admin/messages",
    // },
    {
      name: "activity",
      href: "/admin/activity",
    },
    {
      name: "team",
      href: "/admin/team",
    },
  ];
};

export const clientMenuArray = (clientID: string) => {
  return [
    {
      name: "dashboard",
      href: "/admin",
    },
    {
      name: "projects",
      href: "/admin/clients/" + clientID,
    },
    // {
    //   name: "messages",
    //   href: "/admin/messages",
    // },
    {
      name: "activity",
      href: "/admin/activity",
    },
    {
      name: "team",
      href: "/admin/clients/" + clientID + "/settings",
    },
  ];
};
