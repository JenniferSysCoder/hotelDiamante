using hotelDS2proyecto.Models;
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

        // Método para encriptar usando SHA256 en formato hexadecimal
        private string Encriptar(string texto)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(texto);
                byte[] hash = sha256.ComputeHash(bytes);
                return BitConverter.ToString(hash).Replace("-", "");
            }
        }

        // GET: api/Usuarios/Lista
        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Get()
        {
            var listaUsuarios = await dbContext.Usuarios.ToListAsync();
            return StatusCode(StatusCodes.Status200OK, listaUsuarios);
        }

        // GET: api/Usuarios/Obtener/5
        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var usuario = await dbContext.Usuarios.FirstOrDefaultAsync(u => u.Id == id);
            return StatusCode(StatusCodes.Status200OK, usuario);
        }

        // POST: api/Usuarios/Nuevo
        [HttpPost]
        [Route("Nuevo")]
        public async Task<IActionResult> Nuevo([FromBody] Usuario objeto)
        {
            // Encriptar la contraseña antes de guardar
            objeto.Contrasenia = Encriptar(objeto.Contrasenia);

            await dbContext.Usuarios.AddAsync(objeto);
            await dbContext.SaveChangesAsync();
            return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok" });
        }

        // PUT: api/Usuarios/Editar
        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] Usuario objeto)
        {
            if (!string.IsNullOrEmpty(objeto.Contrasenia))
            {
                objeto.Contrasenia = Encriptar(objeto.Contrasenia);
            }

            dbContext.Usuarios.Update(objeto);
            await dbContext.SaveChangesAsync();
            return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok" });
        }

        // DELETE: api/Usuarios/Eliminar/5
        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var usuario = await dbContext.Usuarios.FirstOrDefaultAsync(u => u.Id == id);
            if (usuario == null)
            {
                return NotFound(new { mensaje = "Usuario no encontrado" });
            }

            dbContext.Usuarios.Remove(usuario);
            await dbContext.SaveChangesAsync();
            return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok" });
        }
    }
}
