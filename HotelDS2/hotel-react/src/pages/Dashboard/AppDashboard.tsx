import { Row } from "reactstrap";
import { ContadorClientes } from "./components/DHTotalClientes";
import { ContadorHabitaciones } from "./components/DHHabitacionesDisponible";
import { ContadorServicios } from "./components/contadorServicios";
import { ReservasRecientes } from "./components/ReservasRecientes";
import { TopHabitaciones } from "./components/TopHabitaciones";

export default function AppDashboard() {
  return (
    <div>
      <h2>Resumen General</h2>
      <Row className="mb-4">
        <ContadorClientes />
        <ContadorHabitaciones />
        <ContadorServicios />
      </Row>
      <Row className="mb-4">
        <TopHabitaciones />
        <div style={{ flex: 1, marginLeft: "10px" }}>
          <ReservasRecientes />
        </div>
      </Row>
    </div>
  );
}
