import { Category } from "../Categories/category";
import { User } from "../Users/user";

export interface createSolicitudInput {
    legalName: string;

    address: string;

    cuit: string;

    categories: Category[],

    subcategories: Category[];

    phone: string;

    owner: User;

    operators: User[];

    supportingDocumentation: File[];
}
