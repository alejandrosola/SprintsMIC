import axios from 'axios';

export const putPlace = async (place: FormData) => {
	const response = await axios.put(`http://localhost:8000/places`, place);
	return response.data;
};
