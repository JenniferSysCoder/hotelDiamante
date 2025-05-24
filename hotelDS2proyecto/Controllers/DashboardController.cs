﻿using hotelDS2proyecto.Models;
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
            var totalClientes = await _context.Clientes.CountAsync();
            return Ok(new { total = totalClientes });
        }

        [HttpGet("habitacionesDisponibles")]
        public async Task<IActionResult> GetHabitacionesDisponibles()
        {
            var total = await _context.Habitaciones
                .CountAsync(h => h.Estado == "Disponible");

            return Ok(new { total });
        }

        [HttpGet("totalServicios")]
        public async Task<IActionResult> GetTotalServicios()
        {
            var total = await _context.ServiciosAdicionales.CountAsync();
            return Ok(new { total });
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

            // Ahora que los datos están en memoria, puedes formatear
            var datos = datosRaw.Select(d => new
            {
                mes = $"{d.Mes:D2}/{d.Año}", // Ej. 05/2024
                cantidadReservas = d.Cantidad
            });

            return Ok(datos);
        }


    }

}
