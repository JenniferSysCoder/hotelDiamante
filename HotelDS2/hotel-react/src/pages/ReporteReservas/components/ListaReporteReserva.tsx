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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import logo from "../../../assets/img/logoHotelDiamante.png";
import { appsettings } from "../../../settings/appsettings";

interface IReporteServicio {
  nombreServicio: string;
  totalSolicitudes: number;
  empleadoMasActivo: string;
}

export function ListarReporteServicios() {
  const [servicios, setServicios] = useState<IReporteServicio[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${appsettings.apiUrl}ReporteServicio/ServiciosSolicitados`)
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setServicios(data))
      .catch((err) =>
        console.error("Error al obtener servicios solicitados:", err)
      );
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
    XLSX.utils.book_append_sheet(wb, ws, "ServiciosSolicitados");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "Reporte_Servicios.xlsx");
  };

  const exportarPDF = () => {
    if (printRef.current) {
      const contenido = printRef.current.innerHTML;
      const printWindow = window.open("", "_blank", "width=900,height=700");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Reporte de Servicios Más Solicitados</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                .header { display: flex; align-items: center; margin-bottom: 15px; }
                .header img { height: 50px; margin-right: 10px; }
                .header h2 { color: #333; font-size: 1.8rem; margin: 0; }
                h3 { text-align: center; margin-top: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th, td { border: 1px solid #ccc; padding: 8px; font-size: 0.9rem; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <div class="header">
                <img src="${window.location.origin}/logoHotelDiamante.png" />
                <h2>Hotel Diamante</h2>
              </div>
              <h3>Reporte de Servicios Más Solicitados</h3>
              ${contenido}
              <footer style="margin-top: 30px; text-align: center; font-size: 0.8rem;">
                Generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}
              </footer>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm border-0">
        <CardHeader className="bg-white d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <img src={logo} alt="Logo" height={40} />
            <div>
              <h4 className="mb-0">Hotel Diamante</h4>
              <small className="text-muted">Reporte de Servicios</small>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Button color="primary" size="sm" onClick={exportarPDF}>
              Exportar PDF
            </Button>
            <Button color="secondary" size="sm" onClick={exportarExcel}>
              Exportar Excel
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Row className="mb-3">
            <Col md={6}>
              <label className="form-label">Buscar Servicio:</label>
              <Input
                placeholder="Ej: Spa, Restaurante..."
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
                  <th>Empleado Más Activo</th>
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
    </Container>
  );
}
