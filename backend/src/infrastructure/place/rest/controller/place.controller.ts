import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UseInterceptors,
	UploadedFiles,
} from '@nestjs/common';
import { Place } from 'src/domain/place/model/place.entity';
import { responseJson } from 'src/util/responseMessage';
import { PlaceRestMapper } from '../mapper/place-rest-mapper';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PlacePayload } from '../payload/place-payload';

import { CreatePlace } from 'src/domain/place/case/createPlace.case';
import { DeletePlace } from 'src/domain/place/case/deletePlace.case';
import { FindPlaces } from 'src/domain/place/case/findPlaces.case';
import { UpdatePlace } from 'src/domain/place/case/updatePlace.case';
import { PlaceInput } from '../input/place-input';
import { UpdatePlaceInput } from '../input/update-place-input';

import { MulterFile } from 'multer';
import { CreatePhoto } from 'src/domain/place/case/createPhoto.case';

require('dotenv').config({ path: '.env.local' }); // Esto carga las variables del .env.local

@Controller('places')
export class PlaceController {
	constructor(
		private readonly findPlaces: FindPlaces,
		private readonly createPlace: CreatePlace,
		private readonly deletePlace: DeletePlace,
		private readonly updatePlace: UpdatePlace,
		private readonly createPhoto: CreatePhoto
	) { }

	@Get()
	async findAll(): Promise<PlacePayload[]> {
		try {
			const somePlaces: Place[] = await this.findPlaces.findAll();
			return responseJson(
				200,
				'Espacios recuperados con exito',
				somePlaces.map((aPlace) => {
					return PlaceRestMapper.toPayload(aPlace);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('id/:id')
	async findById(@Param('id') id: string): Promise<PlacePayload> {
		try {
			const aPlace: Place = await this.findPlaces.findById(id);
			return aPlace
				? responseJson(200, 'Espacio recuperado con exito', aPlace)
				: responseJson(500, 'No existe ese espacio');
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post()
	@UseInterceptors(FilesInterceptor('photos'))
	async create(
		@Body() place: PlaceInput,
		@UploadedFiles() photos: MulterFile[]
	): Promise<PlacePayload> {
		try {
			photos = photos ? photos : [];
			for (const aFoto of photos) {
				let extension = aFoto.originalname.split('.');
				extension = '.' + extension[extension.length - 1];
				aFoto.originalName = place.name + extension;
				aFoto.mimetype = 'image/jpg';
			}

			const aPlace: Place = await this.createPlace.create(
				place.name,
				place.description,
				place.note,
				place.schedules,
				photos,
				place.principalCategory,
				place.categories,
				place.url,
				place.phone,
				place.domicile,
				place.location,
				'WEB',
				place.minors,
				place.accessibilities,
				place.services,
				place.organization
			);

			for (const aFoto of aPlace.photos) {
				await this.createPhoto.create(aFoto.photoUrl, aPlace);
			}

			return responseJson(
				200,
				'Espacio creado con exito',
				PlaceRestMapper.toPayload(aPlace)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Delete('/id/:id')
	async delete(@Param('id') id: string): Promise<PlacePayload> {
		try {
			const aPlace: Place = await this.deletePlace.delete(id);
			return aPlace
				? responseJson(
					200,
					'Espacio eliminado con exito',
					PlaceRestMapper.toPayload(aPlace)
				)
				: responseJson(500, 'No existe un espacio con ese id');
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put()
	@UseInterceptors(FilesInterceptor('files'))
	async update(
		@Body() place: UpdatePlaceInput,
		@UploadedFiles() files: MulterFile[]
	): Promise<PlacePayload> {
		try {
			files = files ? files : [];
			for (const aFoto of files) {
				let extension = aFoto.originalname.split('.');
				extension = '.' + extension[extension.length - 1];
				aFoto.originalName = place.name + extension;
				aFoto.mimetype = 'image/jpg';
			}

			const aPlace = await this.
				// Pasarle las categories también
				updatePlace.update(
					place.id,
					place.name,
					place.description,
					place.note,
					JSON.parse(place.schedules),
					JSON.parse(place.photos),
					JSON.parse(place.principalCategory),
					place.url,
					place.phone,
					place.domicile,
					JSON.parse(place.location),
					null,
					null,
					null,
					null,
					files
					// place.minors,
					// place.accessibilities,
					// place.services,
					// place.organization
				);

			return aPlace
				? responseJson(
					200,
					'Espacio actualizado con exito',
					PlaceRestMapper.toPayload(aPlace)
				)
				: responseJson(500, 'El espacio no existe');
		} catch (error) {
			return responseJson(500, error.message);
		}
	}
}
