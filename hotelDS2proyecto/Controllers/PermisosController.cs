using hotelDS2proyecto.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace hotelDS2proyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermisosController : ControllerBase
    {
        private readonly Ds2proyectoContext dbContext;

        public PermisosController(Ds2proyectoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        // GET: api/Permisos/Lista
        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Get()
        {
            var listaPermisos = await dbContext.Permisos.ToListAsync();
            return StatusCode(StatusCodes.Status200OK, listaPermisos);
        }

        // GET: api/Permisos/Obtener/5
        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var permiso = await dbContext.Permisos.FirstOrDefaultAsync(p => p.IdPermiso == id);
            if (permiso == null)
                return NotFound(new { mensaje = "Permiso no encontrado" });

            return StatusCode(StatusCodes.Status200OK, permiso);
        }

        // POST: api/Permisos/Nuevo
        [HttpPost]
        [Route("Nuevo")]
        public async Task<IActionResult> Nuevo([FromBody] Permiso permiso)
        {
            var existePermiso = await dbContext.Permisos.AnyAsync(p => p.Nombre == permiso.Nombre);
            if (existePermiso)
                return StatusCode(StatusCodes.Status400BadRequest, new { mensaje = "El nombre del permiso ya existe." });

            await dbContext.Permisos.AddAsync(permiso);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Permiso creado correctamente." });
        }

        // PUT: api/Permisos/Editar
        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] Permiso permiso)
        {
            var permisoExistente = await dbContext.Permisos.FirstOrDefaultAsync(p => p.IdPermiso == permiso.IdPermiso);
            if (permisoExistente == null)
                return NotFound(new { mensaje = "Permiso no encontrado" });

            permisoExistente.Nombre = permiso.Nombre;
            permisoExistente.Descripcion = permiso.Descripcion;

            dbContext.Permisos.Update(permisoExistente);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Permiso actualizado correctamente." });
        }

        // DELETE: api/Permisos/Eliminar/5
        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var permiso = await dbContext.Permisos.FirstOrDefaultAsync(p => p.IdPermiso == id);
            if (permiso == null)
                return NotFound(new { mensaje = "Permiso no encontrado" });

            // Antes de eliminar, verificar si el permiso está asignado a algún rol
            var estaAsignado = await dbContext.RolPermisos.AnyAsync(rp => rp.IdPermiso == id);
            if (estaAsignado)
                return StatusCode(StatusCodes.Status400BadRequest, new { mensaje = "No se puede eliminar el permiso porque está asignado a uno o más roles." });

            dbContext.Permisos.Remove(permiso);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Permiso eliminado correctamente." });
        }
    }
}
