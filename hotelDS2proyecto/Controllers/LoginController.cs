using hotelDS2proyecto.Models;
using hotelDS2proyecto.ModelsDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace hotelDS2proyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly Ds2proyectoContext dbContext;

        public LoginController(Ds2proyectoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        // Método para encriptar usando SHA256 en formato hexadecimal
        private string Encriptar(string texto)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(texto);
                byte[] hash = sha256.ComputeHash(bytes);
                return BitConverter.ToString(hash).Replace("-", ""); // HEX
            }
        }

        // POST: api/Login/Validar
        [HttpPost("Validar")]
        public async Task<IActionResult> Validar([FromBody] LoginDTO dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Usuario1) || string.IsNullOrEmpty(dto.Contrasena))
                return BadRequest(new { mensaje = "Usuario y contraseña son obligatorios." });

            string passEncriptada = Encriptar(dto.Contrasena);

            var usuario = await dbContext.Usuarios
                .Include(u => u.IdRolNavigation) // 👈 para obtener el nombre del rol
                .FirstOrDefaultAsync(u => u.Usuario1 == dto.Usuario1 && u.Contrasena == passEncriptada);

            if (usuario == null)
                return Unauthorized(new { mensaje = "Credenciales incorrectas." });

            // 👇 Se incluye el nombre del rol en la respuesta
            return Ok(new
            {
                mensaje = "Login exitoso",
                usuario = usuario.Usuario1,
                rol = usuario.IdRolNavigation?.Nombre  // importante para el frontend
            });
        }


        // POST: api/Login/Registrar
        [HttpPost("Registrar")]
        public async Task<IActionResult> Registrar([FromBody] LoginDTO dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Usuario1) || string.IsNullOrEmpty(dto.Contrasena))
                return BadRequest(new { mensaje = "Usuario y contraseña son obligatorios." });

            bool existe = await dbContext.Usuarios.AnyAsync(u => u.Usuario1 == dto.Usuario1);
            if (existe)
                return Conflict(new { mensaje = "El usuario ya existe." });

            var nuevoUsuario = new Usuario
            {
                Usuario1 = dto.Usuario1,
                Contrasena = Encriptar(dto.Contrasena)
            };

            dbContext.Usuarios.Add(nuevoUsuario);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, new { mensaje = "Usuario registrado correctamente." });
        }

    }
}
