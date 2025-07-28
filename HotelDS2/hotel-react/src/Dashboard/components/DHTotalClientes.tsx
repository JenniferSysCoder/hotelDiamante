import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Spinner, Alert } from "reactstrap";
import { appsettings } from "../../settings/appsettings";
import { FaUserFriends } from "react-icons/fa";

export function ContadorClientes() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerTotal = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Dashboard/totalClientes`);
        if (!response.ok) throw new Error("Error al obtener total de clientes");
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
    <Col xs="12" md="3" lg="2" style={{ minWidth: "200px", maxWidth: "220px", padding: "6px" }}>
      <Card
        style={{
          border: "none",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          background: "#fff",
          cursor: "pointer",
          overflow: "hidden",
          position: "relative",
          minHeight: "140px",
          maxWidth: "220px",
          fontFamily: "Inter, sans-serif",
          transition: "all 0.2s",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(76,175,80,0.18)";
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
            background: "linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%)",
          }}
        />
        <CardHeader
          style={{
            background: "#fff",
            color: "#2E7D32",
            fontWeight: 600,
            fontSize: "0.9rem",
            borderBottom: "1px solid #bbdefb",
            padding: "12px 14px 10px",
            display: "flex",
            alignItems: "center",
            fontFamily: "Inter, sans-serif",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginTop: "4px" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)",
                borderRadius: "8px",
                padding: "5px",
                marginRight: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaUserFriends size={14} color="#fff" />
            </div>
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2, gap: "2px" }}>
              <span style={{ marginBottom: "2px" }}>Total de</span>
              <span>Clientes</span>
            </span>
          </div>
        </CardHeader>
        <CardBody
          style={{
            background: "#fff",
            color: "#2E7D32",
            padding: "12px 10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {loading && <Spinner color="success" size="sm" />}
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
                  background: "#f1f8e9",
                  border: "1px solid #c8e6c9",
                  borderRadius: "10px",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                }}
              >
                <FaUserFriends size={18} color="#4CAF50" />
              </div>
              <div style={{ textAlign: "center" }}>
                <h1
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    margin: 0,
                    color: "#2E7D32",
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
                  Clientes
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#78909c",
                    fontWeight: 400,
                    marginTop: "2px",
                  }}
                >
                  Registrados
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </Col>
  );
}
