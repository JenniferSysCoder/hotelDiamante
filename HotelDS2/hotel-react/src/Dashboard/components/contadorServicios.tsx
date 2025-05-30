import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col } from "reactstrap";
import { FaConciergeBell } from "react-icons/fa"; 
import { appsettings } from "../../settings/appsettings";

export function ContadorServicios() {
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const obtenerTotal = async () => {
      try {
        const response = await fetch(
          `${appsettings.apiUrl}Dashboard/totalServicios`
        );
        if (response.ok) {
          const data = await response.json();
          setTotal(data.total);
        }
      } catch (error) {
        console.error("Error al obtener total de servicios:", error);
      }
    };

    obtenerTotal();
  }, []);

  return (
    <Col xs="12" md="4">
      <Card className="text-center">
        <CardHeader>Servicios Ofrecidos</CardHeader>
        <CardBody>
          <div className="d-flex align-items-center justify-content-center gap-3">
            <FaConciergeBell size={40} color="#f6c23e" />
            <h3 style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0 }}>
              {total}
            </h3>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
}
