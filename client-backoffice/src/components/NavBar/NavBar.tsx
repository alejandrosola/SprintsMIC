import React, { useEffect, useState } from 'react';
import {
	AppBar,
	Box,
	Drawer,
	Link,
	List,
	ListItem,
	ListItemText,
	Toolbar,
	useTheme,
} from '@mui/material';
import Logo from '../Logo/Logo'; // Ajusta la ruta a tu componente Logo
import LogoColor from '../Logo/LogoTypes';
import Button from '../Button/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { useSession } from 'next-auth/react';
import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import { User } from '@/features/Users/user';
import { useRouter } from 'next/router';
import en from '@/locale/en';
import es from '@/locale/es';
import LanguageDropdown from '../Language/LanguageDropdown';

import Routes, {
	LoggedRequire,
	Route,
	RoutesVisibility,
} from '@/components/Routes';
import AvatarMenu from '../Avatar/AvatarMenu';

const initialPerfilRoutes: Route[] = [
	{
		path: '/home',
		name: 'Home',
		permission: [],
		requireLogin: LoggedRequire.NO,
		visible: RoutesVisibility.NO,
	},
	// ... otras rutas
];

// Define el tipo para las traducciones
type Translation = {
	[key: string]: string;
};

const Navbar: React.FC = () => {
	const { data: session } = useSession();
	const theme = useTheme(); // Obtiene el objeto theme
	const router = useRouter();
	const { locale } = router;
	const t: Translation = locale === 'en' ? en : es; // Asegúrate de que 'en' y 'es' estén definidos correctamente

	const [userData, setUserData] = useState<User | null>(null);
	const [allowedNavBarRoutes, setAllowedNavBarRoutes] =
		useState<Route[]>(initialPerfilRoutes);
	const [allowedPerfilRoutes, setAllowedPerfilRoutes] =
		useState<Route[]>(initialPerfilRoutes);

	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		getUserInfo(session?.user?.email);
		getUserAllowedRoutes();
	}, [session]);

	const getUserInfo = async (email: string | null | undefined) => {
		if (email) {
			const response = await getuserByEmail(email);
			if (response.data) {
				setUserData(response.data);
			}
		}
	};

	const getUserAllowedRoutes = () => {
		const filteredNavBarRoutes: Route[] = Routes.filter((route: any) => {
			if (route.visible !== RoutesVisibility.NAVBAR) {
				return false;
			}
			if (route.requireLogin === LoggedRequire.DONT_CARE) {
				return true;
			}
			if (session?.user) {
				return route.requireLogin === LoggedRequire.YES;
			}
			return route.requireLogin === LoggedRequire.NO;
		});

		const filteredPerfilRoutes: Route[] = Routes.filter((route: any) => {
			if (route.visible !== RoutesVisibility.PERFIL) {
				return false;
			}
			if (route.requireLogin === LoggedRequire.DONT_CARE) {
				return true;
			}
			if (session?.user) {
				return route.requireLogin === LoggedRequire.YES;
			}
			return route.requireLogin === LoggedRequire.NO;
		});

		setAllowedNavBarRoutes(filteredNavBarRoutes);
		setAllowedPerfilRoutes(filteredPerfilRoutes);
	};

	const handleToggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<Box>
			<AppBar position='static'>
				<Toolbar
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						borderBottom: `10px solid ${theme.palette.primary.dark}`,
						backgroundColor: 'white', //#dfcae0
					}}
				>
					<Link onClick={() => router.push('/home')}>
						<Logo color={LogoColor.DIGITAL_PHRASE} width={280} />
					</Link>

					{/* Box de Menu de computadora */}
					<Box
						sx={{
							display: {
								xs: 'none',
								md: 'flex',
								gap: '10px',
							}, // Se muestra en md y mayores
						}}
					>
						{allowedNavBarRoutes?.map((page: Route, index: number) => (
							<Button
								key={index}
								onClick={() => router.push(page.path)}
								sx={{ marginLeft: '10px' }}
							>
								{t[page.name]}
							</Button>
						))}
						<LanguageDropdown />
						{userData && (
							<AvatarMenu
								userData={userData!}
								routes={allowedPerfilRoutes}
							></AvatarMenu>
						)}
						{/* <h1>{session?.user?.email}</h1> */}
					</Box>

					{/* Box de Menu de celular */}
					<Box
						sx={{
							display: { xs: 'block', md: 'none' }, // Se muestra en xs y s
						}}
					>
						<Button onClick={handleToggleMenu}>
							<MenuIcon />
						</Button>
					</Box>
				</Toolbar>
			</AppBar>

			<Drawer anchor='right' open={menuOpen} onClose={handleToggleMenu}>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<Logo color={LogoColor.DIGITAL} width={100} />
					</div>
					<List>
						{allowedNavBarRoutes?.map((page: any, index: number) => (
							<React.Fragment key={index + 100}>
								<ListItem button onClick={() => router.push(page.path)}>
									<ListItemText
										primary={t[page.name]}
										style={{ display: 'flex', justifyContent: 'center' }}
									/>
								</ListItem>
							</React.Fragment>
						))}
					</List>
					<LanguageDropdown />
					{userData && (
						<AvatarMenu
							userData={userData!}
							routes={allowedPerfilRoutes}
						></AvatarMenu>
					)}
				</div>
			</Drawer>
		</Box>
	);
};

export default Navbar;
