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

        [HttpGet("totalClientes")]
        public async Task<IActionResult> GetTotalClientes()
        {
            var fechaLimite = DateTime.Now.AddYears(-1);

            var clientesActivos = await _context.Reservas
                .Where(r => r.FechaInicio >= fechaLimite)
                .Select(r => r.IdCliente)
                .Distinct()
                .CountAsync();

            var totalClientes = await _context.Clientes.CountAsync();

            var porcentaje = totalClientes > 0
                ? Math.Round((clientesActivos * 100.0) / totalClientes, 2)
                : 0;

            return Ok(new
            {
                totalActivos = clientesActivos,
                total = totalClientes,
                porcentaje
            });
        }


        [HttpGet("habitacionesDisponibles")]
        public async Task<IActionResult> GetHabitacionesDisponibles()
        {
            var disponibles = await _context.Habitaciones.CountAsync(h => h.Estado == "Disponible");
            var total = await _context.Habitaciones.CountAsync();

            double porcentaje = total == 0 ? 0 : (double)disponibles / total * 100;

            return Ok(new
            {
                totalDisponibles = disponibles,
                totalHabitaciones = total,
                porcentaje = Math.Round(porcentaje, 2)
            });
        }


        [HttpGet("totalServicios")]
        public async Task<IActionResult> GetTotalServicios()
        {
            var total = await _context.ServiciosAdicionales.CountAsync();

            // Servicios que aparecen al menos una vez en una factura
            var serviciosUsados = await _context.Facturas
                .Select(f => f.IdServicio)
                .Distinct()
                .CountAsync();

            double porcentaje = total > 0 ? (serviciosUsados * 100.0 / total) : 0;

            return Ok(new
            {
                totalActivos = serviciosUsados,
                total,
                porcentaje = Math.Round(porcentaje, 2)
            });
        }


        [HttpGet("reservasPorMes")]
        public async Task<IActionResult> GetReservasMensuales()
        {
            var datosRaw = await _context.Reservas
                .GroupBy(r => new
                {
                    Año = r.FechaInicio.Year,
                    Mes = r.FechaInicio.Month
                })
                .Select(g => new
                {
                    Año = g.Key.Año,
                    Mes = g.Key.Mes,
                    Cantidad = g.Count()
                })
                .OrderBy(g => g.Año)
                .ThenBy(g => g.Mes)
                .ToListAsync();

            var datos = datosRaw.Select(d => new
            {
                mes = $"{d.Mes:D2}/{d.Año}", 
                cantidadReservas = d.Cantidad
            });

            return Ok(datos);
        }

        [HttpGet("reservasRecientes")]
        public async Task<IActionResult> GetReservasRecientes()
        {
            var reservas = await _context.Reservas
                .Include(r => r.IdClienteNavigation)
                .Include(r => r.IdHabitacionNavigation)
                .OrderByDescending(r => r.FechaInicio)
                .Take(5)
                .Select(r => new
                {
                    cliente = r.IdClienteNavigation.Nombre,
                    habitacion = r.IdHabitacionNavigation.Numero,
                    fecha = r.FechaInicio,
                    estado = r.Estado
                })
                .ToListAsync();

            return Ok(reservas);
        }



    }

}
