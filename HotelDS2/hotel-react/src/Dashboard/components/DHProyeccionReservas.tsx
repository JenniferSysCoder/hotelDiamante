import { useEffect, useState } from "react";
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
  LabelList, 
  Cell
} from "recharts";
import { appsettings } from "../../settings/appsettings";

interface IReservasMes {
  mes: string; // formato "MM/yyyy"
  cantidadReservas: number;
}

export function DashboardProyeccionReservas() {
  const [datos, setDatos] = useState<IReservasMes[]>([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await fetch(
          `${appsettings.apiUrl}Dashboard/reservasPorMes`
        );
        if (response.ok) {
          const data: IReservasMes[] = await response.json();

          // Calcular proyección para el mes siguiente (media últimos 3 meses)
          const ultimosTres = data.slice(-3);
          const promedio =
            ultimosTres.reduce((sum, d) => sum + d.cantidadReservas, 0) /
            Math.max(ultimosTres.length, 1);

          const ultimoMes = ultimosTres[ultimosTres.length - 1].mes;
          const [mesStr, añoStr] = ultimoMes.split("/");
          const mes = parseInt(mesStr);
          const año = parseInt(añoStr);
          const siguienteMes = mes === 12 ? 1 : mes + 1;
          const siguienteAño = mes === 12 ? año + 1 : año;

          const mesProyeccion = `${siguienteMes.toString().padStart(2, "0")}/${siguienteAño}`;

          const dataExtendida = [...data, {
            mes: mesProyeccion,
            cantidadReservas: Math.round(promedio)
          }];

          setDatos(dataExtendida);
        }
      } catch (error) {
        console.error("Error al cargar reservas mensuales:", error);
      }
    };

    obtenerDatos();
  }, []);

  return (
    <Col md="12">
      <Card>
        <CardHeader>Reservas Mensuales con Proyección</CardHeader>
        <CardBody style={{ height: "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={datos}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="cantidadReservas"
                name="Reservas"
                label={{ position: "top" }}
                >
                {
                    datos.map((_, index) => {
                    const isProjection = index === datos.length - 1;
                    return (
                        <Cell
                        key={`cell-${index}`}
                        fill={isProjection ? "#8884d8" : "#82ca9d"} // púrpura para proyección
                        />
                    );
                    })
                }
                <LabelList dataKey="cantidadReservas" position="top" />
                </Bar>

            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </Col>
  );
}
