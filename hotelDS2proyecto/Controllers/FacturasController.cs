﻿using hotelDS2proyecto.Models;
using hotelDS2proyecto.ModelsDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hotelDS2proyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacturasController : ControllerBase
    {
        private readonly Ds2proyectoContext dbContext;

        public FacturasController(Ds2proyectoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet("Lista")]
        public async Task<IActionResult> Get()
        {
            var lista = await dbContext.Facturas
                .Include(f => f.IdServicioNavigation)
                .Include(f => f.IdReservaNavigation)
                    .ThenInclude(r => r.IdClienteNavigation)
                .Include(f => f.IdReservaNavigation)
                    .ThenInclude(r => r.IdHabitacionNavigation)
                .Select(f => new FacturaDTO
                {
                    IdFactura = f.IdFactura,
                    FechaEmision = f.FechaEmision,
                    Total = f.Total,
                    IdServicio = f.IdServicio,
                    IdReserva = f.IdReserva,
                    NombreServicio = f.IdServicioNavigation.Nombre,
                    NombreCliente = f.IdReservaNavigation.IdClienteNavigation.Nombre,
                    NumeroHabitacion = f.IdReservaNavigation.IdHabitacionNavigation.Numero ?? "N/A"
                })
                .ToListAsync();

            return Ok(lista);
        }


        [HttpGet("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var factura = await dbContext.Facturas
                .Include(f => f.IdServicioNavigation)
                .Include(f => f.IdReservaNavigation)
                    .ThenInclude(r => r.IdClienteNavigation)
                .Include(f => f.IdReservaNavigation)
                    .ThenInclude(r => r.IdHabitacionNavigation)
                .Where(f => f.IdFactura == id)
                .Select(f => new FacturaDTO
                {
                    IdFactura = f.IdFactura,
                    FechaEmision = f.FechaEmision,
                    Total = f.Total,
                    IdServicio = f.IdServicio,
                    IdReserva = f.IdReserva,
                    NombreServicio = f.IdServicioNavigation.Nombre,
                    NombreCliente = f.IdReservaNavigation.IdClienteNavigation.Nombre,
                    NumeroHabitacion = f.IdReservaNavigation.IdHabitacionNavigation.Numero ?? "N/A"
                })
                .FirstOrDefaultAsync();

            if (factura == null)
                return NotFound(new { mensaje = "Factura no encontrada" });

            return Ok(factura);
        }

        // POST: api/Facturas/Nueva
        [HttpPost("Nueva")]
        public async Task<IActionResult> Create([FromBody] FacturaDTO dto)
        {
            var reserva = await dbContext.Reservas
                .Include(r => r.IdHabitacionNavigation)
                .Include(r => r.IdClienteNavigation)
                .FirstOrDefaultAsync(r => r.IdReserva == dto.IdReserva);

            if (reserva == null)
                return NotFound(new { mensaje = "Reserva no encontrada" });

            var servicio = await dbContext.ServiciosAdicionales.FindAsync(dto.IdServicio);
            if (servicio == null)
                return NotFound(new { mensaje = "Servicio no encontrado" });

            int dias = (reserva.FechaFin - reserva.FechaInicio).Days;
            if (dias <= 0) dias = 1;

            decimal totalHabitacion = reserva.IdHabitacionNavigation.PrecioNoche * dias;
            decimal total = totalHabitacion + servicio.Precio;

            var factura = new Factura
            {
                FechaEmision = DateTime.Now,
                Total = total,
                IdServicio = dto.IdServicio,
                IdReserva = dto.IdReserva
            };

            dbContext.Facturas.Add(factura);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, new
            {
                mensaje = "Factura registrada correctamente",
                totalCalculado = total,
                numeroHabitacion = reserva.IdHabitacionNavigation.Numero ?? "N/A",
                nombreCliente = reserva.IdClienteNavigation.Nombre,
                nombreServicio = servicio.Nombre
            });
        }

        [HttpPut("Editar")]
        public async Task<IActionResult> Edit([FromBody] FacturaDTO dto)
        {
            var factura = await dbContext.Facturas.FindAsync(dto.IdFactura);
            if (factura == null)
                return NotFound(new { mensaje = "Factura no encontrada" });

            var reserva = await dbContext.Reservas
                .Include(r => r.IdHabitacionNavigation)
                .FirstOrDefaultAsync(r => r.IdReserva == dto.IdReserva);
            if (reserva == null)
                return NotFound(new { mensaje = "Reserva no encontrada" });

            var servicio = await dbContext.ServiciosAdicionales.FindAsync(dto.IdServicio);
            if (servicio == null)
                return NotFound(new { mensaje = "Servicio no encontrado" });

            // Calcular días
            int dias = (reserva.FechaFin - reserva.FechaInicio).Days;
            if (dias <= 0) dias = 1;

            decimal totalHabitacion = reserva.IdHabitacionNavigation.PrecioNoche * dias;
            decimal total = totalHabitacion + servicio.Precio;

            // Actualizamos la factura con total calculado
            factura.FechaEmision = dto.FechaEmision;
            factura.Total = total;
            factura.IdServicio = dto.IdServicio;
            factura.IdReserva = dto.IdReserva;

            await dbContext.SaveChangesAsync();

            return Ok(new { mensaje = "Factura actualizada correctamente", totalCalculado = total });
        }



        // DELETE: api/Facturas/Eliminar/5
        [HttpDelete("Eliminar/{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var factura = await dbContext.Facturas.FindAsync(id);

            if (factura == null)
                return NotFound(new { mensaje = "Factura no encontrada" });

            dbContext.Facturas.Remove(factura);
            await dbContext.SaveChangesAsync();

            return Ok(new { mensaje = "Factura eliminada correctamente" });
        }
    }
}
