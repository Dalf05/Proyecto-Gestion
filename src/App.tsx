import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Usuario } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import IncidenciaList from './components/IncidenciaList';
import IncidenciaForm from './components/IncidenciaForm';
import { UserCircle } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    // Cargamos los usuarios de prueba desde el servidor
    fetch('/api/usuarios')
      .then(res => res.json())
      .then(setUsuarios);
  }, []);

  // Simulación de Login simple para el prototipo
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-[#002147] mb-2">UNIE GESTIÓN</h1>
            <p className="text-gray-500">Selecciona un perfil para acceder al sistema</p>
          </div>
          
          <div className="space-y-3">
            {usuarios.map(u => (
              <button
                key={u.id}
                onClick={() => setCurrentUser(u)}
                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-[#002147] hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#002147] group-hover:bg-[#002147] group-hover:text-white transition-colors">
                    <UserCircle size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">{u.fullName}</p>
                    <p className="text-xs text-gray-500 font-medium">{u.role}</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-[#002147]"></div>
              </button>
            ))}
          </div>
          
          <p className="mt-8 text-center text-xs text-gray-400">
            Prototipo de Sistema de Gestión de Incidencias para UNIE Universidad.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F9FAFB] flex">
        {/* Barra Lateral Navegación */}
        <Sidebar role={currentUser.role} onLogout={() => setCurrentUser(null)} />

        {/* Contenido Principal */}
        <main className="flex-1 ml-64 p-8">
          {/* Cabecera */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 mb-8">
            <h2 className="text-gray-800 font-semibold uppercase tracking-widest text-xs">Sistema de Gestión UNIE</h2>
            <div className="flex items-center space-x-4">
              <span className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold uppercase tracking-wider">Servidor Online</span>
              <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-900 leading-none">{currentUser.fullName}</p>
                  <p className="text-[9px] uppercase tracking-tighter font-extrabold text-blue-600 leading-none mt-1">{currentUser.role}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 text-[#002147] rounded-full flex items-center justify-center text-xs font-black">
                  {currentUser.fullName.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </header>

          {/* Vistas Dinámicas */}
          <div className="px-8 flex-1">
            <Routes>
              <Route 
                path="/" 
                element={currentUser.role === 'ALUMNO' ? <Navigate to="/incidencias" /> : <Dashboard />} 
              />
              <Route 
                path="/incidencias" 
                element={<IncidenciaList role={currentUser.role} userId={currentUser.id} />} 
              />
              <Route 
                path="/nueva" 
                element={<IncidenciaForm role={currentUser.role} userId={currentUser.id} />} 
              />
            </Routes>
          </div>

          {/* Footer Técnico */}
          <footer className="mt-auto bg-white border-t border-gray-200 px-8 py-3 flex justify-between items-center text-[10px] text-gray-400 font-mono">
            <div>django-ver: 4.2.7 | db: sqlite3 | engine: better-sqlite3 | status: running</div>
            <div className="uppercase tracking-widest">&copy; 2026 Universidad UNIE - Proyecto Académico</div>
          </footer>
        </main>
      </div>
    </BrowserRouter>
  );
}
