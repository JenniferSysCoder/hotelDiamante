import { useEffect, useState } from "react";
import type { IHabitacionesDS } from "../Interfaces/IHabitacionesDS";
import { appsettings } from "../../settings/appsettings";
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

// Paleta moderna y profesional - colores únicos para cada barra
const coloresUnicos = [
  "#D32F2F", // Rojo corporativo elegante
  "#7B1FA2", // Púrpura ejecutivo
  "#455A64", // Gris azulado corporativo
  "#00695C", // Verde esmeralda profesional
  "#E65100", // Naranja corporativo profundo
  "#3F51B5", // Índigo corporativo
  "#795548", // Marrón corporativo
  "#607D8B", // Gris azulado claro
];

const getColorPorIndice = (index: number) => {
  return coloresUnicos[index % coloresUnicos.length];
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
        // Puedes agregar un Alert aquí si quieres mostrar errores
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
          background: "linear-gradient(90deg, #D32F2F 0%, #7B1FA2 100%)"
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
            background: "linear-gradient(135deg, #D32F2F 0%, #7B1FA2 100%)",
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
              height: "12px",
              background: "#ffffff",
              borderRadius: "2px"
            }} />
          </div>
          Habitaciones Más Reservadas
        </CardHeader>
        <CardBody style={{
          height: "400px",
          background: "#ffffff",
          padding: "16px 20px 20px",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={datos}
                margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                barCategoryGap="20%"
              >
                <CartesianGrid stroke="#f0f2f5" strokeDasharray="2 2" />
                <XAxis
                  dataKey="nombreTipoHabitacion"
                  tick={{ fontSize: 11, fill: "#546e7a" }}
                  axisLine={{ stroke: "#e0e4e7" }}
                  tickLine={{ stroke: "#e0e4e7" }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#546e7a" }}
                  axisLine={{ stroke: "#e0e4e7" }}
                  tickLine={{ stroke: "#e0e4e7" }}
                />
                <Tooltip
                  formatter={(value: any, _name: any, _props: any) => [
                    value,
                    "Reservas",
                  ]}
                  labelStyle={{ fontWeight: "600", color: "#2c3e50", fontSize: "0.9rem" }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    color: "#2c3e50",
                    border: "1px solid #e0e4e7",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    fontWeight: "500"
                  }}
                  itemStyle={{ color: "#D32F2F" }}
                  cursor={{ fill: "#D32F2F", opacity: 0.08 }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "0.9rem",
                    color: "#2c3e50",
                    marginBottom: "10px",
                    fontWeight: "500"
                  }}
                />
                <Bar
                  dataKey="cantidadReservas"
                  name="Reservas"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                >
                  {datos.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getColorPorIndice(index)}
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