import { useEffect, useState } from 'react';
import { Incidencia, Role } from '../types';
import { Clock, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';

interface IncidenciaListProps {
  role: Role;
  userId: number;
}

export default function IncidenciaList({ role, userId }: IncidenciaListProps) {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);

  const fetchIncidencias = () => {
    fetch(`/api/incidencias?role=${role}&userId=${userId}`)
      .then(res => res.json())
      .then(setIncidencias);
  };

  useEffect(() => {
    fetchIncidencias();
  }, [role, userId]);

  const cambiarEstado = (id: number, nuevoEstado: string) => {
    fetch(`/api/incidencias/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    }).then(fetchIncidencias);
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Urgente': return 'bg-red-100 text-red-700 border-red-200';
      case 'Alta': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Media': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Resuelto': return <CheckCircle2 className="text-green-500" size={18} />;
      case 'En Progreso': return <Clock className="text-blue-500" size={18} />;
      default: return <AlertCircle className="text-orange-500" size={18} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Listado de Registros</h2>
        <span className="text-[10px] text-gray-400 font-mono italic">sql::select * from incidencias where access_granted = true</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <th className="px-6 py-4 font-bold">Asunto y Descripción</th>
              <th className="px-6 py-4 font-bold text-center">Estado</th>
              <th className="px-6 py-4 font-bold text-center">Prioridad</th>
              <th className="px-6 py-4 font-bold text-right text-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {incidencias.map((inc) => (
              <tr key={inc.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-5 max-w-md">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-800 leading-tight">{inc.titulo}</p>
                    <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-mono">#{inc.id}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{inc.descripcion}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                      <MapPin size={10} /> {inc.ubicacion}
                    </span>
                    <span className="text-[10px] text-gray-300">•</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-tighter italic">por: {inc.creadorNombre}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-gray-200">
                    {inc.estado}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    inc.prioridad === 'Urgente' ? 'text-red-600' : 
                    inc.prioridad === 'Alta' ? 'text-orange-500' : 'text-blue-500'
                  }`}>
                    {inc.prioridad}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  {(role === 'TECNICO' || role === 'ADMIN') && inc.estado !== 'Resuelto' && (
                    <div className="flex justify-end gap-1">
                      {inc.estado === 'Abierto' && (
                        <button 
                          onClick={() => cambiarEstado(inc.id, 'En Progreso')}
                          className="p-1.5 hover:bg-blue-50 text-blue-500 rounded transition-colors"
                          title="Iniciar"
                        >
                          <Clock size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => cambiarEstado(inc.id, 'Resuelto')}
                        className="p-1.5 hover:bg-green-50 text-green-500 rounded transition-colors"
                        title="Resolver"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    </div>
                  )}
                  {inc.estado === 'Resuelto' && <CheckCircle2 size={16} className="text-green-500 ml-auto opacity-30" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {incidencias.length === 0 && (
          <div className="text-center py-20 bg-white">
            <p className="text-xs text-gray-400 font-mono">/ (empty set) / - No se han encontrado registros.</p>
          </div>
        )}
      </div>
    </div>
  );
}
