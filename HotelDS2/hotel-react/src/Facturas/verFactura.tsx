import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { appsettings } from "../settings/appsettings";
import type { IFactura } from "./Interfaces/IFactura";
import { Card, CardBody, Button } from "reactstrap";
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
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Factura #${factura?.idFactura}</title>
                            <style>
                                body { font-family: Arial, sans-serif; padding: 40px; margin: 0; color: #333; }
                                h1 { color: #d32f2f; margin-bottom: 5px; }
                                .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #d32f2f; padding-bottom: 10px; margin-bottom: 20px; }
                                .header-logo { width: 80px; }
                                .info { margin-bottom: 10px; }
                                .info strong { width: 120px; display: inline-block; }
                                .total { text-align: right; font-size: 1.5rem; font-weight: bold; color: #d32f2f; margin-top: 20px; }
                                .footer { margin-top: 40px; text-align: center; color: #666; }
                                .firma { margin-top: 60px; text-align: center; }
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
            <Card className="shadow border-0" style={{ width: "700px" }}>
                <CardBody>
                    <div ref={printRef} style={{ width: "100%" }}>
                        {/* Encabezado */}
                        <div className="d-flex justify-content-between align-items-center border-bottom mb-4 pb-2" style={{ borderColor: "#d32f2f" }}>
                            <div>
                                <h1 style={{ color: "#d32f2f", marginBottom: "5px" }}>Hotel Diamante</h1>
                                <p className="mb-0">
                                    Sonzacate, Sonsonate, El Salvador<br />
                                    Tel: +503 7531-9174<br />
                                    Email: hoteldiamante@gmail.com
                                </p>
                            </div>
                        </div>

                        {/* Información de la factura */}
                        <div className="info"><strong>Factura No:</strong> {factura.idFactura}</div>
                        <div className="info"><strong>Cliente:</strong> {factura.nombreCliente}</div>
                        <div className="info"><strong>Fecha de Emisión:</strong> {new Date(factura.fechaEmision).toLocaleDateString()}</div>
                        <div className="info"><strong>Servicio:</strong> {factura.nombreServicio}</div>

                        <hr />

                        <div className="total text-end fs-4 fw-bold text-danger mt-3">
                            Total: ${factura.total.toFixed(2)}
                        </div>

                        <div className="firma mt-5 text-center">
                            _________________________<br />
                            Firma Cliente
                        </div>

                        <div className="footer mt-4 text-center text-muted">
                            Gracias por su preferencia.<br />
                            Método de Pago: Visa **** **** **** 1234
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <Button color="danger" onClick={handlePrint}>
                            <FaPrint className="me-2" />
                            Imprimir / Guardar como PDF
                        </Button>
                    </div>

                    <div className="text-center mt-2">
                        <Button color="secondary" onClick={() => navigate('/facturas')}>
                            Volver a la lista
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
