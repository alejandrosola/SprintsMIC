export interface Category {
    id: string;

    name: string;

    father?: Category;
}