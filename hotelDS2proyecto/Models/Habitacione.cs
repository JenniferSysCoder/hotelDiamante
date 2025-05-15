using System;
using System.Collections.Generic;

namespace hotelDS2proyecto.Models;

public partial class Habitacione
{
    public int IdHabitacion { get; set; }

    public string Numero { get; set; } = null!;

    public string Tipo { get; set; } = null!;

    public decimal PrecioNoche { get; set; }

    public string? Estado { get; set; }

    public int IdHotel { get; set; }

    public virtual Hotele IdHotelNavigation { get; set; } = null!;

    public virtual ICollection<Limpieza> Limpiezas { get; set; } = new List<Limpieza>();

    public virtual ICollection<Reserva> Reservas { get; set; } = new List<Reserva>();
}
