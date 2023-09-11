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
		path: '/organization',
		name: 'organization',
		permission: [],
		requireLogin: LoggedRequire.YES,
		visible: RoutesVisibility.NAVBAR,
	},
	{
		path: '/places',
		name: 'places',
		permission: [],
		requireLogin: LoggedRequire.YES,
		visible: RoutesVisibility.NAVBAR,
	},
	{
		path: '/auth/signin',
		name: 'signin',
		permission: [],
		requireLogin: LoggedRequire.NO,
		visible: RoutesVisibility.NAVBAR,
	},
];
