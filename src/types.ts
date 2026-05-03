export type Role = 'ALUMNO' | 'DOCENTE' | 'TECNICO' | 'ADMIN';

export interface Usuario {
  id: number;
  username: string;
  role: Role;
  fullName: string;
}

export interface Incidencia {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  prioridad: string;
  estado: string;
  ubicacion: string;
  creadorId: number;
  creadorNombre?: string;
  fechaCreacion: string;
  fechaResolucion?: string;
}

export interface Stats {
  total: number;
  pendientes: number;
  resueltas: number;
  tiempoMedio: number;
}
