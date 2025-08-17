// src/pages/analytics/DashboardGanancias.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Spinner,
  Table,
  Badge,
} from "reactstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { FaRedoAlt } from "react-icons/fa";
import { appsettings } from "../../../settings/appsettings";

type ResumenDTO = {
  ingresosEmitidos: number;
  ingresosCobrados: number;
  pendientesCobro: number;
  cantidadFacturas: number;
  ticketPromedio: number;
  desde: string;
  hasta: string;
};

type PuntoSerie = { clave: string; emitido: number; cobrado: number };
type SerieDTO = { groupBy: "day" | "month"; puntos: PuntoSerie[] };

type ServicioDTO = {
  servicio: string;
  totalEmitido: number;
  cantidad: number;
  ticketPromedio: number;
};

export default function DashboardGanancias() {
  // Fechas por defecto: mes actual
  const today = new Date();
  const defaultFrom = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const defaultTo = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [groupBy, setGroupBy] = useState<"day" | "month">("month");

  const [resumen, setResumen] = useState<ResumenDTO | null>(null);
  const [serie, setSerie] = useState<PuntoSerie[]>([]);
  const [servicios, setServicios] = useState<ServicioDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const fmtMoney = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }),
    []
  );

  const safeFetchJson = async <T,>(url: string): Promise<T | null> => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return (await res.json()) as T;
    } catch {
      return null;
    }
  };

  const cargar = async () => {
    setLoading(true);
    try {
      const qs = `from=${from}&to=${to}`;
      const [r1, r2, r3] = await Promise.all([
        safeFetchJson<ResumenDTO>(
          `${appsettings.apiUrl}Dashboard/ganancias/resumen?${qs}`
        ),
        safeFetchJson<SerieDTO>(
          `${appsettings.apiUrl}Dashboard/ganancias/serie?${qs}&groupBy=${groupBy}`
        ),
        safeFetchJson<ServicioDTO[]>(
          `${appsettings.apiUrl}Dashboard/ganancias/por-servicio?${qs}`
        ),
      ]);

      setResumen(r1);
      setSerie(r2?.puntos ?? []);
      setServicios(r3 ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, groupBy]);

  // Alturas compactas y responsive
  const seriesHeight =
    typeof window !== "undefined" && window.innerWidth < 768 ? 260 : 300;
  const barsHeight =
    typeof window !== "undefined" && window.innerWidth < 768 ? 240 : 280;

  return (
    <Container fluid className="mt-3">
      <Row className="mb-2">
        <Col>
          <h5 className="fw-bold mb-0">Dashboard de Ganancias</h5>
          <small className="text-muted">
            Análisis por fechas y por servicios en tarjetas separadas.
          </small>
        </Col>
      </Row>

      <Row className="g-3">
        {/* -------- Cuadro izquierdo: Análisis por fechas -------- */}
        <Col xs={12} md={6}>
          <Card className="h-100">
            <CardHeader className="bg-light py-2">
              Análisis por Fechas
            </CardHeader>
            <CardBody className="py-2">
              {/* Filtros compactos */}
              <Row className="g-2 align-items-end">
                <Col xs={6}>
                  <label className="form-label mb-1">Desde</label>
                  <Input
                    bsSize="sm"
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </Col>
                <Col xs={6}>
                  <label className="form-label mb-1">Hasta</label>
                  <Input
                    bsSize="sm"
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </Col>
                <Col xs={6}>
                  <label className="form-label mb-1">Agrupar por</label>
                  <select
                    className="form-select form-select-sm"
                    value={groupBy}
                    onChange={(e) =>
                      setGroupBy(e.target.value as "day" | "month")
                    }
                  >
                    <option value="day">Día</option>
                    <option value="month">Mes</option>
                  </select>
                </Col>
                <Col xs={6} className="text-end">
                  <Button
                    size="sm"
                    color="secondary"
                    onClick={cargar}
                    disabled={loading}
                  >
                    <FaRedoAlt className="me-2" />
                    Actualizar
                  </Button>
                </Col>
              </Row>

              {/* KPIs compactos */}
              <Row className="g-2 mt-2">
                <Col xs={6}>
                  <Card className="h-100">
                    <CardHeader className="bg-light py-1">Emitidos</CardHeader>
                    <CardBody className="py-1">
                      <div className="fs-6 fw-semibold">
                        {loading && !resumen ? (
                          <Spinner size="sm" />
                        ) : (
                          fmtMoney.format(resumen?.ingresosEmitidos ?? 0)
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card className="h-100">
                    <CardHeader className="bg-light py-1">Cobrados</CardHeader>
                    <CardBody className="py-1">
                      <div className="fs-6 fw-semibold">
                        {loading && !resumen ? (
                          <Spinner size="sm" />
                        ) : (
                          fmtMoney.format(resumen?.ingresosCobrados ?? 0)
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card className="h-100">
                    <CardHeader className="bg-light py-1">
                      Pendientes
                    </CardHeader>
                    <CardBody className="py-1">
                      <div className="fs-6 fw-semibold text-warning">
                        {loading && !resumen ? (
                          <Spinner size="sm" />
                        ) : (
                          fmtMoney.format(resumen?.pendientesCobro ?? 0)
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card className="h-100">
                    <CardHeader className="bg-light py-1">
                      Ticket Promedio
                    </CardHeader>
                    <CardBody className="py-1">
                      <div className="fs-6 fw-semibold">
                        {loading && !resumen ? (
                          <Spinner size="sm" />
                        ) : (
                          fmtMoney.format(resumen?.ticketPromedio ?? 0)
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Serie temporal */}
              <div className="mt-2" style={{ height: seriesHeight }}>
                {loading && serie.length === 0 ? (
                  <div className="text-center">
                    <Spinner size="sm" /> Cargando...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={serie}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="clave" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="emitido"
                        name="Emitido"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="cobrado"
                        name="Cobrado"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* -------- Cuadro derecho: Análisis por servicio -------- */}
        <Col xs={12} md={6}>
          <Card className="h-100">
            <CardHeader className="bg-light py-2">
              Análisis por Servicio
            </CardHeader>
            <CardBody className="py-2">
              <Row className="g-2">
                <Col xs={12} style={{ height: barsHeight }}>
                  {loading && servicios.length === 0 ? (
                    <div className="text-center">
                      <Spinner size="sm" /> Cargando...
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={servicios}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="servicio" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="totalEmitido"
                          name="Emitido"
                          barSize={24}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Col>
                <Col xs={12}>
                  <Table size="sm" responsive hover className="mb-0">
                    <thead>
                      <tr>
                        <th>Servicio</th>
                        <th className="text-end">Emitido</th>
                        <th className="text-end">#</th>
                        <th className="text-end">Ticket</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicios.map((s) => (
                        <tr key={s.servicio}>
                          <td
                            style={{
                              maxWidth: 180,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {s.servicio}
                          </td>
                          <td className="text-end">
                            {fmtMoney.format(s.totalEmitido)}
                          </td>
                          <td className="text-end">
                            <Badge color="secondary">{s.cantidad}</Badge>
                          </td>
                          <td className="text-end">
                            {fmtMoney.format(s.ticketPromedio)}
                          </td>
                        </tr>
                      ))}
                      {servicios.length === 0 && !loading && (
                        <tr>
                          <td colSpan={4} className="text-center text-muted">
                            Sin datos en el rango seleccionado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
