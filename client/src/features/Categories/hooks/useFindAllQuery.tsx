import axios from 'axios';

export const findAll = async () => {
	try {
		const response = await axios.get(`http://localhost:8000/categories`);
		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};