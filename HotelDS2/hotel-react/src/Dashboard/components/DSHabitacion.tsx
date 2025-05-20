import { useEffect, useState } from "react";
import type { IHabitacionesDS } from "../Interfaces/IHabitacionesDS";
import { appsettings } from "../../settings/appsettings";
import { Card, CardHeader, CardBody } from "reactstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function DashboardHabitaciones() {
  const [datos, setDatos] = useState<IHabitacionesDS[]>([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await fetch(
          `${appsettings.apiUrl}Dashboard/tiposHabitacionPopulares`
        );
        if (response.ok) {
          const data = await response.json();
          setDatos(data);
        }
      } catch (error) {
        console.error("Error al cargar dashboard:", error);
      }
    };

    obtenerDatos();
  }, []);

  return (
    <Card className="col-6">
      <CardHeader>Habitaciones Más Reservadas</CardHeader>
      <CardBody style={{ height: "400px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datos} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombreTipoHabitacion" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidadReservas" fill="#8884d8" name="Reservas" />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
