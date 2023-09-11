import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Configurar las opciones CORS para permitir solicitudes desde http://localhost:3001
	const corsOptions: CorsOptions = {
		origin: [process.env.FRONT_URL, process.env.BACKOFFICE_FRONT_URL],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders: 'Content-Type,Authorization',
		exposedHeaders: 'Access-Control-Allow-Origin',
		credentials: true,
	};
	app.enableCors(corsOptions);

	await app.listen(process.env.PORT);
}
bootstrap();
