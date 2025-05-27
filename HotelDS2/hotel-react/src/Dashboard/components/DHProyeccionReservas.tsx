import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Col } from "reactstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter
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

          const dataExtendida = [
            ...data,
            {
              mes: mesProyeccion,
              cantidadReservas: Math.round(promedio),
            },
          ];

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
          <LineChart
            width={800}
            height={350}
            data={datos}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="mes" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line
              type="linear"
              dataKey="cantidadReservas"
              name="Reservas"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Scatter
              data={datos}
              dataKey="cantidadReservas"
              fill="#82ca9d"
            />
          </LineChart>
        </CardBody>
      </Card>
    </Col>
  );
}
