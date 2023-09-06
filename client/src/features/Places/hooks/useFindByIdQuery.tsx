import axios from 'axios';

export const findById = async (id: string) => {
	try {
		const response = await axios.get(`http://localhost:8000/places/id/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};