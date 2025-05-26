using hotelDS2proyecto.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hotelDS2proyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalendarioController : ControllerBase
    {
        private readonly Ds2proyectoContext dbContext;

        public CalendarioController(Ds2proyectoContext context)
        {
            dbContext = context;
        }

        /// <summary>
        /// Devuelve los rangos de fechas ocupadas para una habitación específica,
        /// excluyendo reservas canceladas o completadas.
        /// </summary>
        /// <param name="idHabitacion">ID de la habitación</param>
        /// <returns>Lista de objetos con FechaInicio y FechaFin</returns>
        [HttpGet("FechasOcupadas/{idHabitacion:int}")]
        public async Task<IActionResult> ObtenerFechasOcupadas(int idHabitacion)
        {
            var fechasOcupadas = await dbContext.Reservas
                .Where(r => r.IdHabitacion == idHabitacion &&
                            r.Estado != "Cancelada" &&
                            r.Estado != "Completada")
                .Select(r => new
                {
                    FechaInicio = r.FechaInicio.ToString("yyyy-MM-dd"),
                    FechaFin = r.FechaFin.ToString("yyyy-MM-dd")
                })
                .ToListAsync();

            return Ok(fechasOcupadas);
        }
    }
}
