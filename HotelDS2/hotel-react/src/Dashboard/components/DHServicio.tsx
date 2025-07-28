import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardBody, Col, Spinner, Alert } from "reactstrap";

export interface IServicioPop {
  nombreServicio: string;
  cantidad: number;
}

// Paleta moderna y profesional
const colores = [
  "#1565C0", // Azul corporativo vibrante
  "#2E7D32", // Verde corporativo elegante
  "#E65100", // Naranja corporativo
  "#5D4037", // Marrón ejecutivo
  "#283593", // Índigo profesional
  "#00695C", // Verde azulado elegante
  "#BF360C", // Rojo corporativo
  "#4527A0", // Púrpura ejecutivo
];

export function DashboardServicios() {
  const [datos, setDatos] = useState<IServicioPop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await fetch(
          `${appsettings.apiUrl}Dashboard/serviciosPopulares`
        );
        if (!response.ok) throw new Error("Error al cargar servicios");
        const data = await response.json();
        setDatos(data);
      } catch (error: any) {
        setError(error.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  return (
    <Col xs="12" sm="12" md="6" lg="6" xl="6">
      <Card style={{
        border: "none",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
        background: "#ffffff",
        transition: "all 0.3s ease",
        overflow: "hidden",
        position: "relative",
        minHeight: "450px"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #1565C0 0%, #2E7D32 100%)"
        }} />
        <CardHeader style={{
          background: "#ffffff",
          color: "#2c3e50",
          fontWeight: "600",
          fontSize: "1rem",
          borderBottom: "1px solid #f1f3f4",
          padding: "20px 24px 16px",
          display: "flex",
          alignItems: "center"
        }}>
          <div style={{
            background: "linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)",
            borderRadius: "8px",
            padding: "8px",
            marginRight: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px"
          }}>
            <div style={{
              width: "16px",
              height: "16px",
              background: "#ffffff",
              borderRadius: "50%"
            }} />
          </div>
          Servicios Más Populares
        </CardHeader>
        <CardBody style={{
          height: "400px",
          background: "#ffffff",
          padding: "16px 20px 20px",
          display: "flex",
          flexDirection: "column"
        }}>
          {loading && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              flex: 1
            }}>
              <Spinner color="primary" size="sm" />
            </div>
          )}
          {error && <Alert color="danger" style={{ borderRadius: "8px", fontSize: "0.85rem" }}>{error}</Alert>}
          {!loading && !error && (
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datos}
                    dataKey="cantidad"
                    nameKey="nombreServicio"
                    cx="50%"
                    cy="45%"
                    innerRadius="25%"
                    outerRadius="65%"
                    label={({ nombreServicio, percent }) => {
                      // Solo mostrar label si hay suficiente espacio
                      if (percent > 0.05) {
                        return `${nombreServicio} (${(percent * 100).toFixed(1)}%)`;
                      }
                      return '';
                    }}
                    labelLine={false}
                    stroke="#ffffff"
                    strokeWidth={2}
                    style={{
                      fontSize: "12px",
                      fontWeight: "500"
                    }}
                  >
                    {datos.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colores[index % colores.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, _name: any, props: any) => [
                      value,
                      props.payload.nombreServicio,
                    ]}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      color: "#2c3e50",
                      border: "1px solid #e0e4e7",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      fontWeight: "500",
                      fontSize: "0.85rem"
                    }}
                    itemStyle={{ color: "#1565C0" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "0.8rem",
                      color: "#2c3e50",
                      marginTop: "8px",
                      fontWeight: "500",
                      lineHeight: "1.2"
                    }}
                    layout="horizontal"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardBody>
      </Card>
    </Col>
  );
}