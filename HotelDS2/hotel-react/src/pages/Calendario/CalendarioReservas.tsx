import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

interface HabitacionSimple {
  idHabitacion: number;
  numero: string;
}

interface EventoReserva {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  display: "background";
}

const CalendarioReservas: React.FC = () => {
  const [habitaciones, setHabitaciones] = useState<HabitacionSimple[]>([]);
  const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);
  const [eventos, setEventos] = useState<EventoReserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    fetch("https://localhost:7287/api/Habitaciones/Lista")
      .then((res) => res.json())
      .then((data) => {
        const rooms = data.map((h: any) => ({
          idHabitacion: h.idHabitacion,
          numero: h.numero,
        }));
        setHabitaciones(rooms);
      })
      .catch(() => setHabitaciones([]));
  }, []);

  useEffect(() => {
    if (idSeleccionado === null) {
      setEventos([]);
      return;
    }

    setLoading(true);
    fetch(`https://localhost:7287/api/Calendario/FechasOcupadas/${idSeleccionado}`)
      .then((res) => res.json())
      .then((fechas: { fechaInicio: string; fechaFin: string }[]) => {
        const eventos = fechas.map((r, i) => {
          const finPlusOne = new Date(r.fechaFin);
          finPlusOne.setDate(finPlusOne.getDate() + 1);
          return {
            id: `evento-${i}`,
            title: "Ocupado",
            start: r.fechaInicio,
            end: finPlusOne.toISOString().split("T")[0],
            color: "#d32f2f",
            display: "background" as "background",
          };
        });
        setEventos(eventos);
      })
      .catch(() => setEventos([]))
      .finally(() => setLoading(false));
  }, [idSeleccionado]);

  const buscarEntreFechas = () => {
    if (fechaInicio && calendarRef.current) {
      calendarRef.current.getApi().gotoDate(fechaInicio);
    }
  };

  return (
    <div className="container py-5">
      <div
        className="bg-white p-4 rounded-4 shadow-sm mx-auto"
        style={{ maxWidth: "1100px", border: "1px solid #dee2e6" }}
      >
        <div className="d-flex align-items-center gap-3 mb-4">
          <i className="bi bi-calendar-check text-primary" style={{ fontSize: "1.8rem" }} />
          <h4 className="fw-bold text-dark mb-0">Calendario de Reservas</h4>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Habitación</label>
            <select
              className="form-select rounded-pill"
              value={idSeleccionado ?? ""}
              onChange={(e) =>
                setIdSeleccionado(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="" disabled>
                Selecciona una habitación
              </option>
              {habitaciones.map((h) => (
                <option key={h.idHabitacion} value={h.idHabitacion}>
                  Habitación {h.numero}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label fw-semibold">Desde</label>
            <input
              type="date"
              className="form-control rounded-pill"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-semibold">Hasta</label>
            <input
              type="date"
              className="form-control rounded-pill"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button
              className="btn btn-primary w-100 rounded-pill fw-semibold"
              onClick={buscarEntreFechas}
            >
              Buscar
            </button>
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-end">
          <span className="d-flex align-items-center gap-2 bg-light px-3 py-2 rounded-pill text-danger fw-semibold">
            <span
              style={{
                width: 12,
                height: 12,
                backgroundColor: "#d32f2f",
                borderRadius: "50%",
              }}
            />
            Ocupada
          </span>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status" />
            <p className="mt-3 fw-semibold text-danger">Cargando reservas...</p>
          </div>
        ) : (
          <div className="border rounded-4 p-3 bg-white">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin, bootstrap5Plugin]}
              initialView="dayGridMonth"
              events={eventos}
              height="auto"
              locale="es"
              themeSystem="bootstrap5"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth",
              }}
              dayMaxEvents={2}
              eventDisplay="block"
              eventColor="#d32f2f"
              eventBackgroundColor="#d32f2f"
              eventBorderColor="#d32f2f"
              eventTextColor="#fff"
              displayEventTime={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarioReservas;
