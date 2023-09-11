// Rutas que apareceran en el drawer

// eslint-disable-next-line import/no-anonymous-default-export

export enum RoutesVisibility {
  NO,
  PERFIL,
  NAVBAR,
}

export enum LoggedRequire {
  YES,
  NO,
  DONT_CARE,
}

export type Route = {
  path: string;
  name: string;
  permission: never[];
  requireLogin: LoggedRequire;
  visible: RoutesVisibility;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    path: "/home",
    name: "home",
    permission: [],
    requireLogin: LoggedRequire.DONT_CARE,
    visible: RoutesVisibility.NAVBAR,
  },
  {
    path: "/faq",
    name: "FAQ",
    permission: [],
    requireLogin: LoggedRequire.DONT_CARE,
    visible: RoutesVisibility.NAVBAR,
  },
  {
    path: "/places",
    name: "places",
    permission: [],
    requireLogin: LoggedRequire.YES,
    visible: RoutesVisibility.NO,
  },
  {
    path: "/organization",
    name: "organization",
    permission: [],
    requireLogin: LoggedRequire.YES,
    visible: RoutesVisibility.NO,
  },
  {
    path: "/organization/detail",
    name: "neworganization",
    permission: [],
    requireLogin: LoggedRequire.YES,
    visible: RoutesVisibility.NO,
  },
  {
    path: "/mi_perfil",
    name: "profile",
    permission: [],
    requireLogin: LoggedRequire.YES,
    visible: RoutesVisibility.PERFIL,
  },
  {
    path: "/register",
    name: "register",
    permission: [],
    requireLogin: LoggedRequire.NO,
    visible: RoutesVisibility.NO,
  },
  {
    path: "/auth/signin",
    name: "signin",
    permission: [],
    requireLogin: LoggedRequire.NO,
    visible: RoutesVisibility.NAVBAR,
  },
];
