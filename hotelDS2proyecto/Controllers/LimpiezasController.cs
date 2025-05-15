using hotelDS2proyecto.Models;
using hotelDS2proyecto.ModelsDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hotelDS2proyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LimpiezasController : ControllerBase
    {
        private readonly Ds2proyectoContext dbContext;

        public LimpiezasController(Ds2proyectoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Get()
        {
            var lista = await dbContext.Limpiezas
                .Include(l => l.IdHabitacionNavigation)
                .Include(l => l.IdEmpleadoNavigation)
                .Select(l => new LimpiezaDTO
                {
                    IdLimpieza = l.IdLimpieza,
                    Fecha = l.Fecha,
                    Observaciones = l.Observaciones,
                    IdHabitacion = l.IdHabitacion,
                    NumeroHabitacion = l.IdHabitacionNavigation.Numero,
                    IdEmpleado = l.IdEmpleado,
                    NombreEmpleado = l.IdEmpleadoNavigation.Nombre
                })
                .ToListAsync();

            return Ok(lista);
        }

        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var limpieza = await dbContext.Limpiezas
                .Include(l => l.IdHabitacionNavigation)
                .Include(l => l.IdEmpleadoNavigation)
                .Where(l => l.IdLimpieza == id)
                .Select(l => new LimpiezaDTO
                {
                    IdLimpieza = l.IdLimpieza,
                    Fecha = l.Fecha,
                    Observaciones = l.Observaciones,
                    IdHabitacion = l.IdHabitacion,
                    NumeroHabitacion = l.IdHabitacionNavigation.Numero,
                    IdEmpleado = l.IdEmpleado,
                    NombreEmpleado = l.IdEmpleadoNavigation.Nombre
                })
                .FirstOrDefaultAsync();

            if (limpieza == null)
                return NotFound(new { mensaje = "Limpieza no encontrada" });

            return Ok(limpieza);
        }

        [HttpPost]
        [Route("Nuevo")]
        public async Task<IActionResult> Create([FromBody] LimpiezaDTO dto)
        {
            var limpieza = new Limpieza
            {
                Fecha = dto.Fecha,
                Observaciones = dto.Observaciones,
                IdHabitacion = dto.IdHabitacion,
                IdEmpleado = dto.IdEmpleado
            };

            dbContext.Limpiezas.Add(limpieza);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, new { mensaje = "Limpieza registrada correctamente" });
        }

        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Edit([FromBody] LimpiezaDTO dto)
        {
            var limpieza = await dbContext.Limpiezas.FirstOrDefaultAsync(l => l.IdLimpieza == dto.IdLimpieza);

            if (limpieza == null)
                return NotFound(new { mensaje = "Limpieza no encontrada" });

            limpieza.Fecha = dto.Fecha;
            limpieza.Observaciones = dto.Observaciones;
            limpieza.IdHabitacion = dto.IdHabitacion;
            limpieza.IdEmpleado = dto.IdEmpleado;

            await dbContext.SaveChangesAsync();

            return Ok(new { mensaje = "Limpieza actualizada correctamente" });
        }

        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var limpieza = await dbContext.Limpiezas.FindAsync(id);

            if (limpieza == null)
                return NotFound(new { mensaje = "Limpieza no encontrada" });

            dbContext.Limpiezas.Remove(limpieza);
            await dbContext.SaveChangesAsync();

            return Ok(new { mensaje = "Limpieza eliminada correctamente" });
        }
    }
}

