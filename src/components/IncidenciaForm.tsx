import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Role } from '../types';
import { Send } from 'lucide-react';

interface IncidenciaFormProps {
  userId: number;
  role: Role;
}

export default function IncidenciaForm({ userId, role }: IncidenciaFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    ubicacion: ''
  });

  // Categorías permitidas según el perfil
  const todasCategorias = ['TI', 'Infraestructura', 'Mobiliario', 'Limpieza', 'Matrícula'];
  const categoriasPermitidas = todasCategorias.filter(cat => {
    if (role === 'ALUMNO') return ['Limpieza', 'Mobiliario', 'Matrícula'].includes(cat);
    if (role === 'DOCENTE') return ['TI', 'Mobiliario', 'Infraestructura'].includes(cat);
    return true; // ADMIN y TECNICO ven todas
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/incidencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, creadorId: userId })
      });

      if (res.ok) {
        navigate('/incidencias');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reportar Nueva Incidencia</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Título del fallo</label>
            <input
              required
              type="text"
              placeholder="Ej: Bombilla fundida en Aula 203"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              value={formData.titulo}
              onChange={e => setFormData({ ...formData, titulo: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Categoría</label>
              <select
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
                value={formData.categoria}
                onChange={e => setFormData({ ...formData, categoria: e.target.value })}
              >
                <option value="">Seleccionar...</option>
                {categoriasPermitidas.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Ubicación</label>
              <input
                required
                type="text"
                placeholder="Ej: Biblioteca, 2ª planta"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
                value={formData.ubicacion}
                onChange={e => setFormData({ ...formData, ubicacion: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Descripción detallada</label>
            <textarea
              required
              rows={4}
              placeholder="Describe el problema con claridad..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none resize-none"
              value={formData.descripcion}
              onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
            ></textarea>
          </div>

          <div className="pt-4">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#002147] text-white py-4 rounded-lg font-bold hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {loading ? 'Enviando...' : 'Registrar Incidencia'}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              La prioridad se asignará automáticamente mediante nuestro algoritmo de urgencia.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
