import { Row } from "reactstrap";
import { ContadorClientes } from "./components/DHTotalClientes";
import { ContadorHabitaciones } from "./components/DHHabitacionesDisponible";
import { ContadorServicios } from "./components/contadorServicios";
import { DashboardHabitaciones } from "./components/DSHabitacion";
import { DashboardServicios } from "./components/DHServicio";
import { DashboardProyeccionReservas } from "./components/DHProyeccionReservas";


export default function AppDashboard() {
  return (
    <div>
      <h2>Resumen General</h2>
      <Row className="mb-4">
        <ContadorClientes />
        <ContadorHabitaciones/>
        <ContadorServicios/>
      </Row>
      <Row>
        <DashboardHabitaciones />
        <DashboardServicios />
      </Row>
      <Row className="mt-4">
  <DashboardProyeccionReservas />
</Row>

    </div>
  );
}