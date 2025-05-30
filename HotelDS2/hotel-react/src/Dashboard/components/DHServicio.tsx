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
import { Card, CardHeader, CardBody, Col } from "reactstrap";

export interface IServicioPop {
  nombreServicio: string;
  cantidad: number;
}

export function DashboardServicios() {
  const [datos, setDatos] = useState<IServicioPop[]>([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await fetch(
          `${appsettings.apiUrl}Dashboard/serviciosPopulares`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Servicios cargados:", data);
          setDatos(data);
        }
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      }
    };

    obtenerDatos();
  }, []);

  const colores = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#a0a0a0"];

  return (
    <Col md="6">
      <Card>
        <CardHeader>Servicios Más Populares</CardHeader>
        <CardBody style={{ height: "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={datos}
                dataKey="cantidad"
                nameKey="nombreServicio"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {datos.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colores[index % colores.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </Col>
  );
}
