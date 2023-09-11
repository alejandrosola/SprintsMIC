import axios from 'axios';

export const login = async (email: string, password: string) => {
	const body = {
		email: email,
		password: password,
	};
	const response = await axios.post(`http://localhost:8000/users/login`, body);
	return response.data;
};
