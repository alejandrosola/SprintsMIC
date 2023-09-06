'use strict';
const Minio = require('minio');
require('dotenv').config({ path: '.env.local' }); // Esto carga las variables del .env.local
import { MulterFile } from 'multer'; // Import MulterFile type

const minioEndpoint = process.env.MINIO_ENDPOINT;
const minioPort = parseInt(process.env.MINIO_PORT);
const minioAccessKey = process.env.MINIO_ACCESS_KEY;
const minioSecretKey = process.env.MINIO_SECRET_KEY;

export class MinioService {
	minioClient = new Minio.Client({
		endPoint: minioEndpoint,
		port: minioPort,
		useSSL: false, // Cambia a true si estás usando SSL
		accessKey: minioAccessKey,
		secretKey: minioSecretKey,
	});

	// Verificar si el bucket ya existe antes de crearlo
	async verifyBucket(bucketName: string, file: MulterFile) {
		let exists = await this.minioClient.bucketExists(bucketName);
		// if (err) {
		//     console.error('Error al verificar si el bucket existe:', err);
		//     return;
		// }

		if (!exists) {
			// Crear el bucket si no existe
			await this.minioClient.makeBucket(bucketName, 'us-east-1');
			await this.uploadFile(bucketName, file);
		} else {
			await this.uploadFile(bucketName, file);
		}
	}

	// Función para cargar el archivo
	async uploadFile(bucketName: string, file: MulterFile) {
		const metaData = {
			'Content-Type': file.mimetype, // Tipo MIME de la imagen
			'X-Amz-Meta-Testing': 1234,
			example: 5678,
		};

		await this.minioClient.putObject(
			bucketName,
			file.originalname,
			file.buffer,
			metaData
		);
	}

	async createUR(bucketName: string, filename: string) {
		try {
			const url = await this.minioClient.presignedGetObject(
				bucketName,
				filename
			);
			return url;
		} catch (error) { }
	}

	// Función para vaciar un bucket (eliminar todos los objetos en el bucket)
	async emptyBucket(bucketName: string) {
		try {
			const objectsList = await this.listAllObjects(bucketName);

			for (const obj of objectsList) {
				await this.minioClient.removeObject(bucketName, obj.name);
				console.log(`Archivo ${obj.name} eliminado.`);
			}

			console.log(`Bucket ${bucketName} vaciado.`);
		} catch (error) {
			console.error(`Error al vaciar el bucket ${bucketName}:`, error);
		}
	}

	async removeFile(bucketName: string, fileName: string) {
		await this.minioClient.removeObject(bucketName, fileName);
	}

	// Función auxiliar para listar todos los objetos en el bucket
	async listAllObjects(bucketName: string): Promise<any[]> {
		return new Promise<any[]>((resolve, reject) => {
			const objectsList: any[] = [];

			this.minioClient
				.listObjects(bucketName, '', true)
				.on('data', (obj) => {
					objectsList.push(obj);
				})
				.on('error', (err) => {
					reject(err);
				})
				.on('end', () => {
					resolve(objectsList);
				});
		});
	}
}
