import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Col,
  Spinner,
  Alert,
  Button,
  ButtonGroup,
} from "reactstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import html2canvas from "html2canvas";
import { appsettings } from "../../../settings/appsettings";

interface IReservasMes {
  mes: string;
  cantidadReservas: number;
}

function calcularProyeccion(data: IReservasMes[]): IReservasMes | null {
  if (data.length < 1) return null;
  const ultimosTres = data.slice(-3);
  const promedio =
    ultimosTres.reduce((sum, d) => sum + d.cantidadReservas, 0) / Math.max(ultimosTres.length, 1);

  const ultimoMes = ultimosTres[ultimosTres.length - 1].mes;
  const [mesStr, añoStr] = ultimoMes.split("/");
  const mes = parseInt(mesStr);
  const año = parseInt(añoStr);
  const siguienteMes = mes === 12 ? 1 : mes + 1;
  const siguienteAño = mes === 12 ? año + 1 : año;

  const mesProyeccion = `${siguienteMes.toString().padStart(2, "0")}/${siguienteAño}`;
  return { mes: mesProyeccion, cantidadReservas: Math.round(promedio) };
}

export function DashboardProyeccionReservas() {
  const [datos, setDatos] = useState<IReservasMes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("Diario");
  const chartRef = useRef(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Dashboard/reservasPorMes`);
        if (!response.ok) throw new Error("Error al obtener datos");
        const data: IReservasMes[] = await response.json();
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

  const exportarComoImagen = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement("a");
      link.download = "proyeccion_reservas.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const historico = datos.slice(0, -1);
  const proyeccion = datos.length > 0 ? [datos[datos.length - 1]] : [];
  const ultimoMes = historico.length > 0 ? historico[historico.length - 1].mes : null;
  const mesProyeccion = proyeccion.length > 0 ? proyeccion[0].mes : null;

  return (
    <Col xs="12" md="6" xl="6" className="mb-4">
      <Card style={{ backgroundColor: "#f9fbfd", borderRadius: "12px", height: "100%" }}>
        <CardHeader className="bg-transparent border-0 d-flex justify-content-between align-items-center px-4 pt-3">
          <div>
            <h6 className="mb-0 fw-bold">Reservas por Período</h6>
            <small className="text-muted">Histórico + Proyección</small>
          </div>
          <div className="d-flex gap-2">
            <ButtonGroup>
              {['Diario', 'Semanal', 'Mensual'].map((tipo) => (
                <Button
                  key={tipo}
                  size="sm"
                  color={filtro === tipo ? "primary" : "light"}
                  onClick={() => setFiltro(tipo)}
                >
                  {tipo}
                </Button>
              ))}
            </ButtonGroup>
            <Button size="sm" color="success" onClick={exportarComoImagen}>
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-4 py-2" style={{ height: "300px" }}>
          {loading && <div className="text-center"><Spinner size="sm" color="primary" /></div>}
          {error && <Alert color="danger">{error}</Alert>}
          {!loading && !error && (
            <div ref={chartRef} style={{ height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={datos} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: "0.8rem" }} />
                  {ultimoMes && mesProyeccion && (
                    <ReferenceArea
                      x1={ultimoMes}
                      x2={mesProyeccion}
                      strokeOpacity={0}
                      fill="#22c55e"
                      fillOpacity={0.1}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="cantidadReservas"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={(props) => {
                      const isProyeccion = props.payload?.mes === mesProyeccion;
                      return (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={4}
                          stroke={isProyeccion ? "#22c55e" : "#3b82f6"}
                          strokeWidth={2}
                          fill="#ffffff"
                        />
                      );
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardBody>
      </Card>
    </Col>
  );
}
