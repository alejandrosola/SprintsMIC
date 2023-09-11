import axios from "axios";

export const findByDistance = async (lat: number, lng: number) => {
  const response = await axios.get(
    `http://localhost:8000/places/byDistance/${lat}/${lng}`
  );
  return response.data;
};
