import express from "express";
import mysql from "mysql";

//Express devuelve un objeto que da acceso a las funciones de la libreria express.js
const app = express();
const port = 3000;

//Middleware que admite solicitudes en formato json
app.use(express.json());

//Configuración de la base de datos
const db_config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'phpmyadmin'
}

//Conexión con MySQL para crear tablas y usar funciones
const db = mysql.createConnection(db_config);
    
//Mostrar mensaje de coneción exitosa o error en la conexión
db.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

//Creación de la tabla
function createTableIfNotExists() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS videojuegos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    genero VARCHAR(255) NOT NULL,
    plataforma VARCHAR(255) NOT NULL
    )
    `;
    
    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('Error al crear la tabla de videojuegos:', err);
        } else {
            console.log('Tabla de videojuegos creada correctamente');
        }
    });
}
    
createTableIfNotExists();

//Insertar videojuegos (post)
app.post('/videojuegos', (req, res) => {
    const { nombre, genero, plataforma } = req.body;
    const query = 'INSERT INTO videojuegos (nombre, genero, plataforma) VALUES (?, ?, ?)';
    
    db.query(query, [nombre, genero, plataforma], (err, result) => {
        if (err) {
            console.error('Error al crear un nuevo videojuego:', err);
            res.status(500).json({ error: 'Error al crear un nuevo videojuego' });
        } else {
            res.json({ id: result.insertId, nombre, genero, plataforma });
        }
    });
});

//Obtener videojuegos (get)
app.get('/videojuegos', (req, res) => {
    db.query('SELECT * FROM videojuegos', (err, results) => {
        if (err) {
            console.error('Error al obtener videojuegos:', err);
            res.status(500).json({ error: 'Error al obtener videojuegos' });
        } else {
            res.json(results);
        }
    });
});

//Eliminar videojuegos (delete)
app.delete('/videojuegos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM videojuegos WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el videojuego:', err);
            res.status(500).json({ error: 'Error al eliminar el videojuego' });
        } else {
            if (result.affectedRows > 0) {
                res.json({ message: 'Videojuego eliminado correctamente' });
            } else {
                res.status(404).json({ error: 'Videojuego no encontrado' });
            }
        }
    });
});    

app.listen(port, () => {
    console.log(`Todo ok en localhost`);
})