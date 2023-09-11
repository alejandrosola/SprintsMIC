import { Minors } from '../model/minors.enum';
import { PlaceSchedule } from '../model/place-schedule.entity';
import { Place } from '../model/place.entity';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function esURL(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}

function isValidMinors(value: string): boolean {
	return Object.values(Minors).includes(value as Minors);
}

function isValidSchedule(schedule: PlaceSchedule): boolean {
	const openingTime = new Date(`1970-01-01T${schedule.openingHour}`);
	const closingTime = new Date(`1970-01-01T${schedule.closingHour}`);

	if (closingTime <= openingTime) {
		return false;
	}
	return true;
}

export function validatePlace(aPlace: Place): void {
	if (!aPlace.principalCategory) {
		throw new Error('La principal categoría es requerida');
	}

	if (!aPlace.location) {
		throw new Error('La ubicación es requerida');
	}

	if (aPlace.location.lat > 90 || aPlace.location.lat < -90) {
		throw new Error('Latitud fuera de los limites permitidos');
	}

	if (aPlace.location.lng > 180 || aPlace.location.lng < -180) {
		throw new Error('Longitud fuera de los limites permitidos');
	}

	// if (!esURL(aPlace.url)) {
	//     throw new Error("URL invalida")
	// }

	if (aPlace.minors && !isValidMinors(aPlace.minors)) {
		throw new Error('Calificacion de menores invalida');
	}

	if (aPlace.schedules) {
		for (const schedule of aPlace.schedules) {
			if (!isValidSchedule(schedule)) {
				throw new Error('Horario de cierre anterior al horario de apertura');
			}
		}
	}
}
