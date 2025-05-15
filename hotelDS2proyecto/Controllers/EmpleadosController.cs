using hotelDS2proyecto.Models;
using hotelDS2proyecto.ModelsDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hotelDS2proyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpleadosController : ControllerBase
    {
        private readonly Ds2proyectoContext dbContext;

        public EmpleadosController(Ds2proyectoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Get()
        {
            var empleados = await dbContext.Empleados
                .Include(e => e.IdHotelNavigation)
                .Select(e => new EmpleadoDTO
                {
                    IdEmpleado = e.IdEmpleado,
                    Nombre = e.Nombre,
                    Apellido = e.Apellido,
                    Cargo = e.Cargo,
                    Telefono = e.Telefono,
                    IdHotel = e.IdHotel,
                    NombreHotel = e.IdHotelNavigation.Nombre
                })
                .ToListAsync();

            return Ok(empleados);
        }

        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var empleado = await dbContext.Empleados
                .Include(e => e.IdHotelNavigation)
                .FirstOrDefaultAsync(e => e.IdEmpleado == id);

            if (empleado == null)
                return NotFound(new { mensaje = "Empleado no encontrado" });

            var dto = new EmpleadoDTO
            {
                IdEmpleado = empleado.IdEmpleado,
                Nombre = empleado.Nombre,
                Apellido = empleado.Apellido,
                Cargo = empleado.Cargo,
                Telefono = empleado.Telefono,
                IdHotel = empleado.IdHotel,
                NombreHotel = empleado.IdHotelNavigation.Nombre
            };

            return Ok(dto);
        }

        [HttpPost]
        [Route("Nuevo")]
        public async Task<IActionResult> Create([FromBody] EmpleadoDTO dto)
        {
            if (dto == null)
                return BadRequest(new { mensaje = "Datos inválidos" });

            var empleado = new Empleado
            {
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Cargo = dto.Cargo,
                Telefono = dto.Telefono,
                IdHotel = dto.IdHotel
            };

            dbContext.Empleados.Add(empleado);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, new { mensaje = "Empleado creado correctamente" });
        }


        [HttpPut]
        [Route("Editar/{id}")]
        public async Task<IActionResult> Editar(int id, [FromBody] EmpleadoDTO dto)
        {
            if (dto == null)
                return BadRequest(new { mensaje = "Datos inválidos" });

            var empleado = await dbContext.Empleados.FindAsync(id);
            if (empleado == null)
                return NotFound(new { mensaje = "Empleado no encontrado" });

            empleado.Nombre = dto.Nombre;
            empleado.Apellido = dto.Apellido;
            empleado.Cargo = dto.Cargo;
            empleado.Telefono = dto.Telefono;  
            empleado.IdHotel = dto.IdHotel;

            dbContext.Empleados.Update(empleado);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Empleado actualizado correctamente" });
        }

        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var empleado = await dbContext.Empleados.FindAsync(id);

            if (empleado == null)
                return NotFound(new { mensaje = "Empleado no encontrado" });

            dbContext.Empleados.Remove(empleado);
            await dbContext.SaveChangesAsync();

            return Ok(new { mensaje = "Empleado eliminado correctamente" });
        }
    }
}

