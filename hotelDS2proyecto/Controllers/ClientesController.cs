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
        [Route("Nuevo")]
        public async Task<IActionResult> Nuevo([FromBody] Cliente cliente)
        {
            var clienteExistente = await dbContext.Clientes
                .FirstOrDefaultAsync(c => c.Documento == cliente.Documento);

            if (clienteExistente != null)
            {
                // Si el cliente ya existe, devolvemos un mensaje de error
                return StatusCode(StatusCodes.Status400BadRequest, new { mensaje = "Ya existe un cliente con el mismo documento." });
            }

            await dbContext.Clientes.AddAsync(cliente);
            await dbContext.SaveChangesAsync();
            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Cliente guardado correctamente" });
        }


        // PUT: api/Clientes/Editar
        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] Cliente cliente)
        {
            dbContext.Clientes.Update(cliente);
            await dbContext.SaveChangesAsync();
            return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok" });
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
