import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Badge,
  Spinner,
  Alert,
} from "reactstrap";
import { appsettings } from "../../settings/appsettings";

interface PerfilData {
  nombreUsuario: string;
  nombreCompleto?: string;
  rol: string;
  descripcionRol?: string;
}

export default function PerfilUsuario() {
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const usuario = sessionStorage.getItem("usuario");
        const rol = sessionStorage.getItem("rol");

        if (!usuario) {
          setError("No se encontró información del usuario");
          return;
        }

        const responseEmpleado = await fetch(`${appsettings.apiUrl}Empleados/Lista`);
        let nombreCompleto = "";

        if (responseEmpleado.ok) {
          const empleados = await responseEmpleado.json();
          const empleado = empleados.find((emp: any) =>
            emp.nombreUsuario === usuario || emp.usuario1 === usuario
          );
          if (empleado) {
            nombreCompleto = `${empleado.nombre} ${empleado.apellido || ""}`.trim();
          }
        }

        const responseRoles = await fetch(`${appsettings.apiUrl}Roles/Lista`);
        let descripcionRol = "";

        if (responseRoles.ok) {
          const roles = await responseRoles.json();
          const rolInfo = roles.find((r: any) => r.nombre === rol);
          if (rolInfo) {
            descripcionRol = rolInfo.descripcion || "";
          }
        }

        setPerfil({
          nombreUsuario: usuario,
          nombreCompleto: nombreCompleto || "",
          rol: rol || "Sin rol",
          descripcionRol: descripcionRol || "Sin descripción disponible"
        });

      } catch (error) {
        setError("Error al cargar la información del perfil");
      } finally {
        setLoading(false);
      }
    };

    obtenerPerfil();
  }, []);

  const generarAvatar = (nombre: string) => {
    const inicial = nombre.charAt(0).toUpperCase();
    const colores = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
    const colorIndex = inicial.charCodeAt(0) % colores.length;
    const backgroundColor = colores[colorIndex];

    return (
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          fontWeight: 600,
          margin: "0 auto 20px",
        }}
      >
        {inicial}
      </div>
    );
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner color="primary" />
        <p className="text-muted mt-2">Cargando perfil del usuario...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert color="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card
            style={{
              borderRadius: 12,
              border: "1px solid #e0e0e0",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
            }}
          >
            <CardBody className="text-center p-4">
              {generarAvatar(perfil?.nombreUsuario || "U")}
              <h5 className="fw-bold mb-0 text-dark">
                {perfil?.nombreCompleto || "Nombre no disponible"}
              </h5>
              <p className="text-muted">@{perfil?.nombreUsuario}</p>

              <Badge color="secondary" pill className="mb-3 px-3 py-1">
                {perfil?.rol}
              </Badge>

              <hr className="my-3" />

              <div className="text-start">
                <h6 className="text-secondary fw-semibold">Descripción del Rol</h6>
                <p className="text-muted small">
                  {perfil?.descripcionRol || "Sin descripción disponible"}
                </p>
              </div>

              <div className="d-flex justify-content-between mt-4 text-muted small">
                <div>
                  <div>Estado</div>
                  <Badge color="success" pill className="mt-1">Activo</Badge>
                </div>
                <div>
                  <div>Último acceso</div>
                  <div className="fw-medium">{new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
