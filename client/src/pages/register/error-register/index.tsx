import BasicLayout from '@/layouts/BasicLayout';
import Label from '@/components/Label/Label';
import MainLayout from '@/layouts/MainLayout';
import Button from '@/components/Button/Button';
import router from 'next/router';

const handleButtonClick = () => {
	router.push('/register');
};

const UserList = () => {
	return (
		<MainLayout>
			<BasicLayout title='Error al registrarse'>
				<div style={{ backgroundColor: 'white' }}>
					<Label
						text='Ocurrió un error al realizar el registro, intente de nuevo.'
						variant='h5'
					/>
				</div>
                <Button label='Registrarse' onClick={handleButtonClick} />
			</BasicLayout>
		</MainLayout>
	);
};

export default UserList;