using System;
using System.Collections.Generic;

namespace hotelDS2proyecto.Models;

public partial class Empleado
{
    public int IdEmpleado { get; set; }

    public string Nombre { get; set; } = null!;

    public string Apellido { get; set; } = null!;

    public string Cargo { get; set; } = null!;

    public string? Telefono { get; set; }

    public int IdHotel { get; set; }

    public virtual Hotele IdHotelNavigation { get; set; } = null!;

    public virtual ICollection<Limpieza> Limpiezas { get; set; } = new List<Limpieza>();

    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
