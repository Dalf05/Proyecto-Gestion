import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURACIÓN DE LA BASE DE DATOS ---
// Usamos SQLite como pidió el usuario, en un archivo local.
const db = new Database('db.sqlite3');

// Inicializamos las tablas si no existen
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    role TEXT, -- ALUMNO, DOCENTE, TECNICO, ADMIN
    fullName TEXT
  );

  CREATE TABLE IF NOT EXISTS incidencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    descripcion TEXT,
    categoria TEXT, -- TI, Infraestructura, Mobiliario, Limpieza, Matrícula
    prioridad TEXT, -- Baja, Media, Alta, Urgente
    estado TEXT, -- Abierto, En Progreso, Resuelto, Cerrado
    ubicacion TEXT,
    creadorId INTEGER,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaResolucion DATETIME,
    FOREIGN KEY (creadorId) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS comentarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    incidenciaId INTEGER,
    autorId INTEGER,
    texto TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incidenciaId) REFERENCES incidencias(id),
    FOREIGN KEY (autorId) REFERENCES usuarios(id)
  );
`);

// Insertamos usuarios de prueba si la tabla está vacía
const rowCount = db.prepare('SELECT count(*) as count FROM usuarios').get() as { count: number };
if (rowCount.count === 0) {
  const insertUser = db.prepare('INSERT INTO usuarios (username, role, fullName) VALUES (?, ?, ?)');
  insertUser.run('admin', 'ADMIN', 'Administrador UNIE');
  insertUser.run('tecnico', 'TECNICO', 'Técnico de Mantenimiento');
  insertUser.run('docente', 'DOCENTE', 'Prof. Juan Pérez');
  insertUser.run('alumno', 'ALUMNO', 'Carlos Estudiante');
}

// --- LÓGICA DE NEGOCIO ---

// Función para analizar la urgencia automáticamente según palabras clave
function analizarUrgencia(titulo: string, descripcion: string): string {
  const texto = (titulo + ' ' + descripcion).toLowerCase();
  if (texto.includes('fuego') || texto.includes('peligro') || texto.includes('emergencia') || texto.includes('inundación')) {
    return 'Urgente';
  }
  if (texto.includes('roto') || texto.includes('examen') || texto.includes('clase') || texto.includes('urgente')) {
    return 'Alta';
  }
  if (texto.includes('lento') || texto.includes('sucio') || texto.includes('bombilla')) {
    return 'Media';
  }
  return 'Baja';
}

// --- SERVIDOR EXPRESS ---
const app = express();
app.use(express.json());

// API: Usuarios
app.get('/api/usuarios', (req, res) => {
  const usuarios = db.prepare('SELECT * FROM usuarios').all();
  res.json(usuarios);
});

// API: Incidencias
app.get('/api/incidencias', (req, res) => {
  const { role, userId } = req.query;
  let query = 'SELECT i.*, u.fullName as creadorNombre FROM incidencias i JOIN usuarios u ON i.creadorId = u.id';
  const params: any[] = [];

  // Filtrado por permisos según el enunciado
  if (role === 'ALUMNO') {
    // Alumnos solo ven Limpieza, Mobiliario, Matrícula
    query += ' WHERE i.categoria IN ("Limpieza", "Mobiliario", "Matrícula")';
  } else if (role === 'DOCENTE') {
    // Docentes ven TI, Mobiliario, Infraestructura
    query += ' WHERE i.categoria IN ("TI", "Mobiliario", "Infraestructura")';
  }
  // ADMIN y TECNICO ven todo.

  const incidencias = db.prepare(query).all(...params);
  res.json(incidencias);
});

app.post('/api/incidencias', (req, res) => {
  const { titulo, descripcion, categoria, ubicacion, creadorId } = req.body;
  const prioridad = analizarUrgencia(titulo, descripcion);
  const estado = 'Abierto';

  const insert = db.prepare(`
    INSERT INTO incidencias (titulo, descripcion, categoria, prioridad, estado, ubicacion, creadorId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const info = insert.run(titulo, descripcion, categoria, prioridad, estado, ubicacion, creadorId);
  res.json({ id: info.lastInsertRowid, prioridad });
});

app.patch('/api/incidencias/:id', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  
  let query = 'UPDATE incidencias SET estado = ?';
  const params: any[] = [estado];

  if (estado === 'Resuelto' || estado === 'Cerrado') {
    query += ', fechaResolucion = CURRENT_TIMESTAMP';
  }

  query += ' WHERE id = ?';
  params.push(id);

  db.prepare(query).run(...params);
  res.sendStatus(200);
});

// API: Estadísticas para el Dashboard
app.get('/api/stats', (req, res) => {
  const stats = {
    total: (db.prepare('SELECT count(*) as count FROM incidencias').get() as any).count,
    pendientes: (db.prepare('SELECT count(*) as count FROM incidencias WHERE estado != "Resuelto" AND estado != "Cerrado"').get() as any).count,
    resueltas: (db.prepare('SELECT count(*) as count FROM incidencias WHERE estado = "Resuelto" OR estado = "Cerrado"').get() as any).count,
    tiempoMedio: 0 // Mock por ahora o cálculo real si hay datos
  };

  // Por categoría para D3
  const categorias = db.prepare('SELECT categoria, count(*) as count FROM incidencias GROUP BY categoria').all();
  
  res.json({ stats, categorias });
});

// Integración con Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor UNIE corriendo en http://localhost:${PORT}`);
  });
}

startServer();
