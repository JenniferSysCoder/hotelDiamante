import { useEffect, useState } from "react";
import { appsettings } from "../../../settings/appsettings";
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

// Paleta de colores armónica y profesional (colores planos, suaves y modernos)
const coloresArmoniosos = [
  "#3b82f6", // Azul medio
  "#10b981", // Verde menta
  "#f59e0b", // Amarillo mostaza
  "#8b5cf6", // Morado pastel
  "#f97316", // Naranja suave
  "#2563eb", // Azul royal
  "#14b8a6", // Verde azulado
  "#a78bfa", // Lila suave
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
      <Card
        style={{
          border: "none",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
          background: "#ffffff",
          transition: "all 0.3s ease",
          overflow: "hidden",
          position: "relative",
          minHeight: "450px",
        }}
      >
        {/* Si no quieres la barra superior colorida, elimina este div */}
        {/* <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #1565C0 0%, #2E7D32 100%)",
          }}
        /> */}
        <CardHeader
          style={{
            background: "#ffffff",
            color: "#2c3e50",
            fontWeight: "600",
            fontSize: "1rem",
            borderBottom: "1px solid #f1f3f4",
            padding: "20px 24px 16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          Servicios Más Populares
        </CardHeader>
        <CardBody
          style={{
            height: "400px",
            background: "#ffffff",
            padding: "16px 20px 20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                flex: 1,
              }}
            >
              <Spinner color="primary" size="sm" />
            </div>
          )}
          {error && (
            <Alert
              color="danger"
              style={{ borderRadius: "8px", fontSize: "0.85rem" }}
            >
              {error}
            </Alert>
          )}
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
                      if (percent > 0.05) {
                        return `${nombreServicio} (${(percent * 100).toFixed(1)}%)`;
                      }
                      return "";
                    }}
                    labelLine={false}
                    stroke="#ffffff"
                    strokeWidth={2}
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    {datos.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={coloresArmoniosos[index % coloresArmoniosos.length]}
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
                      fontSize: "0.85rem",
                    }}
                    itemStyle={{ color: "#3b82f6" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "0.8rem",
                      color: "#2c3e50",
                      marginTop: "8px",
                      fontWeight: "500",
                      lineHeight: "1.2",
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
