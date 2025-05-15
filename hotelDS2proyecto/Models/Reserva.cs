using System;
using System.Collections.Generic;

namespace hotelDS2proyecto.Models;

public partial class Reserva
{
    public int IdReserva { get; set; }

    public DateTime FechaInicio { get; set; }

    public DateTime FechaFin { get; set; }

    public string? Estado { get; set; }

    public int IdCliente { get; set; }

    public int IdHabitacion { get; set; }

    public virtual ICollection<Factura> Facturas { get; set; } = new List<Factura>();

    public virtual Cliente IdClienteNavigation { get; set; } = null!;

    public virtual Habitacione IdHabitacionNavigation { get; set; } = null!;
}
