import { useState, useRef } from "react";
import axios from "axios";
import type { IReserva } from "../Reservas/Interfaces/IReserva";
import "./ReporteFacturas.css"; // Reutiliza tu CSS de facturas

const ReporteReservas = () => {
  const [reservas, setReservas] = useState<IReserva[]>([]);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [mensaje, setMensaje] = useState("");
  const reporteRef = useRef<HTMLDivElement>(null);

  const obtenerReservasPorRango = async () => {
    if (!desde || !hasta) {
      setMensaje("Debes seleccionar ambas fechas.");
      setReservas([]);
      return;
    }

    if (desde > hasta) {
      setMensaje("La fecha inicial no puede ser mayor que la final.");
      setReservas([]);
      return;
    }

    try {
      const response = await axios.get("https://localhost:7287/api/Reservas/reporte", {
        params: {
          fechaInicio: desde,
          fechaFin: hasta,
        },
      });

      setReservas(response.data);
      setMensaje("");
    } catch (error: any) {
      if (error.response?.status === 404) {
        setMensaje("No hay reservas en el rango seleccionado.");
      } else {
        setMensaje("Error al consultar el servidor.");
        console.error(error);
      }
      setReservas([]);
    }
  };

  const imprimir = () => {
    const contenido = reporteRef.current?.innerHTML;
    const win = window.open("", "", "width=900,height=700");
    if (win && contenido) {
      win.document.write(`
        <html>
          <head>
            <title>Reporte de Reservas</title>
            <style>
              body { font-family: Arial; padding: 20px; }
              h1, h2 { text-align: center; color: #374151; }
              .logo-container { display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 20px; }
              .logo-imagen { height: 60px; }
              .logo-text-gold { color: #D4AF37; }
              .logo-text-red { color: #8B0000; }
              .reporte-subtitulo { text-align: center; color: #8B0000; font-size: 1.2rem; }
              table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
              thead { background-color: #000; color: white; }
              th, td { padding: 0.75rem; border: 1px solid #E5E7EB; text-align: left; }
              .generated-info { margin-top: 2rem; text-align: center; color: #6B7280; font-size: 0.875rem; }
              .filter-container { display: flex; justify-content: center; gap: 1rem; margin: 1.5rem 0; flex-wrap: wrap; }
              .filter-item label { font-weight: bold; color: #4B5563; margin-bottom: 0.25rem; display: block; }
              .filter-item input { padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.25rem; }
              .filter-button, .print-button {
                padding: 0.75rem 1.5rem;
                border-radius: 0.375rem;
                font-weight: bold;
                border: none;
                cursor: pointer;
              }
              .filter-button { background-color: #8B0000; color: white; }
              .print-button { background-color: #D4AF37; color: black; }
              .print-button:hover, .filter-button:hover { opacity: 0.9; }
              .error-message { color: #DC2626; margin-bottom: 1rem; text-align: center; }
            </style>
          </head>
          <body>${contenido}</body>
        </html>
      `);
      win.document.close();
      win.print();
    }
  };

  return (
    <div className="reporte-container" ref={reporteRef}>
      <div className="logo-container">
        <img src="/logoHotelDiamante.png" alt="Logo Hotel" className="logo-imagen" />
        <div>
          <h1>
            <span className="logo-text-gold">Hotel</span>{" "}
            <span className="logo-text-red">Diamante</span>
          </h1>
          <p className="reporte-subtitulo">Reporte de Reservas</p>
        </div>
      </div>

      <div className="filter-container">
        <div className="filter-item">
          <label>Desde:</label>
          <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </div>
        <div className="filter-item">
          <label>Hasta:</label>
          <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </div>
        <button onClick={obtenerReservasPorRango} className="filter-button">Filtrar</button>
        <button onClick={imprimir} className="print-button">Imprimir / PDF</button>
      </div>

      {mensaje && <div className="error-message">{mensaje}</div>}

      <table>
        <thead>
          <tr>
            <th>N°</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Cliente</th>
            <th>Habitación</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {reservas.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">No hay datos disponibles.</td>
            </tr>
          ) : (
            reservas.map((r) => (
              <tr key={r.idReserva}>
                <td>{String(r.idReserva).padStart(3, "0")}</td>
                <td>{new Date(r.fechaInicio).toLocaleDateString()}</td>
                <td>{new Date(r.fechaFin).toLocaleDateString()}</td>
                <td>{r.nombreCliente || "Desconocido"}</td>
                <td>{r.numeroHabitacion || "No asignada"}</td>
                <td>{r.estado}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {reservas.length > 0 && (
        <div className="generated-info">
          Generado el: {new Date().toLocaleDateString()}
          <br />
          Hotel Diamante - Dirección - Teléfono - Email
        </div>
      )}
    </div>
  );
};

export default ReporteReservas;
