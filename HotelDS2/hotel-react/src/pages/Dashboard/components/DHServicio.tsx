import { useEffect, useMemo, useState } from "react";
import { appsettings } from "../../../settings/appsettings";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardHeader,
  CardBody,
  Col,
  Spinner,
  Alert,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

export interface IServicioPop {
  nombreServicio: string;
  cantidad: number;
}

// Paleta “enterprise”: neutros azul/gris, consistentes y sobrios
const PALETTE = [
  "#1f4f82",
  "#2d6aa3",
  "#3b83be",
  "#5b9bd5",
  "#7aaada",
  "#9dbfe5",
  "#bcd1ec",
  "#d5e2f3",
];

export function DashboardServicios() {
  const [datos, setDatos] = useState<IServicioPop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(
    () => datos.reduce((acc, d) => acc + Number(d.cantidad || 0), 0),
    [datos]
  );

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${appsettings.apiUrl}Dashboard/serviciosPopulares`
        );
        if (!res.ok) throw new Error("No se pudo cargar Servicios Populares");
        const data = (await res.json()) as IServicioPop[];
        setDatos(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    obtenerDatos();
  }, []);

  // Etiqueta central (total) para el donut
  const CenterLabel = () => {
    return (
      <foreignObject x="35%" y="35%" width="30%" height="30%">
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "#1f2937",
            lineHeight: 1.1,
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Total</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{total}</div>
          </div>
        </div>
      </foreignObject>
    );
  };

  // Formateador de tooltip: “Servicio — 12 (34.5%)”
  const tooltipFormatter = (value: any, _name: any, props: any) => {
    const cnt = Number(value || 0);
    const pct = total > 0 ? `${((cnt / total) * 100).toFixed(1)}%` : "0%";
    return [`${cnt} (${pct})`, props?.payload?.nombreServicio ?? "Servicio"];
  };

  // Vista “enterprise”: bordes suaves, sin sombras fuertes, tipografía compacta
  return (
    <Col xs="12" md="6" lg="6" xl="6">
      <Card
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          background: "#fff",
        }}
      >
        <CardHeader
          style={{
            background: "#fff",
            borderBottom: "1px solid #e5e7eb",
            padding: "12px 16px",
            fontWeight: 600,
            fontSize: 14,
            color: "#111827",
          }}
        >
          Servicios más populares
        </CardHeader>

        <CardBody
          style={{
            padding: 12,
            display: "flex",
            gap: 12,
            alignItems: "stretch",
            minHeight: 320,
          }}
        >
          {/* Zona izquierda: gráfico */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div
                style={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Spinner size="sm" color="primary" />
              </div>
            ) : error ? (
              <Alert color="danger" style={{ fontSize: 13, margin: 0 }}>
                {error}
              </Alert>
            ) : datos.length === 0 ? (
              <Alert color="secondary" style={{ fontSize: 13, margin: 0 }}>
                No hay datos para mostrar en este periodo.
              </Alert>
            ) : (
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datos}
                      dataKey="cantidad"
                      nameKey="nombreServicio"
                      cx="50%"
                      cy="50%"
                      innerRadius="45%"
                      outerRadius="72%"
                      paddingAngle={1.5}
                      labelLine={false} // 👈 Se mantiene desactivado
                      stroke="#fff"
                      strokeWidth={1}
                    >
                      {datos.map((_d, i) => (
                        <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                      ))}
                    </Pie>

                    <CenterLabel />
                    <Tooltip
                      formatter={tooltipFormatter as any}
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                        boxShadow: "0 4px 12px rgba(0,0,0,.06)",
                        fontSize: 12,
                      }}
                      itemStyle={{ color: "#111827" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Zona derecha: leyenda/tabla compacta */}
          <div
            style={{
              width: 240,
              minWidth: 200,
              borderLeft: "1px solid #f3f4f6",
              paddingLeft: 12,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#6b7280",
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              Detalle
            </div>
            <div style={{ overflowY: "auto", maxHeight: 260 }}>
              <ListGroup flush>
                {datos.map((d, i) => {
                  const color = PALETTE[i % PALETTE.length];
                  const pct =
                    total > 0 ? ((d.cantidad / total) * 100).toFixed(1) : "0.0";
                  return (
                    <ListGroupItem
                      key={i}
                      style={{
                        padding: "8px 8px",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        border: "none",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 10,
                          height: 10,
                          borderRadius: 2,
                          background: color,
                          flex: "0 0 auto",
                        }}
                        aria-hidden
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          gap: 8,
                        }}
                        title={d.nombreServicio}
                      >
                        <span
                          style={{
                            color: "#111827",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 120,
                          }}
                        >
                          {d.nombreServicio}
                        </span>
                        <span style={{ color: "#374151" }}>
                          {d.cantidad}{" "}
                          <span style={{ color: "#6b7280" }}>({pct}%)</span>
                        </span>
                      </div>
                    </ListGroupItem>
                  );
                })}
                {!loading && !error && datos.length === 0 && (
                  <ListGroupItem style={{ fontSize: 13, color: "#6b7280" }}>
                    Sin registros.
                  </ListGroupItem>
                )}
              </ListGroup>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
}
