import { Accessibility } from '../Accessibilities/Accessibility';
import { Category } from '../Categories/category';
import { Organization } from '../Organizations/Organization';
import { PlaceCategory } from '../PlacesCategories/PlaceCategory';
import { PlacePhoto } from "../PlacesPhotos/place_photo";
import { PlaceSchedule } from "../PlacesSchedules/place_schedule";
import { Service } from '../Services/Service';
import { Location } from './location';

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
    location?: Location;
    origin?: string;
    minors?: string;
    accessibilities?: Accessibility[];
    services?: Service[];
    organization?: Organization
}