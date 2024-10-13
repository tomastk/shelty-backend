
# Shelty API

Esta es una API para gestionar información de animales, que incluye datos como el nombre, edad, tamaño, tipo, descripción, y más. La API permite agregar nuevos animales y consultar la lista completa de animales almacenados en una base de datos PostgreSQL.

## Características

- **Agregar animales:** Permite agregar información de un nuevo animal, incluyendo nombre, edad, tamaño, tipo, descripción, y ubicación.
- **Consultar animales:** Permite recuperar la lista completa de animales almacenados en la base de datos.

## Tecnologías Utilizadas

- Node.js
- Express.js
- PostgreSQL
- body-parser
- cors
- morgan
- dotenv

## Requisitos

- Node.js (v14 o superior)
- PostgreSQL

## Instalación

1. Clona este repositorio:
    ```bash
    git clone https://github.com/tomastk/shelty-backend
    cd shelty-backend
    ```

2. Instala las dependencias:
    ```bash
    npm install
    ```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
    ```
    PORT=3000
    POSTGRES_URL=tu_postgres_url
    ```

4. Inicia el servidor:
    ```bash
    npm start
    ```

## Endpoints

### 1. Agregar un animal

- **URL:** `/api/animals`
- **Método:** `POST`
- **Descripción:** Agrega un nuevo animal a la base de datos.

#### Parámetros en el cuerpo de la solicitud:
```json
{
    "name": "Nombre del animal",
    "age": "Edad del animal",
    "size": "Tamaño del animal",
    "species": "Tipo de animal",
    "imageUrl": "URL de la imagen del animal",
    "description": "Descripción del animal",
    "phoneNumber": "Número de contacto",
    "latLong": "Latitud y longitud separadas por coma"
}
```

#### Respuesta:
- **Código:** 201 Created
- **Contenido:** 
```json
{
    "message": "Animal added successfully",
    "animal": {
        "id": 1,
        "name": "Nombre del animal",
        "age": "Edad",
        "size": "Tamaño",
        "type": "Especie",
        "imageUrl": "URL",
        "description": "Descripción",
        "phoneNumber": "Número de contacto",
        "latLong": "Latitud,Longitud",
        "provincia": "Provincia",
        "ciudad": "Ciudad"
    }
}
```

### 2. Obtener todos los animales

- **URL:** `/api/animals`
- **Método:** `GET`
- **Descripción:** Recupera todos los animales almacenados en la base de datos.

#### Respuesta:
- **Código:** 200 OK
- **Contenido:** 
```json
[
    {
        "id": 1,
        "name": "Nombre del animal",
        "age": "Edad",
        "size": "Tamaño",
        "type": "Especie",
        "imageUrl": "URL",
        "description": "Descripción",
        "phoneNumber": "Número de contacto",
        "latLong": "Latitud,Longitud",
        "provincia": "Provincia",
        "ciudad": "Ciudad"
    },
    ...
]
```

## Notas

- La API utiliza la base de datos PostgreSQL para almacenar los datos.
- Se integra con una API externa para obtener la ubicación geográfica (ciudad y provincia) a partir de latitud y longitud.

## Contribución

1. Haz un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadida nueva característica'`).
4. Sube la rama (`git push origin feature/nueva-caracteristica`).
5. Crea un Pull Request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.

---

*"La grandeza de una nación y su progreso moral pueden ser juzgados por la forma en que tratan a sus animales."* - Mahatma Gandhi