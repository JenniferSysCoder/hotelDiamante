import { useState, useRef } from "react";
import axios from "axios";
import type { IFactura } from "../Facturas/Interfaces/IFactura";
import "./ReporteFacturas.css";

const ReporteFacturas = () => {
  const [facturas, setFacturas] = useState<IFactura[]>([]);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [mensaje, setMensaje] = useState("");
  const reporteRef = useRef<HTMLDivElement>(null);

  const obtenerFacturasPorRango = async () => {
    if (!desde || !hasta) {
      setMensaje("Debes seleccionar ambas fechas.");
      setFacturas([]);
      return;
    }

    if (desde > hasta) {
      setMensaje("La fecha inicial no puede ser mayor que la final.");
      setFacturas([]);
      return;
    }

    try {
      const response = await axios.get(
        "https://localhost:7287/api/Facturas/reporte",
        {
          params: {
            fechaInicio: desde,
            fechaFin: hasta,
          },
        }
      );

      setFacturas(response.data);
      setMensaje("");
    } catch (error: any) {
      if (error.response?.status === 404) {
        setMensaje("No hay facturas en el rango seleccionado.");
      } else {
        setMensaje("Error al consultar el servidor.");
        console.error(error);
      }
      setFacturas([]);
    }
  };

  const calcularTotal = (): string => {
    const total = facturas.reduce((acc, curr) => acc + curr.total, 0);
    return total.toFixed(2);
  };

  const imprimir = () => {
    const contenido = reporteRef.current?.innerHTML;
    const win = window.open("", "", "width=900,height=700");
    if (win && contenido) {
      win.document.write(`
        <html>
          <head>
            <title>Reporte de Facturas</title>
            <style>
              body { font-family: Arial; padding: 20px; }
              h1, h2 { text-align: center; color: #374151; }
              .logo-container { display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 20px; }
              .logo-imagen { height: 60px; }
              .logo-text-gold { color: #D4AF37; }
              .logo-text-red { color: #8B0000; }
              .report-title { font-size: 1.5rem; color: #8B0000; margin-bottom: 1rem; }
              .filter-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-bottom: 1.5rem; }
              .filter-item { display: flex; flex-direction: column; }
              .filter-item label { font-weight: bold; color: #4B5563; margin-bottom: 0.25rem; }
              .filter-item input { border: 1px solid #D1D5DB; padding: 0.5rem; border-radius: 0.25rem; }
              .filter-buttons { display: flex; gap: 0.5rem; align-items: flex-end; }
              .filter-button { background-color: #8B0000; color: white; padding: 0.75rem 1.5rem; border-radius: 0.375rem; cursor: pointer; transition: background-color 0.3s ease-in-out; border: none; font-weight: bold; }
              .filter-button:hover { background-color: #A93226; }
              .print-button { background-color: #D4AF37; color: black; padding: 0.75rem 1.5rem; border-radius: 0.375rem; cursor: pointer; transition: opacity 0.3s ease-in-out; border: 1px solid #D4AF37; font-weight: bold; }
              .print-button:hover { opacity: 0.9; }
              .error-message { color: #DC2626; font-medium; margin-bottom: 1rem; }
              table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
              thead { background-color: #000; color: white; }
              th, td { padding: 0.75rem; border: 1px solid #E5E7EB; text-align: left; }
              .total-container { margin-top: 1.5rem; text-align: right; }
              .total-label { font-weight: bold; color: #4B5563; margin-right: 0.5rem; }
              .total-value { font-size: 1.25rem; font-weight: bold; color: #8B0000; }
              .generated-info { margin-top: 2rem; text-align: center; color: #6B7280; font-size: 0.875rem; }
              .total-general-box { background-color: #8B0000; color: #D4AF37; font-size: 1.25rem; padding: 0.75rem; border-radius: 0.375rem; font-weight: bold; text-align: right; margin-top: 1rem; }
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
        <img
          src="/logoHotelDiamante.png"
          alt="Logo Hotel"
          className="logo-imagen"
        />
        <div>
          <h1 className="hotel-titulo">
            <span className="logo-text-gold">Hotel</span>{" "}
            <span className="logo-text-red">Diamante</span>
          </h1>
          <p className="reporte-subtitulo">Reporte de Facturas</p>
        </div>
      </div>

      <div className="separador"></div>

      <div className="filter-container">
        <div className="filter-item">
          <label>Desde:</label>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label>Hasta:</label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button onClick={obtenerFacturasPorRango} className="filter-button">
            Filtrar
          </button>
          <button onClick={imprimir} className="print-button">
            Imprimir / PDF
          </button>
        </div>
      </div>

      {mensaje && <div className="error-message">{mensaje}</div>}

      <h2 className="report-title">Detalle de Facturas</h2>
      <table className="facturas-table">
        <thead className="table-header">
          <tr>
            <th>N°</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Servicio</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {facturas.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                No hay datos para mostrar.
              </td>
            </tr>
          ) : (
            facturas.map((f) => (
              <tr key={f.idFactura} className="table-row">
                <td>{String(f.idFactura).padStart(3, "0")}</td>
                <td>{new Date(f.fechaEmision).toLocaleDateString()}</td>
                <td>{f.nombreCliente}</td>
                <td>{f.nombreServicio}</td>
                <td className="text-right total-amount">
                  ${f.total.toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {facturas.length > 0 && (
        <div className="total-general-box">
          Total General: ${calcularTotal()}
        </div>
      )}

      {facturas.length > 0 && (
        <div className="generated-info">
          Generado el: {new Date().toLocaleDateString()}
          <br />
          Hotel Diamante - Dirección del Hotel - Teléfono - Email
        </div>
      )}
    </div>
  );
};

export default ReporteFacturas;
