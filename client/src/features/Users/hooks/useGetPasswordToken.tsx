import axios from "axios";
import { URL } from '../../constants';

const getTokenData = async (aPasswordToken: string | string[] | undefined) => {
    return await axios
        .post(`${URL}/users/passwordToken/`, { token: aPasswordToken })
        .then((response) => {
            return response.data;
        })
        .catch((error: any) => {
            console.log(error);
            if (error.response.data.StatusCode === 500) return error.response.data;
        });
};

export default {
    getTokenData,
}