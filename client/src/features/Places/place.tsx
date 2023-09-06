import { Category } from '../Categories/category';
import { PlacePhoto } from "../PlacesPhotos/place_photo";
import { PlaceSchedule } from "../PlacesSchedules/place_schedule";
import { Location } from './location';

export interface Place {
    id?: string;
    name: string;
    description: string;
    note: string;
    schedules: PlaceSchedule[];
    photos: PlacePhoto[];
    principalCategory: Category;
    categories: Category[];
    url: string
    phone: string;
    domicile: string
    location: Location;
    origin: string;
}