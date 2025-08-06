using System;
using System.Collections.Generic;

namespace hotelDS2proyecto.Models;

public partial class Usuario
{
    public int IdUsuario { get; set; }

    public string Usuario1 { get; set; } = null!;

    public string Contrasena { get; set; } = null!;

    public int IdRol { get; set; }

    public int? IdEmpleado { get; set; }

    public virtual Empleado? IdEmpleadoNavigation { get; set; }

    public virtual Role IdRolNavigation { get; set; } = null!;
}
