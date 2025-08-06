import { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Input,
  Table,
  Button,
} from "reactstrap";
import logo from "../../../assets/img/logoHotelDiamante.png";
import { appsettings } from "../../../settings/appsettings";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface IReporteServicio {
  nombreServicio: string;
  totalSolicitudes: number;
  empleadoMasActivo: string;
}

export function ListarReporteServicios() {
  const [servicios, setServicios] = useState<IReporteServicio[]>([]);
  const [busqueda, setBusqueda] = useState("");
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

  const serviciosFiltrados = servicios.filter((s) =>
    s.nombreServicio.toLowerCase().includes(busqueda.toLowerCase())
  );

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      serviciosFiltrados.map((s) => ({
        Servicio: s.nombreServicio,
        Solicitudes: s.totalSolicitudes,
        EmpleadoMásActivo: s.empleadoMasActivo,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Servicios");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "Reporte_Servicios.xlsx");
  };

  const generarPDF = () => {
    if (printRef.current) {
      const contenido = printRef.current.innerHTML;
      const ventanaImpresion = window.open("", "_blank", "width=900,height=700");
      if (ventanaImpresion) {
        ventanaImpresion.document.write(`
        <html>
          <head>
            <title>Reporte de Servicios</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                color: #333;
              }
              .header {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
              }
              .header img {
                height: 50px;
                margin-right: 10px;
              }
              .header h2 {
                color: #007bff;
                margin: 0;
              }
              .header h2 span {
                color: #28a745;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
              }
              th, td {
                border: 1px solid #ccc;
                padding: 6px;
                text-align: left;
                font-size: 0.9rem;
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
              <img src="${window.location.origin}/logoHotelDiamante.png" />
              <h2>Hotel <span>Diamante</span></h2>
            </div>
            <h3 style="text-align:center">Reporte de Servicios Más Solicitados</h3>
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
          <Col lg="11">
            <Card className="shadow-sm border-0">
              <CardHeader className="bg-white d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <img src={logo} alt="Logo" height={40} />
                  <div>
                    <h4 className="mb-0">Hotel Diamante</h4>
                    <small className="text-muted">
                      Reporte de Servicios Más Solicitados
                    </small>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Button color="secondary" size="sm" onClick={generarPDF}>
                    Exportar PDF
                  </Button>
                  <Button color="primary" size="sm" onClick={exportarExcel}>
                    Exportar Excel
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <Row className="mb-3">
                  <Col md={5}>
                    <Input
                      type="text"
                      placeholder="Buscar servicio..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                  </Col>
                </Row>
                <div ref={printRef} className="table-responsive">
                  <Table hover className="align-middle table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Servicio</th>
                        <th>Solicitudes</th>
                        <th>Empleado más activo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviciosFiltrados.length > 0 ? (
                        serviciosFiltrados.map((s, i) => (
                          <tr key={i}>
                            <td>{s.nombreServicio}</td>
                            <td>{s.totalSolicitudes}</td>
                            <td>{s.empleadoMasActivo}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center text-muted">
                            No se encontraron servicios.
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
