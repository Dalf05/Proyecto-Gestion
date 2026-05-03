import { LayoutDashboard, ClipboardList, PlusCircle, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Role } from '../types';

interface SidebarProps {
  role: Role;
  onLogout: () => void;
}

export default function Sidebar({ role, onLogout }: SidebarProps) {
  // El alumno NO debe ver el enlace a "Panel de Control" (Dashboard)
  const canSeeDashboard = role !== 'ALUMNO';

  return (
    <div className="w-64 bg-[#002147] text-white h-screen flex flex-col fixed left-0 top-0 shadow-2xl">
      <div className="p-8 border-b border-blue-900/50">
        <h2 className="text-lg font-black tracking-widest">UNIE GESTIÓN</h2>
        <p className="text-[9px] text-blue-400 mt-1 uppercase font-bold tracking-tighter">Panel de Soporte Académico</p>
      </div>
      
      <nav className="flex-1 mt-8 px-4 space-y-1">
        {canSeeDashboard && (
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
                isActive ? 'bg-blue-800 text-white shadow-lg' : 'text-blue-300/70 hover:bg-blue-800/40 hover:text-white'
              }`
            }
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>
        )}
        
        <NavLink
          to="/incidencias"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
              isActive ? 'bg-blue-800 text-white shadow-lg' : 'text-blue-300/70 hover:bg-blue-800/40 hover:text-white'
            }`
          }
        >
          <ClipboardList size={16} />
          <span>Incidencias</span>
        </NavLink>

        <NavLink
          to="/nueva"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
              isActive ? 'bg-blue-800 text-white shadow-lg' : 'text-blue-300/70 hover:bg-blue-800/40 hover:text-white'
            }`
          }
        >
          <PlusCircle size={16} />
          <span>Reportar</span>
        </NavLink>
      </nav>

      <div className="p-6 border-t border-blue-900/50">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-xs text-blue-400/60 hover:text-red-400 transition-colors uppercase font-bold tracking-widest"
        >
          <LogOut size={16} />
          <span>Salir</span>
        </button>
      </div>
    </div>
  );
}
