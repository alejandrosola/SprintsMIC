import React, { forwardRef } from 'react';
import { Avatar, Button, SxProps } from '@mui/material';

type AvatarButtonProps = {
	src?: string;
	alt?: string;
	onClick?: () => void;
	sx?: SxProps;
};

const AvatarButton: React.ForwardRefRenderFunction<
	HTMLButtonElement,
	AvatarButtonProps
> = ({ src = './default.png', alt = 'User', onClick, sx }, ref) => {
	const avatarStyle: SxProps = {
		'&:hover': {
			filter: 'brightness(1.2)', // Cambio de brillo al hacer hover
		},
	};

	return (
		<Button onClick={onClick} sx={sx} style={{ padding: 0 }} ref={ref}>
			<Avatar alt={alt} src={src} sx={avatarStyle} />
		</Button>
	);
};

export default forwardRef(AvatarButton);
