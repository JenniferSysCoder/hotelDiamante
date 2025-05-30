import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col } from "reactstrap";
import { appsettings } from "../../settings/appsettings";
import { FaUserFriends } from "react-icons/fa";

export function ContadorClientes() {
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const obtenerTotal = async () => {
      try {
        const response = await fetch(
          `${appsettings.apiUrl}Dashboard/totalClientes`
        );
        if (response.ok) {
          const data = await response.json();
          setTotal(data.total);
        }
      } catch (error) {
        console.error("Error al obtener total de clientes:", error);
      }
    };

    obtenerTotal();
  }, []);

  return (
    <Col xs="12" md="4">
      <Card className="text-center">
        <CardHeader>Total de Clientes</CardHeader>
        <CardBody>
          <div className="d-flex align-items-center justify-content-center gap-3">
            <FaUserFriends size={40} color="#4e73df" />
            <h3 style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0 }}>
              {total}
            </h3>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
}
