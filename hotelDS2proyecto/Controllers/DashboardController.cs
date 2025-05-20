using hotelDS2proyecto.Models;
using hotelDS2proyecto.ModelsDTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hotelDS2proyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly Ds2proyectoContext _context;

        public DashboardController(Ds2proyectoContext context)
        {
            _context = context;
        }

        [HttpGet("habitacionesPopulares")]
        public async Task<IActionResult> GetHabitacionesPopulares()
        {
            var datos = await _context.Reservas
                .Include(r => r.IdHabitacionNavigation)
                .GroupBy(r => r.IdHabitacionNavigation.Tipo)
                .Select(g => new {
                    nombreTipoHabitacion = g.Key,
                    cantidadReservas = g.Count()
                })
                .OrderByDescending(g => g.cantidadReservas)
                .Take(5)
                .ToListAsync();

            return Ok(datos);
        }

        [HttpGet("serviciosPopulares")]
        public async Task<IActionResult> GetServiciosPopulares()
        {
            var datos = await _context.Facturas
                .Include(f => f.IdServicioNavigation)
                .GroupBy(f => f.IdServicioNavigation.Nombre)
                .Select(g => new {
                    nombreServicio = g.Key,
                    cantidad = g.Count()
                })
                .OrderByDescending(g => g.cantidad)
                .Take(5)
                .ToListAsync();

            return Ok(datos);
        }
    }

}
