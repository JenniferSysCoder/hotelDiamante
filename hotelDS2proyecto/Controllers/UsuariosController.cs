using hotelDS2proyecto.Models;
using hotelDS2proyecto.Models.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace hotelDS2proyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly Ds2proyectoContext dbContext;

        public UsuariosController(Ds2proyectoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        private string Encriptar(string texto)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(texto);
                byte[] hash = sha256.ComputeHash(bytes);
                return BitConverter.ToString(hash).Replace("-", "");
            }
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Get()
        {
            var listaUsuarios = await dbContext.Usuarios
                .Include(u => u.IdRolNavigation)
                .Include(u => u.IdEmpleadoNavigation)
                .Select(u => new UsuarioDTO
                {
                    IdUsuario = u.IdUsuario,
                    Usuario1 = u.Usuario1,
                    IdRol = u.IdRol,
                    RolNombre = u.IdRolNavigation.Nombre,
                    IdEmpleado = u.IdEmpleado,
                    NombreEmpleado = u.IdEmpleadoNavigation != null
                        ? u.IdEmpleadoNavigation.Nombre + " " + u.IdEmpleadoNavigation.Apellido
                        : null
                }).ToListAsync();

            return Ok(listaUsuarios);
        }

        [HttpGet("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var u = await dbContext.Usuarios
                .Include(u => u.IdEmpleadoNavigation)
                .Include(u => u.IdRolNavigation)
                .Where(u => u.IdUsuario == id)
                .Select(u => new UsuarioDTO
                {
                    IdUsuario = u.IdUsuario,
                    Usuario1 = u.Usuario1,
                    IdRol = u.IdRol,
                    RolNombre = u.IdRolNavigation.Nombre,
                    IdEmpleado = u.IdEmpleado,
                    NombreEmpleado = u.IdEmpleadoNavigation != null
                        ? u.IdEmpleadoNavigation.Nombre + " " + u.IdEmpleadoNavigation.Apellido
                        : null
                }).FirstOrDefaultAsync();

            if (u == null) return NotFound(new { mensaje = "Usuario no encontrado" });
            return Ok(u);
        }

        [HttpPost("Nuevo")]
        public async Task<IActionResult> Nuevo([FromBody] UsuarioDTO dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Usuario1) || string.IsNullOrEmpty(dto.Contrasena) || dto.IdRol == 0)
                return BadRequest(new { mensaje = "Usuario, contraseña y rol son obligatorios" });

            bool existe = await dbContext.Usuarios.AnyAsync(u => u.Usuario1 == dto.Usuario1);
            if (existe)
                return Conflict(new { mensaje = "El usuario ya existe" });

            var rol = await dbContext.Roles.FindAsync(dto.IdRol);
            if (rol == null)
                return BadRequest(new { mensaje = "El rol asignado no existe" });

            var usuario = new Usuario
            {
                Usuario1 = dto.Usuario1,
                Contrasena = Encriptar(dto.Contrasena),
                IdRol = dto.IdRol,
                IdEmpleado = dto.IdEmpleado,
                IdRolNavigation = rol
            };

            try
            {
                await dbContext.Usuarios.AddAsync(usuario);
                await dbContext.SaveChangesAsync();
                return Ok(new { mensaje = "Usuario creado correctamente" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor" });
            }
        }

        [HttpPut("Editar")]
        public async Task<IActionResult> Editar([FromBody] UsuarioDTO dto)
        {
            var usuarioBD = await dbContext.Usuarios.FirstOrDefaultAsync(u => u.IdUsuario == dto.IdUsuario);
            if (usuarioBD == null) return NotFound(new { mensaje = "Usuario no encontrado" });

            var rol = await dbContext.Roles.FindAsync(dto.IdRol);
            if (rol == null)
                return BadRequest(new { mensaje = "El rol asignado no existe" });

            usuarioBD.Usuario1 = dto.Usuario1;
            usuarioBD.IdRol = dto.IdRol;
            usuarioBD.IdRolNavigation = rol;  // navegación para evitar errores
            usuarioBD.IdEmpleado = dto.IdEmpleado;

            if (!string.IsNullOrEmpty(dto.Contrasena))
            {
                usuarioBD.Contrasena = Encriptar(dto.Contrasena);
            }

            await dbContext.SaveChangesAsync();
            return Ok(new { mensaje = "Usuario actualizado correctamente" });
        }



        [HttpDelete("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var usuario = await dbContext.Usuarios.FirstOrDefaultAsync(u => u.IdUsuario == id);
            if (usuario == null)
                return NotFound(new { mensaje = "Usuario no encontrado" });

            dbContext.Usuarios.Remove(usuario);
            await dbContext.SaveChangesAsync();
            return Ok(new { mensaje = "ok" });
        }
    }
}
