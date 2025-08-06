using hotelDS2proyecto.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace hotelDS2proyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly Ds2proyectoContext dbContext;

        public RolesController(Ds2proyectoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        // GET: api/Roles/Lista
        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Get()
        {
            var listaRoles = await dbContext.Roles
                .Include(r => r.RolPermisos) // incluye permisos asociados si quieres
                .ToListAsync();

            return StatusCode(StatusCodes.Status200OK, listaRoles);
        }

        // GET: api/Roles/Obtener/5
        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var rol = await dbContext.Roles
                .Include(r => r.RolPermisos)
                .FirstOrDefaultAsync(r => r.IdRol == id);

            if (rol == null)
                return NotFound(new { mensaje = "Rol no encontrado" });

            return StatusCode(StatusCodes.Status200OK, rol);
        }

        // POST: api/Roles/Nuevo
        [HttpPost]
        [Route("Nuevo")]
        public async Task<IActionResult> Nuevo([FromBody] Role rol)
        {
            // Validar que no exista un rol con el mismo nombre
            var existeRol = await dbContext.Roles.AnyAsync(r => r.Nombre == rol.Nombre);
            if (existeRol)
                return StatusCode(StatusCodes.Status400BadRequest, new { mensaje = "El nombre del rol ya existe." });

            await dbContext.Roles.AddAsync(rol);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Rol creado correctamente." });
        }

        // PUT: api/Roles/Editar
        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] Role rol)
        {
            var rolExistente = await dbContext.Roles.FirstOrDefaultAsync(r => r.IdRol == rol.IdRol);
            if (rolExistente == null)
                return NotFound(new { mensaje = "Rol no encontrado" });

            // Actualizar propiedades (puedes agregar más validaciones si quieres)
            rolExistente.Nombre = rol.Nombre;
            rolExistente.Descripcion = rol.Descripcion;

            dbContext.Roles.Update(rolExistente);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Rol actualizado correctamente." });
        }

        // DELETE: api/Roles/Eliminar/5
        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var rol = await dbContext.Roles.FirstOrDefaultAsync(r => r.IdRol == id);
            if (rol == null)
                return NotFound(new { mensaje = "Rol no encontrado" });

            // Antes de eliminar, ideal validar que no tenga usuarios asignados
            var usuariosAsignados = await dbContext.Usuarios.AnyAsync(u => u.IdRol == id);
            if (usuariosAsignados)
                return StatusCode(StatusCodes.Status400BadRequest, new { mensaje = "No se puede eliminar el rol porque tiene usuarios asignados." });

            dbContext.Roles.Remove(rol);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Rol eliminado correctamente." });
        }

        [HttpGet]
        [Route("ObtenerConPermisos/{id:int}")]
        public async Task<IActionResult> ObtenerConPermisos(int id)
        {
            var rol = await dbContext.Roles
                .Include(r => r.RolPermisos)
                    .ThenInclude(rp => rp.IdPermisoNavigation)
                .FirstOrDefaultAsync(r => r.IdRol == id);

            if (rol == null)
                return NotFound(new { mensaje = "Rol no encontrado" });

            var result = new
            {
                rol.IdRol,
                rol.Nombre,
                rol.Descripcion,
                PermisosAsignados = rol.RolPermisos.Select(rp => new
                {
                    rp.IdPermiso,
                    rp.IdPermisoNavigation.Nombre,
                    rp.IdPermisoNavigation.Descripcion
                }).ToList()
            };

            return Ok(result);
        }
    }
}

