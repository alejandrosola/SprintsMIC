import BasicLayout from '@/layouts/BasicLayout';
import Label from '@/components/Label/Label';
import MainLayout from '@/layouts/MainLayout';

const UserList = () => {
	return (
		<MainLayout>
			<BasicLayout title='Registro exitoso'>
				<div style={{ backgroundColor: 'white' }}>
					<Label
						text='Por favor, revise su bandeja de entrada de correo electrónico (incluyendo correo no deseado o spam) y siga los pasos indicados.'
						variant='h5'
					/>
				</div>
			</BasicLayout>
		</MainLayout>
	);
};

export default UserList;
