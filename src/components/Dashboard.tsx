import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Stats } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [data, setData] = useState<{ categoria: string; count: number }[]>([]);
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Cargamos las estadísticas desde nuestra API de Express
    fetch('/api/stats')
      .then(res => res.json())
      .then(res => {
        setStats(res.stats);
        setData(res.categorias);
      });
  }, []);

  useEffect(() => {
    if (data.length === 0 || !chartRef.current) return;

    // Limpiamos el gráfico anterior
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.categoria))
      .range([0, width])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) || 0])
      .nice()
      .range([height, 0]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("font-family", "Inter")
      .attr("font-size", "10px")
      .attr("fill", "#9ca3af")
      .attr("text-transform", "uppercase");

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .attr("font-family", "Inter")
      .attr("font-size", "10px")
      .attr("fill", "#9ca3af");

    // Colores basados en la paleta del tema
    const colorScale = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.categoria))
      .range(["#002147", "#1e3a8a", "#1d4ed8", "#3b82f6", "#93c5fd"]);

    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.categoria) || 0)
      .attr("y", d => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.count))
      .attr("fill", (d) => colorScale(d.categoria))
      .attr("rx", 2);

    // Título del gráfico
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .attr("font-weight", "600")
      .attr("font-size", "14px")
      .text("Incidencias por Categoría");

  }, [data]);

  if (!stats) return <div className="p-8">Cargando estadísticas...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase">Total Incidencias</p>
          <p className="text-3xl font-bold text-[#002147] mt-2">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase">Pendientes</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pendientes}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase">Resueltas</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.resueltas}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Distribución de Cargas</h3>
        <div className="flex justify-center">
          <svg ref={chartRef}></svg>
        </div>
      </div>
    </div>
  );
}
