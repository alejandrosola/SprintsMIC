import { Category } from "../Categories/category";
import { User } from "../Users/user";

export interface Organization {
  id: string;

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

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;
}
