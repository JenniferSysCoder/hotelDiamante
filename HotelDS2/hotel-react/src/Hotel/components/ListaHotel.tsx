import { useEffect, useState } from "react";
import { appsettings } from "../../settings/appsettings";
import type { IHotel } from "../Interfaces/IHotel";
import { Container, Row, Col, Table } from "reactstrap";
import Swal from "sweetalert2";

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
          <h4>Lista de hoteles</h4>
          <hr />

          <Table bordered responsive>
            <thead>
              <tr>
                <th
                  style={{
                    backgroundColor: "#43a047",
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Id
                </th>
                <th
                  style={{
                    backgroundColor: "#43a047",
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Nombre
                </th>
                <th
                  style={{
                    backgroundColor: "#43a047",
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Dirección
                </th>
                <th
                  style={{
                    backgroundColor: "#43a047",
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Teléfono
                </th>
                <th
                  style={{
                    backgroundColor: "#43a047",
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Correo
                </th>
                <th
                  style={{
                    backgroundColor: "#43a047",
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Categoría
                </th>
              </tr>
            </thead>
            <tbody>
              {hoteles.map((hotel) => (
                <tr key={hotel.idHotel}>
                  <td>{hotel.idHotel}</td>
                  <td>{hotel.nombre}</td>
                  <td>{hotel.direccion}</td>
                  <td>{hotel.telefono}</td>
                  <td>{hotel.correo}</td>
                  <td>{hotel.categoria}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
