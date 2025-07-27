import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import type { IHotel } from "../Interfaces/IHotel";
import { Container, Row, Col, Table, Card, CardBody } from "reactstrap";
import Swal from "sweetalert2";
import { FaHotel } from "react-icons/fa";

export function ListaHotel() {
  const [hoteles, setHoteles] = useState<IHotel[]>([]);

  const obtenerHoteles = async () => {
    try {
      const response = await fetch(`${appsettings.apiUrl}Hoteles/Lista`);
      if (response.ok) {
        const data = await response.json();
        setHoteles(data);
      } else {
        console.error("Error al obtener hoteles:", response.statusText);
        Swal.fire("Error", "No se pudo obtener la lista de hoteles", "error");
      }
    } catch (error) {
      console.error("Error de red al obtener hoteles:", error);
      Swal.fire("Error", "Hubo un problema de conexión", "error");
    }
  };

  useEffect(() => {
    obtenerHoteles();
  }, []);

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 10, offset: 1 }}>
          <Card
            style={{
              borderRadius: "18px",
              boxShadow: "0 4px 24px #23272f33",
              border: "none",
              background: "linear-gradient(135deg, #f8fafc 80%, #e3e3e3 100%)",
            }}
          >
            <CardBody>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "18px",
                }}
              >
                <FaHotel size={28} color="#43a047" />
                <h4 style={{ margin: 0, fontWeight: "bold", color: "#23272f" }}>
                  Lista de hoteles
                </h4>
              </div>
              <div style={{ overflowX: "auto" }}>
                <Table
                  bordered
                  responsive
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px #23272f22",
                    overflow: "hidden",
                  }}
                >
                  <thead style={{ background: "#43a047", color: "#fff" }}>
                    <tr>
                      <th style={{ textAlign: "center", fontWeight: "bold" }}>Id</th>
                      <th style={{ textAlign: "center", fontWeight: "bold" }}>Nombre</th>
                      <th style={{ textAlign: "center", fontWeight: "bold" }}>Dirección</th>
                      <th style={{ textAlign: "center", fontWeight: "bold" }}>Teléfono</th>
                      <th style={{ textAlign: "center", fontWeight: "bold" }}>Correo</th>
                      <th style={{ textAlign: "center", fontWeight: "bold" }}>Categoría</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hoteles.map((hotel) => (
                      <tr key={hotel.idHotel}>
                        <td>{hotel.idHotel}</td>
                        <td>
                          <span
                            style={{
                              background: "#e8f5e9",
                              color: "#43a047",
                              fontWeight: "bold",
                              borderRadius: "8px",
                              padding: "2px 10px",
                            }}
                          >
                            {hotel.nombre}
                          </span>
                        </td>
                        <td>{hotel.direccion}</td>
                        <td>{hotel.telefono}</td>
                        <td>{hotel.correo}</td>
                        <td>
                          <span
                            style={{
                              background: "#fffde7",
                              color: "#fbc02d",
                              fontWeight: "bold",
                              borderRadius: "8px",
                              padding: "2px 10px",
                            }}
                          >
                            {hotel.categoria}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}