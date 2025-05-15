using hotelDS2proyecto.Models;
using hotelDS2proyecto.ModelsDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hotelDS2proyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagosController : ControllerBase
    {
        private readonly Ds2proyectoContext dbContext;

        public PagosController(Ds2proyectoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        // GET: api/Pagos/Lista
        [HttpGet("Lista")]
        public async Task<IActionResult> Get()
        {
            var lista = await dbContext.Pagos
                .Include(p => p.IdFacturaNavigation)
                    .ThenInclude(f => f.IdReservaNavigation)
                        .ThenInclude(r => r.IdClienteNavigation)
                .Select(p => new PagoDTO
                {
                    IdPago = p.IdPago,
                    FechaPago = p.FechaPago,
                    Monto = p.Monto,
                    MetodoPago = p.MetodoPago,
                    IdFactura = p.IdFactura,
                    NombreCliente = p.IdFacturaNavigation.IdReservaNavigation.IdClienteNavigation.Nombre
                })
                .ToListAsync();

            return Ok(lista);
        }

        // GET: api/Pagos/Obtener/5
        [HttpGet("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var pago = await dbContext.Pagos
                .Include(p => p.IdFacturaNavigation)
                    .ThenInclude(f => f.IdReservaNavigation)
                        .ThenInclude(r => r.IdClienteNavigation)
                .Where(p => p.IdPago == id)
                .Select(p => new PagoDTO
                {
                    IdPago = p.IdPago,
                    FechaPago = p.FechaPago,
                    Monto = p.Monto,
                    MetodoPago = p.MetodoPago,
                    IdFactura = p.IdFactura,
                    NombreCliente = p.IdFacturaNavigation.IdReservaNavigation.IdClienteNavigation.Nombre
                })
                .FirstOrDefaultAsync();

            if (pago == null)
                return NotFound(new { mensaje = "Pago no encontrado" });

            return Ok(pago);
        }

        // POST: api/Pagos/Nuevo
        [HttpPost("Nuevo")]
        public async Task<IActionResult> Create([FromBody] PagoDTO dto)
        {
            var pago = new Pago
            {
                FechaPago = dto.FechaPago,
                Monto = dto.Monto,
                MetodoPago = dto.MetodoPago,
                IdFactura = dto.IdFactura
            };

            dbContext.Pagos.Add(pago);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, new { mensaje = "Pago registrado correctamente" });
        }

        // PUT: api/Pagos/Editar
        [HttpPut("Editar")]
        public async Task<IActionResult> Edit([FromBody] PagoDTO dto)
        {
            var pago = await dbContext.Pagos.FindAsync(dto.IdPago);

            if (pago == null)
                return NotFound(new { mensaje = "Pago no encontrado" });

            pago.FechaPago = dto.FechaPago;
            pago.Monto = dto.Monto;
            pago.MetodoPago = dto.MetodoPago;
            pago.IdFactura = dto.IdFactura;

            await dbContext.SaveChangesAsync();

            return Ok(new { mensaje = "Pago actualizado correctamente" });
        }

        // DELETE: api/Pagos/Eliminar/5
        [HttpDelete("Eliminar/{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var pago = await dbContext.Pagos.FindAsync(id);

            if (pago == null)
                return NotFound(new { mensaje = "Pago no encontrado" });

            dbContext.Pagos.Remove(pago);
            await dbContext.SaveChangesAsync();

            return Ok(new { mensaje = "Pago eliminado correctamente" });
        }
    }
}
