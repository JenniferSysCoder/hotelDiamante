using hotelDS2proyecto.Models;
using hotelDS2proyecto.ModelsDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hotelDS2proyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservasController : ControllerBase
    {
        private readonly Ds2proyectoContext dbContext;

        public ReservasController(Ds2proyectoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Get()
        {
            var listaReservas = await dbContext.Reservas
                .Include(r => r.IdClienteNavigation)
                .Include(r => r.IdHabitacionNavigation)
                .Select(r => new ReservaDTO
                {
                    IdReserva = r.IdReserva,
                    FechaInicio = r.FechaInicio,
                    FechaFin = r.FechaFin,
                    Estado = r.Estado,
                    IdCliente = r.IdCliente,
                    IdHabitacion = r.IdHabitacion,
                    NombreCliente = r.IdClienteNavigation.Nombre + " " + r.IdClienteNavigation.Apellido,
                    NumeroHabitacion = r.IdHabitacionNavigation.Numero
                })
                .ToListAsync();

            return Ok(listaReservas);
        }

        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var reserva = await dbContext.Reservas
                .Include(r => r.IdClienteNavigation)
                .Include(r => r.IdHabitacionNavigation)
                .FirstOrDefaultAsync(r => r.IdReserva == id);

            if (reserva == null)
                return NotFound(new { mensaje = "Reserva no encontrada" });

            var dto = new ReservaDTO
            {
                IdReserva = reserva.IdReserva,
                FechaInicio = reserva.FechaInicio,
                FechaFin = reserva.FechaFin,
                Estado = reserva.Estado,
                IdCliente = reserva.IdCliente,
                IdHabitacion = reserva.IdHabitacion,
                NombreCliente = reserva.IdClienteNavigation.Nombre + " " + reserva.IdClienteNavigation.Apellido,
                NumeroHabitacion = reserva.IdHabitacionNavigation.Numero
            };

            return Ok(dto);
        }

        [HttpPost]
        [Route("Nuevo")]
        public async Task<IActionResult> Create([FromBody] ReservaDTO dto)
        {
            if (dto == null)
                return BadRequest(new { mensaje = "Datos inválidos" });

            // Validar si ya existe una reserva activa para la misma habitación en esas fechas
            bool existeConflicto = await dbContext.Reservas.AnyAsync(r =>
                r.IdHabitacion == dto.IdHabitacion &&
                r.Estado == "Reservada" &&
                r.FechaInicio < dto.FechaFin && dto.FechaInicio < r.FechaFin);

            if (existeConflicto)
                return Conflict(new
                {
                    mensaje = "La habitación ya está reservada en esas fechas."
                });

            var reserva = new Reserva
            {
                FechaInicio = dto.FechaInicio,
                FechaFin = dto.FechaFin,
                Estado = "Reservada",
                IdCliente = dto.IdCliente,
                IdHabitacion = dto.IdHabitacion
            };

            dbContext.Reservas.Add(reserva);

            // Cambiar estado habitación a "Ocupada"
            var habitacion = await dbContext.Habitaciones.FindAsync(dto.IdHabitacion);
            if (habitacion != null)
            {
                habitacion.Estado = "Ocupada";
                dbContext.Habitaciones.Update(habitacion);  // Forzar actualización
            }

            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, new { mensaje = "Reserva creada correctamente" });
        }

        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] ReservaDTO dto)
        {
            var reserva = await dbContext.Reservas.FirstOrDefaultAsync(r => r.IdReserva == dto.IdReserva);
            if (reserva == null)
                return NotFound(new { mensaje = "Reserva no encontrada" });

            // Validar estado
            var estadosValidos = new[] { "Reservada", "Cancelada", "Finalizada" };
            if (!estadosValidos.Contains(dto.Estado))
                return BadRequest(new { mensaje = "Estado no válido. Los valores permitidos son: Reservada, Cancelada o Finalizada." });

            // Validar si hay conflicto con otra reserva (misma habitación, traslape de fechas)
            bool conflicto = await dbContext.Reservas.AnyAsync(r =>
                r.IdHabitacion == dto.IdHabitacion &&
                r.IdReserva != dto.IdReserva &&
                r.Estado == "Reservada" &&
                r.FechaInicio < dto.FechaFin && dto.FechaInicio < r.FechaFin);

            if (conflicto)
                return Conflict(new
                {
                    mensaje = "No se puede actualizar la reserva: ya existe otra reserva activa para esa habitación en las fechas seleccionadas."
                });

            reserva.FechaInicio = dto.FechaInicio;
            reserva.FechaFin = dto.FechaFin;
            reserva.Estado = dto.Estado;
            reserva.IdCliente = dto.IdCliente;
            reserva.IdHabitacion = dto.IdHabitacion;

            var habitacion = await dbContext.Habitaciones.FindAsync(dto.IdHabitacion);
            if (habitacion != null)
            {
                if (dto.Estado == "Reservada")
                    habitacion.Estado = "Ocupada";  // Aquí se cambia a "Ocupada" para mantener la consistencia con la DB
                else if (dto.Estado == "Cancelada" || dto.Estado == "Finalizada")
                    habitacion.Estado = "Disponible";
            }

            await dbContext.SaveChangesAsync();

            return Ok(new { mensaje = "Reserva actualizada correctamente" });
        }

        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var reserva = await dbContext.Reservas.FirstOrDefaultAsync(r => r.IdReserva == id);
            if (reserva == null)
                return NotFound(new { mensaje = "Reserva no encontrada" });

            dbContext.Reservas.Remove(reserva);

            var habitacion = await dbContext.Habitaciones.FindAsync(reserva.IdHabitacion);
            if (habitacion != null && reserva.Estado == "Reservada")
            {
                habitacion.Estado = "Disponible";
            }

            await dbContext.SaveChangesAsync();

            return Ok(new { mensaje = "Reserva eliminada correctamente y habitación liberada." });
        }
    }
}
