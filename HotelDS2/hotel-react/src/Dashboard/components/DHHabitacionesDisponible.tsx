import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Spinner, Alert } from "reactstrap";
import { FaBed } from "react-icons/fa";
import { appsettings } from "../../settings/appsettings";

export function ContadorHabitaciones() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerTotal = async () => {
      try {
        const response = await fetch(
          `${appsettings.apiUrl}Dashboard/habitacionesDisponibles`
        );
        if (!response.ok) throw new Error("Error al obtener habitaciones disponibles");
        const data = await response.json();
        setTotal(data.total);
      } catch (error: any) {
        setError(error.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    obtenerTotal();
  }, []);

  return (
    <Col xs="12" sm="6" md="4" lg="2" style={{ padding: "6px", minWidth: "180px", maxWidth: "240px" }}>
      <Card
        style={{
          border: "none",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          background: "#fff",
          transition: "all 0.3s ease-in-out",
          cursor: "pointer",
          overflow: "hidden",
          position: "relative",
          minHeight: "clamp(120px, 16vw, 160px)",
          fontFamily: "Inter, sans-serif",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 12px 24px rgba(33, 150, 243, 0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)",
          }}
        />
        <CardHeader
          style={{
            background: "#fff",
            color: "#1565C0",
            fontWeight: 600,
            fontSize: "0.9rem",
            borderBottom: "1px solid #bbdefb",
            padding: "12px 14px 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)",
                borderRadius: "8px",
                padding: "5px",
                marginRight: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaBed size={13} color="#ffffff" />
            </div>
            Habitaciones Disponibles
          </div>
        </CardHeader>
        <CardBody
          style={{
            background: "#fff",
            color: "#1565C0",
            padding: "12px 10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {loading && <Spinner color="primary" size="sm" />}
          {error && (
            <Alert
              color="danger"
              style={{ borderRadius: "8px", fontSize: "0.85rem", width: "100%" }}
            >
              {error}
            </Alert>
          )}
          {!loading && !error && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                width: "100%",
              }}
            >
              <div
                style={{
                  background: "#f0f7ff",
                  border: "1px solid #bbdefb",
                  borderRadius: "10px",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                }}
              >
                <FaBed size={18} color="#2196F3" />
              </div>
              <div style={{ textAlign: "center" }}>
                <h1
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    margin: 0,
                    color: "#1565C0",
                    letterSpacing: "-1px",
                    lineHeight: "1",
                  }}
                >
                  {total}
                </h1>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#546e7a",
                    fontWeight: 500,
                    marginTop: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Habitaciones
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#78909c",
                    fontWeight: 400,
                    marginTop: "2px",
                  }}
                >
                  Disponibles
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </Col>
  );
}
