import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Col, Spinner, Alert } from "reactstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { appsettings } from "../../settings/appsettings";

interface IReservasMes {
  mes: string;
  cantidadReservas: number;
}

function calcularProyeccion(data: IReservasMes[]): IReservasMes | null {
  if (data.length < 1) return null;
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

  const mesProyeccion = `${siguienteMes
    .toString()
    .padStart(2, "0")}/${siguienteAño}`;

  return {
    mes: mesProyeccion,
    cantidadReservas: Math.round(promedio),
  };
}

// Punto personalizado para la proyección con estilo moderno
const PuntoProyeccion = (props: any) => {
  const { cx, cy } = props;
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={14}
        fill="#23272f"
        opacity={0.9}
        style={{ filter: "drop-shadow(0px 2px 8px #23272f)" }}
      />
      <circle
        cx={cx}
        cy={cy}
        r={8}
        stroke="#00b894"
        strokeWidth={3}
        fill="#00b894"
        opacity={1}
      />
    </>
  );
};

export function DashboardProyeccionReservas() {
  const [datos, setDatos] = useState<IReservasMes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await fetch(
          `${appsettings.apiUrl}Dashboard/reservasPorMes`
        );
        if (!response.ok) throw new Error("Error al obtener datos");
        const data: IReservasMes[] = await response.json();
        if (!Array.isArray(data)) throw new Error("Formato de datos inválido");

        const proyeccion = calcularProyeccion(data);
        setDatos(proyeccion ? [...data, proyeccion] : data);
      } catch (error: any) {
        setError(error.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  // Separar histórico y proyección
  const historico = datos.slice(0, -1);
  const proyeccion = datos.length > 0 ? [datos[datos.length - 1]] : [];

  // Para sombrear el área de proyección
  const ultimoMes = historico.length > 0 ? historico[historico.length - 1].mes : null;
  const mesProyeccion = proyeccion.length > 0 ? proyeccion[0].mes : null;

  return (
    <Col xs="12" md="6" lg="6">
      <Card style={{ border: "none", boxShadow: "0 2px 12px #23272f14" }}>
        <CardHeader style={{
          background: "#23272f",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1.2rem",
          letterSpacing: "1px"
        }}>
          <span role="img" aria-label="chart">📊</span> Reservas Mensuales con Proyección
        </CardHeader>
        <CardBody style={{
          height: "280px",
          minHeight: "220px",
          background: "#f6f7f9",
          padding: "16px"
        }}>
          {loading && <Spinner color="dark" />}
          {error && <Alert color="danger">{error}</Alert>}
          {!loading && !error && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={datos}
                margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid stroke="#e0e3e8" strokeDasharray="3 3" />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 12, fill: "#23272f" }}
                  axisLine={{ stroke: "#b2bec3" }}
                  tickLine={{ stroke: "#b2bec3" }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#23272f" }}
                  axisLine={{ stroke: "#b2bec3" }}
                  tickLine={{ stroke: "#b2bec3" }}
                />
                <Tooltip
                  formatter={(value: any, name: any, props: any) => {
                    if (props.payload.mes === datos[datos.length - 1].mes) {
                      return [`${value} (Proyección)`, name];
                    }
                    return [value, name];
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#00b894" }}
                  contentStyle={{ backgroundColor: "#23272f", color: "#fff", borderColor: "#00b894" }}
                  itemStyle={{ color: "#00b894" }}
                  cursor={{ stroke: "#23272f", strokeWidth: 2 }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "1rem",
                    color: "#23272f",
                    marginBottom: "10px"
                  }}
                />
                {ultimoMes && mesProyeccion && (
                  <ReferenceArea
                    x1={ultimoMes}
                    x2={mesProyeccion}
                    strokeOpacity={0}
                    fill="#00b894"
                    fillOpacity={0.08}
                  />
                )}
                <Line
                  type="linear"
                  dataKey="cantidadReservas"
                  name="Reservas"
                  stroke="#23272f"
                  strokeWidth={4}
                  dot={false}
                  isAnimationActive={true}
                />
                <Scatter
                  data={historico}
                  dataKey="cantidadReservas"
                  fill="#636e72"
                  name="Histórico"
                  shape="circle"
                  legendType="circle"
                />
                {proyeccion.length > 0 && (
                  <Scatter
                    data={proyeccion}
                    dataKey="cantidadReservas"
                    name="Proyección"
                    legendType="circle"
                    shape={<PuntoProyeccion />}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardBody>
      </Card>
    </Col>
  );
}