import { Menu, MenuItem } from '@mui/material';
import AvatarButton from './AvatarButton';
import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { Route } from '@/components/Routes';
import en from '@/locale/en';
import es from '@/locale/es';

type AvatarMenuProps = {
	userData: {
		avatar?: string;
		name?: string;
	};
	routes: Route[];
};
const AvatarMenu: React.FC<AvatarMenuProps> = ({ userData, routes }) => {
	const router = useRouter();
	const [menuAvatarOpen, setMenuAvatarOpen] = useState(false);
	const avatarRef = useRef<HTMLButtonElement | null>(null);
	const { locale } = router;
	const t = locale === 'en' ? en : es;

	const handleAvatarClick = () => {
		setMenuAvatarOpen(true);
	};

	const handleMenuAvatarClose = () => {
		setMenuAvatarOpen(false);
	};

	return (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<AvatarButton
				ref={avatarRef}
				src={userData?.avatar || undefined}
				alt={userData?.name || 'User'}
				onClick={handleAvatarClick}
			/>
			<Menu
				anchorEl={avatarRef.current}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				open={menuAvatarOpen}
				onClose={handleMenuAvatarClose}
			>
				{/* Items del menu */}
				{routes?.map((page: any, index: number) => (
					<MenuItem key={index} onClick={() => router.push(page.path)}>
						{t[page.name]}
					</MenuItem>
				))}
				<MenuItem onClick={() => signOut({ callbackUrl: '/api/auth/signin' })}>
					Cerrar sesion
				</MenuItem>

				{/* Agregar más elementos de menú */}
			</Menu>
		</div>
	);
};

export default AvatarMenu;
