
import axios from "axios";

export const findByCategory = async (id: string) => {
  const response = await axios.get(
    `http://localhost:8000/places/byCategory/${id}`
  );
  return response.data;
};
