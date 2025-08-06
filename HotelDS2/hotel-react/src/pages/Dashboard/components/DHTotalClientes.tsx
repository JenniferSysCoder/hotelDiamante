import { useEffect, useState } from "react";
import { Col, Spinner, Alert } from "reactstrap";
import { FaUserFriends } from "react-icons/fa";
import { appsettings } from "../../../settings/appsettings";

export function ContadorClientes() {
  const [totalActivos, setTotalActivos] = useState<number>(0);
  const [porcentaje, setPorcentaje] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const obtenerTotal = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Dashboard/totalClientes`);
        if (!response.ok) throw new Error("Error al obtener total de clientes");
        const data = await response.json();
        setTotalActivos(data.totalActivos);
        setPorcentaje(data.porcentaje);
      } catch (error: any) {
        setError(error.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    obtenerTotal();
  }, []);

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: "12px",
    padding: "16px 20px",
    boxShadow: hovered
      ? "0 12px 24px rgba(0,0,0,0.08)"
      : "0 4px 12px rgba(0, 0, 0, 0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "all 0.3s ease-in-out",
    cursor: "pointer",
    minHeight: "100px",
    width: "100%",
    gap: "14px",
    transform: hovered ? "translateY(-3px)" : "translateY(0)",
  };

  const iconContainer: React.CSSProperties = {
    background: "#e0f7fa",
    padding: "12px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #b2ebf2",
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
    color: "#00796b",
    margin: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.9rem",
    color: "#475569",
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
          <FaUserFriends size={20} color="#00796b" />
        </div>

        {loading && <Spinner size="sm" color="success" />}
        {error && <Alert color="danger">{error}</Alert>}

        {!loading && !error && (
          <div style={contentContainer}>
            <h1 style={numberStyle}>{totalActivos}</h1>
            <div style={labelStyle}>Clientes Activos</div>
            <div style={percentageStyle}>{porcentaje}% del total</div>
          </div>
        )}
      </div>
    </Col>
  );
}
