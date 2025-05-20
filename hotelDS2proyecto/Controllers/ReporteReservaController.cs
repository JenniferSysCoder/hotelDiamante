using hotelDS2proyecto.Models;
using hotelDS2proyecto.ModelsDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hotelDS2proyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class ReporteReservaController : ControllerBase
    {
        private readonly Ds2proyectoContext dbContext;

        public ReporteReservaController(Ds2proyectoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        // GET: api/Reportes/Reservas
        [HttpGet("Reservas")]
        public async Task<IActionResult> GetReporteReservas()
        {
            var reservas = await dbContext.Reservas
                .Include(r => r.IdClienteNavigation)
                .Include(r => r.IdHabitacionNavigation)
                .Select(r => new ReporteReservaDTO
                {
                    IdReserva = r.IdReserva,
                    FechaInicio = r.FechaInicio,
                    FechaFin = r.FechaFin,
                    Estado = r.Estado,
                    Nombre = r.IdClienteNavigation.Nombre,
                    Tipo = r.IdHabitacionNavigation.Tipo
                })
                .ToListAsync();

            return Ok(reservas);
        }
    }
}
