const Minio = require('minio')
require('dotenv').config({ path: '.env.local' }); // Esto carga las variables del .env.local

const minioEndpoint = process.env.MINIO_ENDPOINT;
const minioPort = parseInt(process.env.MINIO_PORT, 10);
const minioAccessKey = process.env.MINIO_ACCESS_KEY;
const minioSecretKey = process.env.MINIO_SECRET_KEY;

const minioClient = new Minio.Client({
    endPoint: minioEndpoint,
    port: minioPort,
    useSSL: false, // Cambia a true si estás usando SSL
    accessKey: minioAccessKey,
    secretKey: minioSecretKey,
});

// Ruta del archivo de imagen que deseas cargar
const filePath = '../DB.config.jpeg';

// Nombre que deseas asignar al archivo en MinIO
const objectName = 'test@test.com.jpeg';

// Nombre del bucket en MinIO
const bucketName = 'avatar';

// Verificar si el bucket ya existe antes de crearlo
minioClient.bucketExists(bucketName, (err, exists) => {
    if (err) {
        console.error('Error al verificar si el bucket existe:', err);
        return;
    }

    if (!exists) {
        // Crear el bucket si no existe
        minioClient.makeBucket(bucketName, 'us-east-1', function (err) {
            if (err) return console.log(err);

            console.log('Bucket creado exitosamente en "us-east-1".');
            uploadFile();
        });
    } else {
        console.log('El bucket ya existe.');
        uploadFile();
    }
});

// Función para cargar el archivo
function uploadFile() {
    const metaData = {
        'Content-Type': 'image/jpeg', // Tipo MIME de la imagen
        'X-Amz-Meta-Testing': 1234,
        'example': 5678
    };

    minioClient.fPutObject(bucketName, objectName, filePath, metaData, function (err, etag) {
        if (err) return console.log(err);
        console.log('Archivo cargado exitosamente.');
    });
}