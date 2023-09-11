import { Category } from "@/features/Categories/category";
import { User } from "@/features/Users/user";
import { Document } from "./Document";
export interface Organization {
    id?: string;
    legalName: string;
    address: string;
    cuit: string;
    categories: Category[];
    subcategories: Category[];
    phone: string;
    owner: User;
    operators: User[];
    supportingDocumentation: Document[];
    status: string;
    validator: User;
}