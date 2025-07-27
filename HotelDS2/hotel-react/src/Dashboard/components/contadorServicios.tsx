import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Spinner, Alert } from "reactstrap";
import { FaConciergeBell } from "react-icons/fa"; 
import { appsettings } from "../../settings/appsettings";

export function ContadorServicios() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerTotal = async () => {
      try {
        const response = await fetch(
          `${appsettings.apiUrl}Dashboard/totalServicios`
        );
        if (!response.ok) throw new Error("Error al obtener total de servicios");
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
    <Col xs="12" md="4">
      <Card style={{
        border: "none",
        boxShadow: "0 2px 12px #23272f14",
        background: "#23272f"
      }}>
        <CardHeader style={{
          background: "transparent",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1.1rem",
          letterSpacing: "1px",
          borderBottom: "none"
        }}>
          <FaConciergeBell size={28} style={{ marginRight: 8, verticalAlign: "middle" }} />
          Servicios Ofrecidos
        </CardHeader>
        <CardBody style={{
          background: "transparent",
          color: "#fff",
          padding: "32px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {loading && <Spinner color="light" />}
          {error && <Alert color="danger">{error}</Alert>}
          {!loading && !error && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px"
            }}>
              <div style={{
                background: "#fff",
                borderRadius: "50%",
                boxShadow: "0 2px 8px #23272f22",
                padding: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <FaConciergeBell size={40} color="#23272f" />
              </div>
              <h3 style={{
                fontSize: "2.8rem",
                fontWeight: "bold",
                margin: 0,
                color: "#00b894",
                letterSpacing: "2px",
                textShadow: "0 2px 8px #23272f22"
              }}>
                {total}
              </h3>
              <span style={{
                fontSize: "1rem",
                color: "#fff",
                opacity: 0.8,
                fontWeight: 500,
                marginTop: "4px"
              }}>
                Servicios disponibles
              </span>
            </div>
          )}
        </CardBody>
      </Card>
    </Col>
  );
}