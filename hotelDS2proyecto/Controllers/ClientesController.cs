using hotelDS2proyecto.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hotelDS2proyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly Ds2proyectoContext dbContext;

        public ClientesController(Ds2proyectoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        // GET: api/Clientes/Lista
        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Get()
        {
            var listaClientes = await dbContext.Clientes.ToListAsync();
            return StatusCode(StatusCodes.Status200OK, listaClientes);
        }

        // GET: api/Clientes/Obtener
        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var cliente = await dbContext.Clientes.FirstOrDefaultAsync(e => e.IdCliente == id);
            return StatusCode(StatusCodes.Status200OK, cliente);
        }

        [HttpPost]
        [HttpPost]
        [Route("Nuevo")]
        public async Task<IActionResult> Nuevo([FromBody] Cliente cliente)
        {
            if (cliente == null ||
                string.IsNullOrWhiteSpace(cliente.Nombre) ||
                string.IsNullOrWhiteSpace(cliente.Apellido) ||
                string.IsNullOrWhiteSpace(cliente.Documento) ||
                string.IsNullOrWhiteSpace(cliente.Correo) ||
                string.IsNullOrWhiteSpace(cliente.Telefono))
            {
                return BadRequest(new { mensaje = "Todos los campos son obligatorios." });
            }

            var existe = await dbContext.Clientes
                .AnyAsync(c => c.Documento == cliente.Documento);

            if (existe)
            {
                return BadRequest(new { mensaje = "Ya existe un cliente con ese documento." });
            }

            dbContext.Clientes.Add(cliente);
            await dbContext.SaveChangesAsync();

            return Ok(new { mensaje = "Cliente guardado correctamente." });
        }



        // PUT: api/Clientes/Editar
        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] Cliente cliente)
        {
            if (cliente == null || cliente.IdCliente == 0)
                return BadRequest(new { mensaje = "Datos inválidos." });

            var clienteExistente = await dbContext.Clientes.FindAsync(cliente.IdCliente);
            if (clienteExistente == null)
                return NotFound(new { mensaje = "Cliente no encontrado." });

            var documentoRepetido = await dbContext.Clientes
                .AnyAsync(c => c.Documento == cliente.Documento && c.IdCliente != cliente.IdCliente);

            if (documentoRepetido)
                return BadRequest(new { mensaje = "Ya existe otro cliente con ese documento." });

            clienteExistente.Nombre = cliente.Nombre;
            clienteExistente.Apellido = cliente.Apellido;
            clienteExistente.Documento = cliente.Documento;
            clienteExistente.Correo = cliente.Correo;
            clienteExistente.Telefono = cliente.Telefono;

            await dbContext.SaveChangesAsync();
            return Ok(new { mensaje = "Cliente actualizado correctamente." });
        }



        // DELETE: api/Clientes/Eliminar
        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var cliente = await dbContext.Clientes.FirstOrDefaultAsync(c => c.IdCliente == id);
            if (cliente == null)
                return NotFound();

            dbContext.Clientes.Remove(cliente);
            await dbContext.SaveChangesAsync();
            return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok" });
        }
    }
}
