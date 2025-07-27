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
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar habitaciones");
        return res.json();
      })
      .then((data) => {
        const habitacionesSimplificadas = data.map((h: any) => ({
          idHabitacion: h.idHabitacion,
          numero: h.numero,
        }));
        setHabitaciones(habitacionesSimplificadas);
      })
      .catch((error) => {
        console.error("Error cargando habitaciones:", error);
        setHabitaciones([]);
      });
  }, []);

  useEffect(() => {
    if (idSeleccionado !== null) {
      setLoading(true);
      fetch(
        `https://localhost:7287/api/Calendario/FechasOcupadas/${idSeleccionado}`
      )
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar fechas ocupadas");
          return res.json();
        })
        .then((fechas: { fechaInicio: string; fechaFin: string }[]) => {
          const eventosOcupados: EventoReserva[] = fechas.map((r, index) => {
            const fechaFinPlusOne = new Date(r.fechaFin);
            fechaFinPlusOne.setDate(fechaFinPlusOne.getDate() + 1);

            return {
              id: `evento-${index}`,
              title: "Ocupado",
              start: r.fechaInicio,
              end: fechaFinPlusOne.toISOString().split("T")[0],
              color: "#d32f2f",
              display: "background",
            };
          });
          setEventos(eventosOcupados);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error cargando fechas ocupadas:", error);
          setEventos([]);
          setLoading(false);
        });
    } else {
      setEventos([]);
    }
  }, [idSeleccionado]);

  // Buscar entre dos fechas
  const buscarEntreFechas = () => {
    if (fechaInicio && fechaFin && calendarRef.current) {
      calendarRef.current.getApi().gotoDate(fechaInicio);
      // Opcional: podrías resaltar el rango en el calendario, pero FullCalendar no lo hace por defecto.
      // Aquí solo navega al inicio del rango.
    }
  };

  return (
    <div className="container mt-4">
      <div
        className="p-4 rounded shadow"
        style={{
          background: "linear-gradient(135deg, #f8fafc 80%, #e3e3e3 100%)",
          borderRadius: "24px",
          boxShadow: "0 4px 24px #23272f33",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "18px",
            justifyContent: "center",
          }}
        >
          <i className="bi bi-calendar2-week" style={{ fontSize: 32, color: "#b71c1c" }} />
          <h2
            className="mb-0"
            style={{
              fontWeight: "bold",
              color: "#23272f",
              letterSpacing: "1px",
            }}
          >
            Calendario de Reservas
          </h2>
        </div>

        <div className="row mb-4">
          <div className="col-md-4 mb-2 mb-md-0">
            <label className="form-label fw-bold" style={{ color: "#23272f" }}>
              Seleccionar Habitación:
            </label>
            <select
              className="form-select"
              value={idSeleccionado ?? ""}
              onChange={(e) =>
                setIdSeleccionado(e.target.value ? Number(e.target.value) : null)
              }
              style={{
                borderRadius: "12px",
                fontWeight: "500",
                boxShadow: "0 2px 8px #b71c1c11",
                background: "#fff",
              }}
            >
              <option value="" disabled>
                -- Selecciona una habitación --
              </option>
              {habitaciones.map((h) => (
                <option key={h.idHabitacion} value={h.idHabitacion}>
                  Habitación {h.numero}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-8 mb-2 mb-md-0">
            <label className="form-label fw-bold" style={{ color: "#23272f" }}>
              Buscar entre dos fechas:
            </label>
            <div className="d-flex gap-2">
              <input
                type="date"
                className="form-control"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                style={{
                  borderRadius: "12px",
                  fontWeight: "500",
                  background: "#fff",
                  boxShadow: "0 2px 8px #b71c1c11",
                }}
              />
              <input
                type="date"
                className="form-control"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                style={{
                  borderRadius: "12px",
                  fontWeight: "500",
                  background: "#fff",
                  boxShadow: "0 2px 8px #b71c1c11",
                }}
              />
              <button
                className="btn btn-primary"
                onClick={buscarEntreFechas}
                style={{
                  borderRadius: "12px",
                  fontWeight: "bold",
                  boxShadow: "0 2px 8px #1976d222",
                }}
              >
                Ir
              </button>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-12 d-flex align-items-center justify-content-md-end justify-content-start">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#fff",
                borderRadius: "18px",
                padding: "6px 18px",
                boxShadow: "0 2px 8px #b71c1c22",
                fontWeight: "bold",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor: "#d32f2f",
                  borderRadius: "50%",
                  marginRight: 6,
                  border: "2px solid #fff",
                  boxShadow: "0 2px 8px #d32f2f44",
                }}
              />
              <span style={{ color: "#d32f2f" }}>Ocupada</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-danger" role="status" />
            <div className="mt-2" style={{ color: "#b71c1c", fontWeight: "bold" }}>
              Cargando reservas...
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              boxShadow: "0 2px 12px #23272f22",
              padding: "18px",
            }}
          >
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
              contentHeight="auto"
              aspectRatio={1.7}
              displayEventTime={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarioReservas;