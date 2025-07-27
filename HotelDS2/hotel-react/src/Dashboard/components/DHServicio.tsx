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
  "#23272f", // Gris oscuro
  "#00b894", // Verde profesional
  "#636e72", // Gris medio
  "#0984e3", // Azul moderno
  "#fdcb6e", // Amarillo suave
  "#dfe6e9", // Gris claro
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
    <Col md="6">
      <Card style={{ border: "none", boxShadow: "0 2px 12px #23272f14" }}>
        <CardHeader style={{
          background: "#23272f",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1.1rem",
          letterSpacing: "1px"
        }}>
          <span role="img" aria-label="star">⭐</span> Servicios Más Populares
        </CardHeader>
        <CardBody style={{ height: "400px", background: "#f6f7f9", padding: "24px" }}>
          {loading && <Spinner color="dark" />}
          {error && <Alert color="danger">{error}</Alert>}
          {!loading && !error && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datos}
                  dataKey="cantidad"
                  nameKey="nombreServicio"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  label={({ nombreServicio, percent }) =>
                    `${nombreServicio} (${(percent * 100).toFixed(1)}%)`
                  }
                  labelLine={false}
                  stroke="#fff"
                  strokeWidth={2}
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
                    backgroundColor: "#23272f",
                    color: "#fff",
                    borderColor: "#00b894",
                    fontWeight: "bold",
                  }}
                  itemStyle={{ color: "#00b894" }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: "1rem",
                    color: "#23272f",
                    marginTop: "16px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardBody>
      </Card>
    </Col>
  );
}