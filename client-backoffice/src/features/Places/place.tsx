import { Accessibility } from '../Accessibilities/Accessibility';
import { Category } from '../Categories/category';
import { Organization } from '../Organizations/organization';
import { PlaceCategory } from '../PlacesCategories/place_category';
import { PlacePhoto } from "../PlacesPhotos/place_photo";
import { PlaceSchedule } from "../PlacesSchedules/place_schedule";
import { Service } from '../Services/Service';

interface Point {
    type: 'Point';
    coordinates: [number, number]; // Coordenadas de latitud y longitud
}

export interface Place {
    id?: string;
    name?: string;
    description: string;
    note: string;
    schedules?: PlaceSchedule[];
    photos?: PlacePhoto[];
    principalCategory?: Category;
    categories?: PlaceCategory[];
    url: string;
    facebook_url: string;
    twitter_url: string;
    instagram_url: string;
    phone: string;
    domicile: string
    location?: Point;
    origin?: string;
    minors?: string;
    accessibilities?: Accessibility[];
    services?: Service[];
    organization?: Organization;
}