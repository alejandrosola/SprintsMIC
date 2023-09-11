import Avatar from '@mui/material/Avatar';
import { SxProps } from '@mui/system';

type AvatarProps = {
	src?: string;
	className?: string;
	alt?: string;
	sx?: SxProps;
};

const MyAvatar: React.FC<AvatarProps> = ({
	src = './default.png',
	alt = 'User',
	className,
	sx, // Prop "sx" agregada
}) => {
	return <Avatar alt={alt} src={src} className={className} sx={sx} />; // Prop "sx" pasada al Avatar
};

export default MyAvatar;
