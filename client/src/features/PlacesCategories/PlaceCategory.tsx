import { Category } from "../Categories/category";
import { Place } from "../Places/place";

export interface PlaceCategory {
    name: string;
    id?: string;
    place: Place;
    category: Category;
}