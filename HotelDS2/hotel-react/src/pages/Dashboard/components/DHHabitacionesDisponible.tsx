import { useEffect, useState } from "react";
import { Col, Spinner, Alert, Button } from "reactstrap";
import { FaBed } from "react-icons/fa";
import { appsettings } from "../../../settings/appsettings";

export function ContadorHabitaciones() {
  const [disponibles, setDisponibles] = useState<number>(0);
  const [porcentaje, setPorcentaje] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  const obtenerTotal = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${appsettings.apiUrl}Dashboard/habitacionesDisponibles`
      );
      if (!response.ok)
        throw new Error("Error al obtener habitaciones disponibles");

      const data = await response.json();
      setDisponibles(data.totalDisponibles);
      setPorcentaje(data.porcentaje);
    } catch (error: any) {
      setError(error.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerTotal();
  }, []);

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: hovered
      ? "0 12px 24px rgba(21, 101, 192, 0.2)"
      : "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "all 0.3s ease-in-out",
    cursor: "pointer",
    gap: "14px",
    minHeight: "100px",
    transform: hovered ? "translateY(-3px)" : "translateY(0)",
  };

  const iconContainer: React.CSSProperties = {
    background: "#E3F2FD",
    padding: "12px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #BBDEFB",
    flexShrink: 0,
  };

  const contentContainer: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  };

  const numberStyle: React.CSSProperties = {
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#1565C0",
    margin: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.9rem",
    color: "#546e7a",
    fontWeight: 500,
    marginTop: "4px",
  };

  const percentageStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    color: "#10b981",
    background: "#d1fae5",
    padding: "2px 8px",
    borderRadius: "16px",
    fontWeight: 500,
    alignSelf: "flex-start",
    marginTop: "8px",
  };

  return (
    <Col xs="12" sm="6" md="4" lg="3">
      <div
        style={cardStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={iconContainer}>
          <FaBed size={20} color="#1565C0" />
        </div>

        {loading && <Spinner size="sm" color="primary" />}
        {error && (
          <Alert color="danger" style={{ borderRadius: "8px", fontSize: "0.85rem" }}>
            {error}{" "}
            <Button size="sm" color="danger" onClick={obtenerTotal}>
              Reintentar
            </Button>
          </Alert>
        )}

        {!loading && !error && (
          <div style={contentContainer}>
            <h1 style={numberStyle}>{disponibles}</h1>
            <div style={labelStyle}>Habitaciones Disponibles</div>
            <div style={percentageStyle}>{porcentaje}% del total</div>
          </div>
        )}
      </div>
    </Col>
  );
}
