import { Category } from "../Categories/category";
import { Place } from "../Places/place";

export interface PlaceCategory {
    id?: string;
    place: Place;
    category: Category;
}