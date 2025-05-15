using System;
using System.Collections.Generic;

namespace hotelDS2proyecto.Models;

public partial class Hotele
{
    public int IdHotel { get; set; }

    public string Nombre { get; set; } = null!;

    public string Direccion { get; set; } = null!;

    public string Telefono { get; set; } = null!;

    public string Correo { get; set; } = null!;

    public string Categoria { get; set; } = null!;

    public virtual ICollection<Empleado> Empleados { get; set; } = new List<Empleado>();

    public virtual ICollection<Habitacione> Habitaciones { get; set; } = new List<Habitacione>();
}
