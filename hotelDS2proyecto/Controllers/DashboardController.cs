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

        // GET: api/Dashboard/ganancias/resumen?from=2025-01-01&to=2025-01-31
        [HttpGet("ganancias/resumen")]
        public async Task<IActionResult> GetGananciasResumen([FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            // Rango por defecto: último mes
            var desde = (from ?? DateTime.Today.AddMonths(-1)).Date;
            var hasta = (to ?? DateTime.Today).Date.AddDays(1).AddTicks(-1); // inclusivo al día

            // Emitidos (por FechaEmision en Facturas)
            var emitidos = await _context.Facturas
                .Where(f => f.FechaEmision >= desde && f.FechaEmision <= hasta)
                .SumAsync(f => (decimal?)f.Total) ?? 0m;

            var cantidadFacturas = await _context.Facturas
                .CountAsync(f => f.FechaEmision >= desde && f.FechaEmision <= hasta);

            // Cobrados (por FechaPago en Pagos)
            var cobrados = await _context.Pagos
                .Where(p => p.FechaPago >= desde && p.FechaPago <= hasta)
                .SumAsync(p => (decimal?)p.Monto) ?? 0m;

            var pendientes = emitidos - cobrados;
            if (pendientes < 0) pendientes = 0;

            return Ok(new
            {
                ingresosEmitidos = emitidos,
                ingresosCobrados = cobrados,
                pendientesCobro = pendientes,
                cantidadFacturas,
                ticketPromedio = cantidadFacturas > 0 ? Math.Round(emitidos / cantidadFacturas, 2) : 0m,
                desde,
                hasta
            });
        }

        // GET: api/Dashboard/ganancias/serie?from=2025-01-01&to=2025-03-31&groupBy=month
        [HttpGet("ganancias/serie")]
        public async Task<IActionResult> GetGananciasSerie([FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] string? groupBy = "month")
        {
            var desde = (from ?? DateTime.Today.AddMonths(-3)).Date;
            var hasta = (to ?? DateTime.Today).Date.AddDays(1).AddTicks(-1);
            var gb = (groupBy ?? "month").ToLowerInvariant();
            if (gb != "day" && gb != "month") gb = "month";

            if (gb == "day")
            {
                var emit = await _context.Facturas
                    .Where(f => f.FechaEmision >= desde && f.FechaEmision <= hasta)
                    .GroupBy(f => f.FechaEmision.Date)
                    .Select(g => new { Clave = g.Key, Emitido = g.Sum(x => (decimal)x.Total) })
                    .ToListAsync();

                var cob = await _context.Pagos
                    .Where(p => p.FechaPago >= desde && p.FechaPago <= hasta)
                    .GroupBy(p => p.FechaPago.Date)
                    .Select(g => new { Clave = g.Key, Cobrado = g.Sum(x => (decimal)x.Monto) })
                    .ToListAsync();

                // Merge por fecha
                var mapa = new SortedDictionary<DateTime, (decimal Emitido, decimal Cobrado)>();
                foreach (var e in emit) mapa[e.Clave] = (e.Emitido, 0m);
                foreach (var c in cob)
                {
                    if (mapa.TryGetValue(c.Clave, out var val)) mapa[c.Clave] = (val.Emitido, val.Cobrado + c.Cobrado);
                    else mapa[c.Clave] = (0m, c.Cobrado);
                }

                var puntos = mapa.Select(kv => new
                {
                    clave = kv.Key.ToString("yyyy-MM-dd"),
                    emitido = kv.Value.Emitido,
                    cobrado = kv.Value.Cobrado
                }).ToList();

                return Ok(new { groupBy = "day", puntos });
            }
            else
            {
                var emit = await _context.Facturas
                    .Where(f => f.FechaEmision >= desde && f.FechaEmision <= hasta)
                    .GroupBy(f => new { f.FechaEmision.Year, f.FechaEmision.Month })
                    .Select(g => new { g.Key.Year, g.Key.Month, Emitido = g.Sum(x => (decimal)x.Total) })
                    .ToListAsync();

                var cob = await _context.Pagos
                    .Where(p => p.FechaPago >= desde && p.FechaPago <= hasta)
                    .GroupBy(p => new { p.FechaPago.Year, p.FechaPago.Month })
                    .Select(g => new { g.Key.Year, g.Key.Month, Cobrado = g.Sum(x => (decimal)x.Monto) })
                    .ToListAsync();

                var mapa = new SortedDictionary<string, (decimal Emitido, decimal Cobrado)>();
                foreach (var e in emit)
                {
                    var key = $"{e.Year:D4}-{e.Month:D2}";
                    mapa[key] = (e.Emitido, 0m);
                }
                foreach (var c in cob)
                {
                    var key = $"{c.Year:D4}-{c.Month:D2}";
                    if (mapa.TryGetValue(key, out var val)) mapa[key] = (val.Emitido, val.Cobrado + c.Cobrado);
                    else mapa[key] = (0m, c.Cobrado);
                }

                var puntos = mapa.Select(kv => new
                {
                    clave = kv.Key,
                    emitido = kv.Value.Emitido,
                    cobrado = kv.Value.Cobrado
                }).ToList();

                return Ok(new { groupBy = "month", puntos });
            }
        }

        // GET: api/Dashboard/ganancias/por-servicio?from=...&to=...
        [HttpGet("ganancias/por-servicio")]
        public async Task<IActionResult> GetGananciasPorServicio([FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var desde = (from ?? DateTime.Today.AddMonths(-1)).Date;
            var hasta = (to ?? DateTime.Today).Date.AddDays(1).AddTicks(-1);

            var data = await _context.Facturas
                .Include(f => f.IdServicioNavigation)
                .Where(f => f.FechaEmision >= desde && f.FechaEmision <= hasta)
                .GroupBy(f => f.IdServicioNavigation.Nombre)
                .Select(g => new
                {
                    servicio = g.Key,
                    totalEmitido = g.Sum(x => (decimal)x.Total),
                    cantidad = g.Count(),
                    ticketPromedio = g.Count() > 0 ? Math.Round(g.Sum(x => (decimal)x.Total) / g.Count(), 2) : 0m
                })
                .OrderByDescending(x => x.totalEmitido)
                .ToListAsync();

            return Ok(data);
        }




    }

}
