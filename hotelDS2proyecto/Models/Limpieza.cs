using System;
using System.Collections.Generic;

namespace hotelDS2proyecto.Models;

public partial class Limpieza
{
    public int IdLimpieza { get; set; }

    public DateTime Fecha { get; set; }

    public string? Observaciones { get; set; }

    public int IdHabitacion { get; set; }

    public int IdEmpleado { get; set; }

    public virtual Empleado IdEmpleadoNavigation { get; set; } = null!;

    public virtual Habitacione IdHabitacionNavigation { get; set; } = null!;
}
