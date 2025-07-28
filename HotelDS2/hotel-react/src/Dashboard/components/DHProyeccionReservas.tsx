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
        r={12}
        fill="#ffffff"
        stroke="#607D8B"
        strokeWidth={3}
        style={{ filter: "drop-shadow(0px 2px 8px rgba(96, 125, 139, 0.3))" }}
      />
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#607D8B"
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
      <Card style={{
        border: "none",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
        background: "#ffffff",
        transition: "all 0.3s ease",
        overflow: "hidden",
        position: "relative"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #607D8B 0%, #90A4AE 100%)"
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
            background: "linear-gradient(135deg, #607D8B 0%, #90A4AE 100%)",
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
              height: "16px",
              background: "#ffffff",
              borderRadius: "2px"
            }} />
          </div>
          Reservas Mensuales con Proyección
        </CardHeader>
        <CardBody style={{
          height: "320px",
          minHeight: "280px",
          background: "#ffffff",
          padding: "24px"
        }}>
          {loading && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%"
            }}>
              <Spinner color="primary" size="sm" />
            </div>
          )}
          {error && <Alert color="danger" style={{ borderRadius: "8px", fontSize: "0.85rem" }}>{error}</Alert>}
          {!loading && !error && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={datos}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid stroke="#f0f2f5" strokeDasharray="2 2" />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 11, fill: "#546e7a" }}
                  axisLine={{ stroke: "#e0e4e7" }}
                  tickLine={{ stroke: "#e0e4e7" }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#546e7a" }}
                  axisLine={{ stroke: "#e0e4e7" }}
                  tickLine={{ stroke: "#e0e4e7" }}
                />
                <Tooltip
                  formatter={(value: any, name: any, props: any) => {
                    if (props.payload.mes === datos[datos.length - 1].mes) {
                      return [`${value} (Proyección)`, name];
                    }
                    return [value, name];
                  }}
                  labelStyle={{ fontWeight: "600", color: "#2c3e50", fontSize: "0.9rem" }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    color: "#2c3e50",
                    border: "1px solid #e0e4e7",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                  }}
                  itemStyle={{ color: "#607D8B", fontWeight: "500" }}
                  cursor={{ stroke: "#607D8B", strokeWidth: 1, strokeDasharray: "2 2" }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "0.9rem",
                    color: "#2c3e50",
                    marginBottom: "10px",
                    fontWeight: "500"
                  }}
                />
                {ultimoMes && mesProyeccion && (
                  <ReferenceArea
                    x1={ultimoMes}
                    x2={mesProyeccion}
                    strokeOpacity={0}
                    fill="#607D8B"
                    fillOpacity={0.06}
                  />
                )}
                <Line
                  type="linear"
                  dataKey="cantidadReservas"
                  name="Reservas"
                  stroke="#1565C0"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={true}
                  strokeLinecap="round"
                />
                <Scatter
                  data={historico}
                  dataKey="cantidadReservas"
                  fill="#455A64"
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