import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { appsettings } from "../../settings/appsettings";
import type { IFactura } from "../../Interfaces/IFactura";
import { Card, CardBody, Button, Table } from "reactstrap";
import { FaPrint } from "react-icons/fa";

export function VistaFactura() {
  const { id } = useParams();
  const [factura, setFactura] = useState<IFactura | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerFactura = async () => {
      const response = await fetch(`${appsettings.apiUrl}Facturas/Obtener/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFactura(data);
      }
    };
    obtenerFactura();
  }, [id]);

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open("", "_blank", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Factura #${factura?.idFactura}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 40px; margin: 0; color: #333; }
                h1 { color: #0277bd; margin-bottom: 5px; }
                .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0277bd; padding-bottom: 10px; margin-bottom: 20px; }
                .info { margin-bottom: 10px; }
                .info strong { width: 140px; display: inline-block; }
                .total { text-align: right; font-size: 1.4rem; font-weight: bold; color: #0277bd; margin-top: 20px; }
                .footer { margin-top: 40px; text-align: center; color: #666; }
                .firma { margin-top: 60px; text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                th { background-color: #f0f8ff; }
              </style>
            </head>
            <body>
              ${printContent}
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

  if (!factura) return <p className="text-center mt-5">Cargando factura...</p>;

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card className="shadow border-0" style={{ width: "800px" }}>
        <CardBody>
          <div ref={printRef}>
            {/* Encabezado */}
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4" style={{ borderColor: "#0277bd" }}>
              <div>
                <h1 className="fw-bold text-primary mb-1">Hotel Diamante</h1>
                <div className="text-muted small">
                  Sonzacate, Sonsonate, El Salvador<br />
                  Tel: +503 7531-9174<br />
                  Email: hoteldiamante@gmail.com
                </div>
              </div>
              <div className="text-end">
                <div className="fw-bold">Factura No: #{factura.idFactura}</div>
                <div className="text-muted">Fecha: {new Date(factura.fechaEmision).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Información cliente */}
            <div className="mb-3">
              <strong>Cliente:</strong> {factura.nombreCliente}
            </div>

            {/* Detalle de la factura */}
            <Table bordered responsive>
              <thead className="table-light">
                <tr>
                  <th>Descripción</th>
                  <th>Habitación</th>
                  <th className="text-end">Precio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{factura.nombreServicio}</td>
                  <td>{factura.numeroHabitacion}</td>
                  <td className="text-end">${factura.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </Table>

            {/* Total */}
            <div className="text-end mt-3">
              <div className="fw-bold fs-5 text-primary">Total a Pagar: ${factura.total.toFixed(2)}</div>
            </div>

            {/* Firma y pie */}
            <div className="firma mt-5 text-center">
              _________________________
              <br />
              Firma del Cliente
            </div>

            <div className="footer mt-4 text-center text-muted small">
              Gracias por su preferencia.<br />
              Método de Pago: Visa **** **** **** 1234
            </div>
          </div>

          {/* Botones */}
          <div className="text-center mt-4">
            <Button color="primary" onClick={handlePrint}>
              <FaPrint className="me-2" />
              Imprimir / Guardar como PDF
            </Button>
          </div>
          <div className="text-center mt-2">
            <Button color="secondary" onClick={() => navigate("/facturas")}>
              Volver a la lista
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
