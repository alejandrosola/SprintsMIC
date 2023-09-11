import { Place } from "src/domain/place/model/place.entity";
import { PlacePayload } from "../payload/place-payload";

export class PlaceRestMapper {
    static toPayload(place: Place): PlacePayload {
        return {
            id: place.id,
            name: place.name,
            description: place.description,
            note: place.note,
            schedules: place.schedules,
            photos: place.photos,
            principalCategory: place.principalCategory,
            categories: place.categories,
            url: place.url,
            phone: place.phone,
            domicile: place.domicile,
            location: place.location,
            accessibilities: place.accessibilities,
            services: place.services,
            minors: place.minors,
            organization: place.organization,
            facebook_url: place.facebook_url,
            twitter_url: place.twitter_url,
            instagram_url: place.instagram_url,
        };
    }
}