import { useEffect, useState, useRef } from "react";
import { appsettings } from "../../settings/appsettings";
import {
  Container,
  Row,
  Col,
  Table,
  Card,
  CardBody,
  CardHeader,
  Button,
} from "reactstrap";
import logo from "../../../img/logoHotelDiamante.png";

interface IReporteServicio {
  nombreServicio: string;
  totalSolicitudes: number;
  empleadoMasActivo: string;
}

export function ListarReporteServicios() {
  const [servicios, setServicios] = useState<IReporteServicio[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  const obtenerServicios = async () => {
    try {
      const response = await fetch(
        `${appsettings.apiUrl}ReporteServicio/ServiciosSolicitados`
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setServicios(data);
        }
      }
    } catch (error) {
      console.error("Error al obtener datos del reporte:", error);
    }
  };

  useEffect(() => {
    obtenerServicios();
  }, []);

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
              <title>Reporte de Servicios Más Solicitados</title>
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
              <h3 class="titulo-detalle">Reporte de Servicios Más Solicitados</h3>
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

  return (
    <div className="bg-light py-4">
      <Container>
        <Row className="justify-content-center">
          <Col lg="10">
            <Card>
              <CardHeader className="d-flex align-items-center">
                <img
                  src={logo}
                  alt="Logo"
                  style={{ height: "30px", marginRight: "10px" }}
                />
                <div>
                  <h2 style={{ color: "gold", marginBottom: 0 }}>
                    Hotel <span style={{ color: "#c82333" }}>Diamante</span>
                  </h2>
                  <h6 className="text-muted">
                    Reporte de Servicios Más Solicitados
                  </h6>
                </div>
              </CardHeader>
              <CardBody>
                <div className="text-end mb-2">
                  <Button color="danger" size="sm" onClick={generarPDF}>
                    Imprimir / PDF
                  </Button>
                </div>
                <div ref={printRef} className="table-responsive">
                  <Table hover className="align-middle table-bordered">
                    <thead className="table-dark">
                      <tr>
                        <th>Servicio</th>
                        <th>Solicitudes</th>
                        <th>Cliente Más Activo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicios.length > 0 ? (
                        servicios.map((s, index) => (
                          <tr key={index}>
                            <td>{s.nombreServicio}</td>
                            <td>{s.totalSolicitudes}</td>
                            <td>{s.empleadoMasActivo}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center text-muted">
                            No se encontraron servicios
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
