import axios from "axios";
import { URL } from "../../constants";
import { Organization } from "../Organization";

export const updateSolicitud = async (aOrganization: Organization) => {
  const response = await axios.put(`${URL}/organizations/`, aOrganization);
  return response.data;
};
