import { useEffect, useState } from "react";
import type { IHabitacionesDS } from "../Interfaces/IHabitacionesDS";
import { appsettings } from "../../../settings/appsettings";
import { Card, CardHeader, CardBody, Col } from "reactstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

// Paleta de colores planos, suaves y armoniosos
const coloresArmoniosos = [
  "#fbbf24", // Amarillo suave
  "#3b82f6", // Azul medio
  "#10b981", // Verde menta
  "#8b5cf6", // Morado pastel
  "#f97316", // Naranja suave
  "#2563eb", // Azul royal menos saturado
  "#14b8a6", // Verde azulado
  "#a78bfa", // Lila suave
];

const getColorArmoniosoPorIndice = (index: number) => {
  return coloresArmoniosos[index % coloresArmoniosos.length];
};

export function DashboardHabitaciones() {
  const [datos, setDatos] = useState<IHabitacionesDS[]>([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await fetch(
          `${appsettings.apiUrl}Dashboard/habitacionesPopulares`
        );
        if (response.ok) {
          const data = await response.json();
          setDatos(data);
        }
      } catch (error) {
        // Manejo de error opcional
      }
    };

    obtenerDatos();
  }, []);

  return (
    <Col xs="12" sm="12" md="6" lg="6" xl="6">
      <Card
        style={{
          border: "none",
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          background: "#fff",
          transition: "all 0.3s ease",
          overflow: "hidden",
          position: "relative",
          minHeight: 460,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <CardHeader
          style={{
            background: "#fafbfc",
            color: "#1f2937",
            fontWeight: "600",
            fontSize: "0.95rem",
            borderBottom: "1px solid #e5e7eb",
            padding: "16px 20px",
            margin: 0,
          }}
        >
          Habitaciones Más Reservadas
        </CardHeader>
        <CardBody
          style={{
            height: 420,
            background: "#fff",
            padding: "18px 24px 24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={datos}
                margin={{ top: 24, right: 30, left: 10, bottom: 50 }}
                barCategoryGap="18%"
              >
                <CartesianGrid stroke="#f3f4f6" strokeDasharray="4 4" />
                <XAxis
                  dataKey="nombreTipoHabitacion"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={{ stroke: "#e5e7eb" }}
                  angle={-45}
                  textAnchor="end"
                  height={85}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={{ stroke: "#e5e7eb" }}
                />
                <Tooltip
                  formatter={(value: any) => [value, "Reservas"]}
                  labelStyle={{
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: "1rem",
                  }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    color: "#374151",
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
                    fontWeight: 500,
                  }}
                  itemStyle={{ color: "#fbbf24" }}
                  cursor={{ fill: "#fbbf24", opacity: 0.12 }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "0.95rem",
                    color: "#374151",
                    marginBottom: 12,
                    fontWeight: 600,
                  }}
                />
                <Bar
                  dataKey="cantidadReservas"
                  name="Reservas"
                  radius={[6, 6, 0, 0]}
                  barSize={38}
                >
                  {datos.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getColorArmoniosoPorIndice(index)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
}
