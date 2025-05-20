using hotelDS2proyecto.Models;
using hotelDS2proyecto.ModelsDTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hotelDS2proyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReporteServicioController : ControllerBase
    {
        private readonly Ds2proyectoContext dbContext;

        public ReporteServicioController(Ds2proyectoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet("ServiciosSolicitados")]
        public async Task<IActionResult> GetServiciosMasSolicitados()
        {
            var reporte = await dbContext.Facturas
                .Include(f => f.IdServicioNavigation)
                .Include(f => f.IdReservaNavigation)
                    .ThenInclude(r => r.IdClienteNavigation) 
                .GroupBy(f => f.IdServicioNavigation.Nombre)
                .Select(g => new ReporteServiciosDTO
                {
                    NombreServicio = g.Key,
                    TotalSolicitudes = g.Count(),
                    EmpleadoMasActivo = g
                        .Where(f => f.IdReservaNavigation.IdClienteNavigation != null)
                        .GroupBy(f => f.IdReservaNavigation.IdClienteNavigation.Nombre + " " + f.IdReservaNavigation.IdClienteNavigation.Apellido)
                        .OrderByDescending(eg => eg.Count())
                        .Select(eg => eg.Key)
                        .FirstOrDefault() ?? "No registrado"
                })
                .OrderByDescending(r => r.TotalSolicitudes)
                .ToListAsync();

            return Ok(reporte);
        }
    }
}
