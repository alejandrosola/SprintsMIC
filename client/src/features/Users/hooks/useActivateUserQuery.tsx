import axios from 'axios';
import { URL } from '../../constants';

export const activateUser = async (id: string) => {
	console.log('🚀 ~ file: useActivateUserQuery.tsx:4 ~ activateUser ~ id:', id);
	const response = await axios.post(`${URL}/users/activate/${id}`);
	return response.data;
};
