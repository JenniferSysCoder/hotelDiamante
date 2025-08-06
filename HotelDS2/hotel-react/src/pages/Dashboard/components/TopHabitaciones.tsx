import { useEffect, useState } from "react";
import { appsettings } from "../../../settings/appsettings";
import { Spinner, Alert } from "reactstrap";

interface HabitacionPopular {
  nombreTipoHabitacion: string;
  cantidadReservas: number;
}

export function TopHabitaciones() {
  const [habitaciones, setHabitaciones] = useState<HabitacionPopular[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await fetch(`${appsettings.apiUrl}Dashboard/habitacionesPopulares`);
        if (!res.ok) throw new Error("Error al obtener habitaciones populares");
        const data = await res.json();
        setHabitaciones(data);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchTop();
  }, []);

  const colors = ["#3b82f6", "#3b82f6", "#3b82f6", "#3b82f6", "#3b82f6"];

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <h5 style={{ fontWeight: 600, marginBottom: "1rem", color: "#1e293b" }}>Habitaciones más utilizadas</h5>

      {loading && <Spinner color="primary" size="sm" />}
      {error && <Alert color="danger">{error}</Alert>}

      {!loading && !error && (
        <ul className="list-unstyled mb-0">
          {habitaciones.map((habitacion, index) => (
            <li
              key={index}
              className="d-flex justify-content-between align-items-center py-2"
              style={{ borderBottom: index !== habitaciones.length - 1 ? "1px solid #f1f5f9" : "none" }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{
                    backgroundColor: colors[index],
                    color: "white",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  {index + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#1e293b" }}>
                    {habitacion.nombreTipoHabitacion}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    {habitacion.cantidadReservas} reservas
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#10b981" }}>
                +{habitacion.cantidadReservas}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
