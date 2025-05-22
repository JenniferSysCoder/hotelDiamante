import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col } from "reactstrap";
import { FaBed } from "react-icons/fa"; // Ícono de cama
import { appsettings } from "../../settings/appsettings";

export function ContadorHabitaciones() {
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const obtenerTotal = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Dashboard/habitacionesDisponibles`);
        if (response.ok) {
          const data = await response.json();
          setTotal(data.total);
        }
      } catch (error) {
        console.error("Error al obtener habitaciones disponibles:", error);
      }
    };

    obtenerTotal();
  }, []);

  return (
    <Col xs="12" md="4">
      <Card className="text-center">
        <CardHeader>Habitaciones Disponibles</CardHeader>
        <CardBody>
          <div className="d-flex align-items-center justify-content-center gap-3">
            <FaBed size={40} color="#1cc88a" />
            <h3 style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0 }}>{total}</h3>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
}
