using hotelDS2proyecto.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hotelDS2proyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiciosAdicionalesController : ControllerBase
    {
        private readonly Ds2proyectoContext dbContext;

        public ServiciosAdicionalesController(Ds2proyectoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        // GET: api/ServiciosAdicionales/Lista
        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Get()
        {
            var listaServicios = await dbContext.ServiciosAdicionales.ToListAsync();
            return StatusCode(StatusCodes.Status200OK, listaServicios);
        }

        // GET: api/ServiciosAdicionales/Obtener/5
        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var servicio = await dbContext.ServiciosAdicionales.FirstOrDefaultAsync(e => e.IdServicio == id);
            if (servicio == null)
            {
                return NotFound(new { mensaje = "Servicio no encontrado" });
            }
            return StatusCode(StatusCodes.Status200OK, servicio);
        }

        // POST: api/ServiciosAdicionales/Nuevo
        [HttpPost]
        [Route("Nuevo")]
        public async Task<IActionResult> Nuevo([FromBody] ServiciosAdicionale servicio)
        {
            // Aquí podrías validar si ya existe un servicio con el mismo nombre, por ejemplo
            var servicioExistente = await dbContext.ServiciosAdicionales
                .FirstOrDefaultAsync(s => s.Nombre == servicio.Nombre);

            if (servicioExistente != null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, new { mensaje = "Ya existe un servicio con el mismo nombre." });
            }

            await dbContext.ServiciosAdicionales.AddAsync(servicio);
            await dbContext.SaveChangesAsync();
            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Servicio adicional guardado exitosamente" });
        }

        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] ServiciosAdicionale servicio)
        {
            try
            {
                var servicioExistente = await dbContext.ServiciosAdicionales
                    .AsNoTracking() // ← importante si usas Update()
                    .FirstOrDefaultAsync(s => s.IdServicio == servicio.IdServicio);

                if (servicioExistente == null)
                {
                    return NotFound(new { mensaje = "Servicio no encontrado" });
                }

                dbContext.ServiciosAdicionales.Update(servicio);
                await dbContext.SaveChangesAsync();

                return Ok(new { mensaje = "Servicio adicional actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error interno del servidor",
                    detalle = ex.Message,
                    stack = ex.StackTrace
                });
            }
        }

        // DELETE: api/ServiciosAdicionales/Eliminar/5
        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var servicio = await dbContext.ServiciosAdicionales.FirstOrDefaultAsync(s => s.IdServicio == id);
            if (servicio == null)
            {
                return NotFound(new { mensaje = "Servicio no encontrado" });
            }

            dbContext.ServiciosAdicionales.Remove(servicio);
            await dbContext.SaveChangesAsync();
            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Servicio adicional eliminado correctamente" });
        }
    }
}
