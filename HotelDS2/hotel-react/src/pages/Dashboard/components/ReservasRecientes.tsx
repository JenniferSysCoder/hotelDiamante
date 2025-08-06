import { useEffect, useState } from "react";
import { appsettings } from "../../../settings/appsettings";
import { Spinner, Alert } from "reactstrap";

type Reserva = {
  cliente: string;
  habitacion: string;
  fecha: string;
  estado: string;
};

export function ReservasRecientes() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Dashboard/reservasRecientes`);
        if (!response.ok) throw new Error("Error al obtener reservas");
        const data = await response.json();
        setReservas(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const estadoBadge = (estado: string) => {
    const base = {
      padding: "2px 10px",
      borderRadius: "12px",
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase" as const,
    };

    switch (estado.toLowerCase()) {
      case "completada":
        return {
          ...base,
          backgroundColor: "#dcfce7",
          color: "#15803d",
        };
      case "pendiente":
        return {
          ...base,
          backgroundColor: "#fef3c7",
          color: "#b45309",
        };
      default:
        return {
          ...base,
          backgroundColor: "#e2e8f0",
          color: "#475569",
        };
    }
  };

  const formatoFecha = (fecha: string) =>
    new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(fecha));

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        maxWidth: "600px",
        marginLeft: "10px", // Mover más a la izquierda
        marginRight: "auto",
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center mb-4"
        style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}
      >
        <span>Reservas Recientes</span>
        <a
          href="/reservas"
          className="text-decoration-none"
          style={{ color: "#3b82f6", fontSize: "0.875rem", fontWeight: 500 }}
        >
          Ver todo
        </a>
      </div>

      {loading && <Spinner color="primary" size="sm" />}
      {error && <Alert color="danger">{error}</Alert>}

      {!loading && !error && (
        <div className="table-responsive">
          <table
            className="table table-borderless mb-0"
            style={{
              fontSize: "0.85rem",
              tableLayout: "fixed",
              width: "100%",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", color: "#64748b" }}>
                <th style={{ width: "30%" }}>Cliente</th>
                <th style={{ width: "25%" }}>Habitación</th>
                <th style={{ width: "25%" }}>Fecha</th>
                <th style={{ width: "20%" }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "10px 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.cliente}
                  </td>
                  <td>{r.habitacion}</td>
                  <td>{formatoFecha(r.fecha)}</td>
                  <td>
                    <span style={estadoBadge(r.estado)}>{r.estado}</span>
                  </td>
                </tr>
              ))}
              {reservas.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-3">
                    No hay reservas recientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
