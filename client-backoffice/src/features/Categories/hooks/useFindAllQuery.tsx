import { URL } from '@/features/constants';
import axios from 'axios';

export const findAllCategories = async () => {
	try {
		const response = await axios.get(`${URL}/categories`);
		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};