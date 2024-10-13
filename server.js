const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
require('dotenv').config();

// Dynamic import for node-fetch
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

const connectToDatabase = async () => {
    try {
        await pool.connect();
        console.log('[DB CONNECTION] Conectado a la base de datos PostgreSQL.');
    } catch (err) {
        console.error('[DB CONNECTION ERROR]', err.stack);
    }
};

const createAnimalsTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS animals (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            age TEXT NOT NULL,
            size TEXT NOT NULL,
            type TEXT NOT NULL,
            imageUrl TEXT NOT NULL,
            description TEXT NOT NULL,
            phoneNumber TEXT NOT NULL,
            latLong TEXT NOT NULL,
            provincia TEXT NOT NULL,
            ciudad TEXT NOT NULL
        )
    `;
    try {
        await pool.query(createTableQuery);
        console.log('[DB TABLE] Tabla de animales verificada o creada.');
    } catch (err) {
        console.error('[DB TABLE ERROR]', err.message);
    }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Función para validar el cuerpo de la solicitud
const validateAnimalData = (data) => {
    const requiredFields = ['age', 'imageUrl', 'name', 'phoneNumber', 'size', 'latLong', 'description', 'species'];
    return requiredFields.every(field => data[field]);
};

// Función para obtener ubicación geográfica
const getGeoLocation = async (lat, lon) => {
    const geoResponse = await fetch(`https://apis.datos.gob.ar/georef/api/ubicacion?lat=${lat}&lon=${lon}&aplanar=true&campos=provincia.nombre,municipio.nombre`);
    if (!geoResponse.ok) throw new Error('Error al obtener la ubicación');
    return await geoResponse.json();
};

// Endpoint para agregar un animal
app.post('/api/animals', async (req, res) => {
    try {
        const animalData = req.body;

        // Validar que se recibieron todos los campos necesarios
        if (!validateAnimalData(animalData)) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Extraer latitud y longitud
        const [lat, lon] = animalData.latLong.split(',').map(coord => parseFloat(coord.trim()));
        
        // Obtener la ubicación geográfica
        const geoData = await getGeoLocation(lat, lon);
        const { provincia_nombre: provincia, municipio_nombre: ciudad } = geoData.ubicacion;

        // Insertar datos en la base de datos
        const query = `
            INSERT INTO animals (name, age, size, type, imageUrl, description, phoneNumber, latLong, provincia, ciudad)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
        `;
        const values = [animalData.name, animalData.age, animalData.size, animalData.species, animalData.imageUrl, animalData.description, animalData.phoneNumber, animalData.latLong, provincia, ciudad];
        
        const result = await pool.query(query, values);
        console.log('[POST ANIMALS] Animal agregado:', result.rows[0]);

        res.status(201).json({ message: 'Animal added successfully', animal: result.rows[0] });
    } catch (error) {
        console.error('Error in /api/animals:', error);
        res.status(500).json({ error: 'Error processing the animal data' });
    }
});

// Endpoint para obtener todos los animales
app.get('/api/animals', async (req, res) => {
    console.log('[GET ANIMALS] Solicitud recibida para obtener todos los animales.');
    try {
        const result = await pool.query('SELECT * FROM animals');
        console.log('[GET ANIMALS] Animales recuperados:', result.rows.length);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('[DB SELECT ERROR]', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Iniciar el servidor
const startServer = async () => {
    await connectToDatabase();
    await createAnimalsTable();
    app.listen(PORT, () => {
        console.log(`[SERVER] Servidor escuchando en http://localhost:${PORT}`);
    });
};

// Ejecutar el servidor
startServer();
