import { useEffect, useState, useRef } from "react";
import { appsettings } from "../../settings/appsettings";
import {
  Container,
  Row,
  Col,
  Table,
  Input,
  Card,
  CardBody,
  CardHeader,
  Button,
} from "reactstrap";
import logo from "../../../img/logoHotelDiamante.png";

interface ReporteReservaDTO {
  idReserva: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  nombre: string;
  tipo: string;
}

export function ListarReporteReserva() {
  const [reservas, setReservas] = useState<ReporteReservaDTO[]>([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const obtenerReservas = async () => {
    try {
      const response = await fetch(
        `${appsettings.apiUrl}ReporteReserva/Reservas`
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setReservas(data);
        }
      }
    } catch (error) {
      console.error("Error al obtener datos del reporte:", error);
    }
  };

  useEffect(() => {
    obtenerReservas();
  }, []);

  const formatearFecha = (fecha: string) => {
    const fechaObj = new Date(fecha);
    return isNaN(fechaObj.getTime())
      ? "Fecha inválida"
      : fechaObj.toLocaleDateString();
  };

  const reservasFiltradas = reservas.filter((r) => {
    const fechaInicioFiltro = fechaInicio ? new Date(fechaInicio) : null;
    const fechaFinFiltro = fechaFin ? new Date(fechaFin) : null;
    const fechaReserva = new Date(r.fechaInicio);

    return (
      (!fechaInicioFiltro || fechaReserva >= fechaInicioFiltro) &&
      (!fechaFinFiltro || fechaReserva <= fechaFinFiltro)
    );
  });

  const generarPDF = () => {
    if (printRef.current) {
      const contenido = printRef.current.innerHTML;
      const ventanaImpresion = window.open(
        "",
        "_blank",
        "width=900,height=700"
      );
      if (ventanaImpresion) {
        ventanaImpresion.document.write(`
          <html>
            <head>
              <title>Reporte de Reservas</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  margin: 0;
                  color: #333;
                }
                .header {
                  display: flex;
                  align-items: center;
                  margin-bottom: 15px;
                }
                .header img {
                  height: 50px;
                  margin-right: 10px;
                }
                .header h2 {
                  color: gold;
                  margin: 0;
                  font-size: 1.8rem;
                }
                .header h2 span {
                  color: #c82333;
                }
                h3.titulo-detalle {
                  color: #343a40;
                  font-size: 1.5rem;
                  font-weight: bold;
                  margin-top: 20px;
                  margin-bottom: 10px;
                  text-align: center;
                }
                p.filtro-fechas {
                  font-size: 0.9rem;
                  color: #6c757d;
                  margin-bottom: 15px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 10px;
                }
                th, td {
                  border: 1px solid #ccc;
                  padding: 6px;
                  text-align: left;
                  font-size: 0.8rem;
                }
                th {
                  background-color: #343a40;
                  color: white;
                }
                .badge {
                  border-radius: 0.25rem;
                  padding: 0.35em 0.65em;
                  font-size: 0.75em;
                  font-weight: bold;
                  color: #fff;
                  background-color: #28a745;
                }
                .footer {
                  margin-top: 30px;
                  text-align: center;
                  font-size: 0.8rem;
                  color: #666;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <img src="${
                  window.location.origin
                }/logoHotelDiamante.png" alt="Logo del Hotel" />
                <h2>Hotel <span>Diamante</span></h2>
              </div>
              <h3 class="titulo-detalle">Reporte de Reservas</h3>
              <p class="filtro-fechas"><strong>Desde:</strong> ${
                fechaInicio || "N/A"
              } &nbsp;&nbsp;&nbsp; <strong>Hasta:</strong> ${
          fechaFin || "N/A"
        }</p>
              ${contenido}
              <div class="footer">Generado el ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}</div>
            </body>
          </html>
        `);
        ventanaImpresion.document.close();
        ventanaImpresion.focus();
        ventanaImpresion.print();
        ventanaImpresion.close();
      }
    }
  };

  const estilos = {
    container: {
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
      paddingTop: "40px",
    },
    card: {
      borderRadius: "0.375rem",
      boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
      border: "1px solid #dee2e6",
    },
    cardHeader: {
      backgroundColor: "#fff",
      borderBottom: "1px solid #dee2e6",
      padding: "1rem 1.25rem",
      borderTopLeftRadius: "0.375rem",
      borderTopRightRadius: "0.375rem",
      display: "flex",
      alignItems: "center",
    },
    logoHeader: {
      height: "30px",
      marginRight: "10px",
    },
    tituloHotel: {
      color: "gold",
      fontSize: "1.3rem",
      marginBottom: "0",
    },
    tituloDiamante: {
      color: "#c82333",
    },
    subtituloReporte: {
      color: "#6c757d",
      fontSize: "0.9rem",
      marginLeft: "0.5rem",
    },
    cardBody: {
      backgroundColor: "#fff",
      padding: "1.25rem",
      borderBottomLeftRadius: "0.375rem",
      borderBottomRightRadius: "0.375rem",
    },
    formLabel: {
      fontWeight: "bold",
      marginBottom: "0.2rem",
      display: "block",
      fontSize: "0.9rem",
    },
    input: {
      borderRadius: "0.25rem",
      borderColor: "#ced4da",
      fontSize: "0.9rem",
      width: "100%",
      padding: "0.3rem 0.75rem",
    },
    buttonImprimir: {
      backgroundColor: "#c82333",
      color: "white",
      fontWeight: "bold",
      boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
      fontSize: "0.8rem",
      padding: "0.3rem 0.6rem",
      marginTop: "0.2rem",
      width: "auto",
    },
    tituloDetalle: {
      color: "#343a40",
      fontSize: "1.3rem",
      fontWeight: "bold",
      marginTop: "10px",
      marginBottom: "8px",
      textAlign: "center" as "center",
    },
    theadDark: {
      backgroundColor: "#343a40",
      color: "white",
      fontSize: "0.9rem",
    },
    table: {
      fontSize: "0.85rem",
    },
  };

  return (
    <div style={estilos.container}>
      <Container>
        <Row className="justify-content-center">
          <Col lg="10">
            <Card style={estilos.card}>
              <CardHeader style={estilos.cardHeader}>
                <img
                  src={logo}
                  alt="Diamante Hotel Logo"
                  style={estilos.logoHeader}
                />
                <div>
                  <h2 style={estilos.tituloHotel}>
                    Hotel <span style={estilos.tituloDiamante}>Diamante</span>
                  </h2>
                  <h6 style={estilos.subtituloReporte}>Reporte de Reservas</h6>
                </div>
              </CardHeader>
              <CardBody style={estilos.cardBody}>
                <Row className="mb-3 align-items-end">
                  <Col md="4">
                    <label
                      className="form-label fw-semibold"
                      style={estilos.formLabel}
                    >
                      Desde:
                    </label>
                    <Input
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      style={estilos.input}
                    />
                  </Col>
                  <Col md="4">
                    <label
                      className="form-label fw-semibold"
                      style={estilos.formLabel}
                    >
                      Hasta:
                    </label>
                    <Input
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      style={estilos.input}
                    />
                  </Col>
                  <Col md="auto">
                    <Button style={estilos.buttonImprimir} onClick={generarPDF}>
                      Imprimir / PDF
                    </Button>
                  </Col>
                </Row>

                <h3 style={estilos.tituloDetalle}>Detalle de Reservas</h3>
                <div
                  ref={printRef}
                  className="table-responsive"
                  style={estilos.table}
                >
                  <Table hover className="align-middle">
                    <thead style={estilos.theadDark}>
                      <tr>
                        <th>Id</th>
                        <th>Cliente</th>
                        <th>Habitación</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservasFiltradas.length > 0 ? (
                        reservasFiltradas.map((r) => (
                          <tr key={r.idReserva}>
                            <td>{r.idReserva}</td>
                            <td>{r.nombre}</td>
                            <td>{r.tipo}</td>
                            <td>{formatearFecha(r.fechaInicio)}</td>
                            <td>{formatearFecha(r.fechaFin)}</td>
                            <td>
                              <span className="badge bg-success">
                                {r.estado}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center text-muted">
                            No se encontraron reservas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
