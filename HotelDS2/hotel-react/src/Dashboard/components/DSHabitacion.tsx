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
          console.log("Datos cargados:", data);
          setDatos(data);
        }
      } catch (error) {
        console.error("Error al cargar dashboard:", error);
      }
    };

    obtenerDatos();
  }, []);
  const getColorPorTipo = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "presidencial":
        return "#8884d8"; // Morado
      case "suite":
        return "#82ca9d"; // Verde
      case "doble":
        return "#ffc658"; // Amarillo
      case "individual":
        return "#ff7f7f"; // Rojo suave
      default:
        return "#a0a0a0"; // Gris por defecto
    }
  };
  return (
    <Col md="6">
      <Card>
        <CardHeader>Habitaciones Más Reservadas</CardHeader>
        <CardBody style={{ height: "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={datos}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombreTipoHabitacion" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidadReservas" name="Reservas">
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
