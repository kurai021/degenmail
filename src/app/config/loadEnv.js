import { config } from 'dotenv';

function loadEnv() {
    const result = config();
    if (result.error) {
        console.error("Error al cargar las variables de entorno:", result.error);
        throw result.error;
    }
}

module.exports = loadEnv;