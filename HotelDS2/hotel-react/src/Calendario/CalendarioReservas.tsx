import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';



// Interfaces
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
  display: "background"; // Muestra solo como fondo
}

const CalendarioReservas: React.FC = () => {
  const [habitaciones, setHabitaciones] = useState<HabitacionSimple[]>([]);
  const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);
  const [eventos, setEventos] = useState<EventoReserva[]>([]);

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
      fetch(`https://localhost:7287/api/Calendario/FechasOcupadas/${idSeleccionado}`)
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
              color: "red",
              display: "background",
            };
          });
          setEventos(eventosOcupados);
        })
        .catch((error) => {
          console.error("Error cargando fechas ocupadas:", error);
          setEventos([]);
        });
    } else {
      setEventos([]);
    }
  }, [idSeleccionado]);

  return (
    <div className="container mt-4">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-center mb-4">Calendario de Reservas</h2>

        <div className="mb-3">
          <label className="form-label fw-bold">Seleccionar Habitación:</label>
          <select
            className="form-select"
            value={idSeleccionado ?? ""}
            onChange={(e) =>
              setIdSeleccionado(e.target.value ? Number(e.target.value) : null)
            }
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

        {/* Leyenda con punto rojo */}
        <div className="mb-3 d-flex align-items-center">
          <div
            style={{
              width: 15,
              height: 15,
              backgroundColor: "red",
              borderRadius: "50%",
              marginRight: 8,
            }}
          />
          <span>Ocupada</span>
        </div>

        <FullCalendar
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
        />
      </div>
    </div>
  );
};

export default CalendarioReservas;
