import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import { useRef } from "react";
import {Container, Row, Col, Table, Input, Card, CardBody, CardHeader} from "reactstrap";

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
            const response = await fetch(`${appsettings.apiUrl}ReporteReserva/Reservas`);
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
        return isNaN(fechaObj.getTime()) ? "Fecha inválida" : fechaObj.toLocaleDateString();
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
            const ventanaImpresion = window.open('', '_blank', 'width=900,height=700');
            if (ventanaImpresion) {
                ventanaImpresion.document.write(`
                    <html>
                        <head>
                            <title>Reporte de Reservas</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    padding: 40px;
                                    margin: 0;
                                    color: #333;
                                }
                                .header {
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    gap: 15px;
                                    margin-bottom: 20px;
                                }
                                .header img {
                                    height: 60px;
                                }
                                .header h2 {
                                    color: #1976d2;
                                    margin: 0;
                                }
                                table {
                                    width: 100%;
                                    border-collapse: collapse;
                                    margin-top: 20px;
                                }
                                th, td {
                                    border: 1px solid #ccc;
                                    padding: 8px;
                                    text-align: left;
                                }
                                th {
                                    background-color: #f5f5f5;
                                }
                                .footer {
                                    margin-top: 40px;
                                    text-align: center;
                                    font-size: 0.9rem;
                                    color: #666;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="header">
                                <img src="/logoHotelDiamante.png" alt="Logo del Hotel" />
                                <h2>Reporte de Reservas</h2>
                            </div>
                            <p><strong>Desde:</strong> ${fechaInicio || 'N/A'} &nbsp;&nbsp;&nbsp; <strong>Hasta:</strong> ${fechaFin || 'N/A'}</p>
                            ${contenido}
                            <div class="footer">Generado automáticamente - ${new Date().toLocaleString()}</div>
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
        <Container className="mt-5">
            <Row>
                <Col>
                    <h3 className="mb-4">📊 Módulo de Reportes</h3>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="mb-4">
                        <CardHeader className="bg-primary text-white">
                            Reporte de Reservas
                        </CardHeader>
                        <CardBody>
                            <Row className="mb-3">
                                <Col md="4">
                                    <label>Desde:</label>
                                    <Input
                                        type="date"
                                        value={fechaInicio}
                                        onChange={(e) => setFechaInicio(e.target.value)}
                                    />
                                </Col>
                                <Col md="4">
                                    <label>Hasta:</label>
                                    <Input
                                        type="date"
                                        value={fechaFin}
                                        onChange={(e) => setFechaFin(e.target.value)}
                                    />
                                </Col>
                                <Col md="4" className="d-flex align-items-end">
                                    <button
                                        className="btn btn-danger w-100"
                                        onClick={generarPDF}
                                    >
                                        📄 Generar PDF
                                    </button>
                                </Col>
                            </Row>

                            <div ref={printRef}>
                                <Table bordered responsive hover>
                                    <thead>
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
                                                    <td>{r.estado}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center">
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

            <Row>
                <Col>
                    <Card>
                        <CardHeader className="bg-secondary text-white">
                            Otros reportes (en construcción)
                        </CardHeader>
                        <CardBody>
                            <p>Próximamente más reportes estarán disponibles aquí.</p>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
