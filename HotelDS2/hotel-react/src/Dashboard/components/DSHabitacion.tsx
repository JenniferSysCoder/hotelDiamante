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

// Paleta moderna y profesional
const coloresModernos: Record<string, string> = {
  presidencial: "#23272f", // Gris oscuro
  suite: "#00b894",        // Verde profesional
  doble: "#636e72",        // Gris medio
  individual: "#0984e3",   // Azul moderno
};

const getColorPorTipo = (tipo: string) => {
  const key = tipo.toLowerCase();
  return coloresModernos[key] || "#b2bec3"; // Gris claro por defecto
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
    <Col md="6">
      <Card style={{ border: "none", boxShadow: "0 2px 12px #23272f14" }}>
        <CardHeader style={{
          background: "#23272f",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1.1rem",
          letterSpacing: "1px"
        }}>
          <span role="img" aria-label="bed">🛏️</span> Habitaciones Más Reservadas
        </CardHeader>
        <CardBody style={{ height: "400px", background: "#f6f7f9", padding: "24px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={datos}
              margin={{ top: 30, right: 40, left: 10, bottom: 20 }}
              barCategoryGap="30%"
            >
              <CartesianGrid stroke="#e0e3e8" strokeDasharray="3 3" />
              <XAxis
                dataKey="nombreTipoHabitacion"
                tick={{ fontSize: 13, fill: "#23272f" }}
                axisLine={{ stroke: "#b2bec3" }}
                tickLine={{ stroke: "#b2bec3" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 13, fill: "#23272f" }}
                axisLine={{ stroke: "#b2bec3" }}
                tickLine={{ stroke: "#b2bec3" }}
              />
              <Tooltip
                formatter={(value: any, _name: any, _props: any) => [
                  value,
                  "Reservas",
                ]}
                labelStyle={{ fontWeight: "bold", color: "#00b894" }}
                contentStyle={{ backgroundColor: "#23272f", color: "#fff", borderColor: "#00b894" }}
                itemStyle={{ color: "#00b894" }}
                cursor={{ fill: "#00b894", opacity: 0.1 }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "1rem",
                  color: "#23272f",
                  marginBottom: "10px"
                }}
              />
              <Bar
                dataKey="cantidadReservas"
                name="Reservas"
                radius={[8, 8, 0, 0]}
                barSize={38}
              >
                {datos.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColorPorTipo(entry.nombreTipoHabitacion)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </Col>
  );
}