using hotelDS2proyecto.Models;
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

        // =========================================
        // LISTA
        // =========================================
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

        // =========================================
        // OBTENER
        // =========================================
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

        // =========================================
        // PRECHECK DUPLICADOS POR RESERVA (opcional para frontend)
        // GET: api/Facturas/ExistePorReserva/5?excluirId=10
        // =========================================
        [HttpGet("ExistePorReserva/{idReserva:int}")]
        public async Task<ActionResult<bool>> ExistePorReserva(int idReserva, [FromQuery] int? excluirId)
        {
            bool existe = await dbContext.Facturas
                .AnyAsync(f => f.IdReserva == idReserva && (!excluirId.HasValue || f.IdFactura != excluirId.Value));
            return Ok(existe);
        }

        // =========================================
        // CALCULAR TOTAL (usado por el frontend)
        // GET: api/Facturas/CalcularTotal?idReserva=1&idServicio=2
        // =========================================
        [HttpGet("CalcularTotal")]
        public async Task<IActionResult> CalcularTotal([FromQuery] int idReserva, [FromQuery] int idServicio)
        {
            var reserva = await dbContext.Reservas
                .Include(r => r.IdHabitacionNavigation)
                .Include(r => r.IdClienteNavigation)
                .FirstOrDefaultAsync(r => r.IdReserva == idReserva);

            if (reserva == null)
                return NotFound(new { mensaje = "Reserva no encontrada" });

            var servicio = await dbContext.ServiciosAdicionales.FindAsync(idServicio);
            if (servicio == null)
                return NotFound(new { mensaje = "Servicio no encontrado" });

            int dias = (reserva.FechaFin - reserva.FechaInicio).Days;
            if (dias <= 0) dias = 1;

            decimal totalHabitacion = reserva.IdHabitacionNavigation.PrecioNoche * dias;
            decimal total = totalHabitacion + servicio.Precio;

            return Ok(new
            {
                totalCalculado = total,
                numeroHabitacion = reserva.IdHabitacionNavigation.Numero ?? "N/A",
                nombreCliente = reserva.IdClienteNavigation.Nombre,
                nombreServicio = servicio.Nombre
            });
        }

        // =========================================
        // CREAR (con validación anti-duplicados por reserva)
        // POST: api/Facturas/Nueva
        // =========================================
        [HttpPost("Nueva")]
        public async Task<IActionResult> Create([FromBody] FacturaDTO dto)
        {
            // ❗ Regla: 1 factura por reserva
            var duplicada = await dbContext.Facturas.AnyAsync(f => f.IdReserva == dto.IdReserva);
            if (duplicada)
                return Conflict("Ya existe una factura para esta reserva.");

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
                FechaEmision = DateTime.Now, // o dto.FechaEmision si prefieres
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

        // =========================================
        // EDITAR (con validación anti-duplicados por reserva)
        // PUT: api/Facturas/Editar
        // =========================================
        [HttpPut("Editar")]
        public async Task<IActionResult> Edit([FromBody] FacturaDTO dto)
        {
            var factura = await dbContext.Facturas.FindAsync(dto.IdFactura);
            if (factura == null)
                return NotFound(new { mensaje = "Factura no encontrada" });

            // ❗ Evitar mover la factura a una reserva que ya tiene factura
            var hayOtra = await dbContext.Facturas
                .AnyAsync(f => f.IdReserva == dto.IdReserva && f.IdFactura != dto.IdFactura);
            if (hayOtra)
                return Conflict("Ya existe otra factura para esta reserva.");

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

            factura.FechaEmision = dto.FechaEmision; // o mantener la original
            factura.Total = total;
            factura.IdServicio = dto.IdServicio;
            factura.IdReserva = dto.IdReserva;

            await dbContext.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Factura actualizada correctamente",
                totalCalculado = total,
                numeroHabitacion = reserva.IdHabitacionNavigation.Numero ?? "N/A",
                nombreCliente = reserva.IdClienteNavigation.Nombre,
                nombreServicio = servicio.Nombre
            });
        }

        // =========================================
        // ELIMINAR
        // =========================================
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
