using hotelDS2proyecto.Models;
using hotelDS2proyecto.ModelsDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hotelDS2proyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HabitacionesController : ControllerBase
    {
        private readonly Ds2proyectoContext dbContext;

        public HabitacionesController(Ds2proyectoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet("Lista")]
        public async Task<IActionResult> Get()
        {
            var listaHabitaciones = await dbContext.Habitaciones
                .Include(h => h.IdHotelNavigation)
                .Select(h => new HabitacionDTO
                {
                    IdHabitacion = h.IdHabitacion,
                    Numero = h.Numero,
                    Tipo = h.Tipo,
                    PrecioNoche = h.PrecioNoche,
                    IdHotel = h.IdHotel,
                    NombreHotel = h.IdHotelNavigation.Nombre,
                    Estado = dbContext.Reservas.Any(r =>
                                r.IdHabitacion == h.IdHabitacion &&
                                r.Estado != "Cancelada" &&
                                r.Estado != "Completada" &&
                                r.FechaInicio <= DateTime.Now &&
                                r.FechaFin >= DateTime.Now
                            ) ? "Ocupada" : "Disponible"
                })
                .ToListAsync();

            return Ok(listaHabitaciones);
        }


        [HttpGet("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var habitacion = await dbContext.Habitaciones
                .Include(h => h.IdHotelNavigation)
                .FirstOrDefaultAsync(h => h.IdHabitacion == id);

            if (habitacion == null)
                return NotFound(new { mensaje = "Habitación no encontrada" });

            var hayReservaActiva = await dbContext.Reservas.AnyAsync(r =>
                r.IdHabitacion == habitacion.IdHabitacion &&
                r.Estado != "Cancelada" &&
                r.Estado != "Completada" &&
                r.FechaInicio <= DateTime.Now &&
                r.FechaFin >= DateTime.Now
            );

            var habitacionDTO = new HabitacionDTO
            {
                IdHabitacion = habitacion.IdHabitacion,
                Numero = habitacion.Numero,
                Tipo = habitacion.Tipo,
                PrecioNoche = habitacion.PrecioNoche,
                IdHotel = habitacion.IdHotel,
                NombreHotel = habitacion.IdHotelNavigation.Nombre,
                Estado = hayReservaActiva ? "Ocupada" : "Disponible"
            };

            return Ok(habitacionDTO);
        }


        [HttpPost("Nuevo")]
        public async Task<IActionResult> CreateHabitacion([FromBody] HabitacionDTO habitacionDTO)
        {
            if (habitacionDTO == null)
                return BadRequest("Los datos de la habitación no son válidos.");

            bool existeDuplicado = await dbContext.Habitaciones.AnyAsync(h =>
                h.Numero == habitacionDTO.Numero && h.IdHotel == habitacionDTO.IdHotel);

            if (existeDuplicado)
            {
                return BadRequest(new { mensaje = "Ya existe una habitación con ese número en el hotel seleccionado." });
            }

            var habitacion = new Habitacione
            {
                Numero = habitacionDTO.Numero,
                Tipo = habitacionDTO.Tipo,
                PrecioNoche = habitacionDTO.PrecioNoche,
                Estado = habitacionDTO.Estado,
                IdHotel = habitacionDTO.IdHotel
            };

            dbContext.Habitaciones.Add(habitacion);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, new { mensaje = "Habitación guardada correctamente." });
        }


        [HttpPut("Editar")]
        public async Task<IActionResult> Editar([FromBody] HabitacionDTO habitacionDTO)
        {
            var habitacion = await dbContext.Habitaciones.FirstOrDefaultAsync(h => h.IdHabitacion == habitacionDTO.IdHabitacion);

            if (habitacion == null)
                return NotFound(new { mensaje = "Habitación no encontrada" });

            bool existeDuplicado = await dbContext.Habitaciones.AnyAsync(h =>
                h.Numero == habitacionDTO.Numero &&
                h.IdHotel == habitacionDTO.IdHotel &&
                h.IdHabitacion != habitacionDTO.IdHabitacion);

            if (existeDuplicado)
            {
                return BadRequest(new { mensaje = "Ya existe una habitación con ese número en el hotel seleccionado." });
            }

            if (habitacionDTO.Estado == "Ocupada")
            {
                var hayReservaActiva = await dbContext.Reservas.AnyAsync(r =>
                    r.IdHabitacion == habitacionDTO.IdHabitacion &&
                    r.Estado != "Cancelada" &&
                    r.Estado != "Completada" &&
                    r.FechaInicio <= DateTime.Now &&
                    r.FechaFin >= DateTime.Now
                );

                if (!hayReservaActiva)
                {
                    return BadRequest(new
                    {
                        mensaje = "No se puede marcar la habitación como 'Ocupada' si no tiene reservas activas actualmente."
                    });
                }
            }

            habitacion.Numero = habitacionDTO.Numero;
            habitacion.Tipo = habitacionDTO.Tipo;
            habitacion.PrecioNoche = habitacionDTO.PrecioNoche;
            habitacion.Estado = habitacionDTO.Estado;
            habitacion.IdHotel = habitacionDTO.IdHotel;

            await dbContext.SaveChangesAsync();

            return Ok(new { mensaje = "Habitación actualizada correctamente." });
        }

        [HttpDelete("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var habitacion = await dbContext.Habitaciones.FirstOrDefaultAsync(h => h.IdHabitacion == id);

            if (habitacion == null)
                return NotFound(new { mensaje = "Habitación no encontrada" });

            dbContext.Habitaciones.Remove(habitacion);
            await dbContext.SaveChangesAsync();

            return Ok(new { mensaje = "Habitación eliminada correctamente." });
        }
    }
}
