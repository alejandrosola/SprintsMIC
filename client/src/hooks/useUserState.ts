import { create } from "zustand";

interface User {
  id: number;
  name: string;
  email: string;
}

export const useUserStore = create<User[]>(() => [
  {
    id: 1,
    name: "Lautaro",
    email: "lautaro@gmail.com",
  },
  {
    id: 3,
    name: "asd",
    email: "asd@gmail.com",
  },
]);
