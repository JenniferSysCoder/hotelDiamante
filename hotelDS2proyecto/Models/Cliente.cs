using System;
using System.Collections.Generic;

namespace hotelDS2proyecto.Models;

public partial class Cliente
{
    public int IdCliente { get; set; }

    public string Nombre { get; set; } = null!;

    public string Apellido { get; set; } = null!;

    public string Documento { get; set; } = null!;

    public string? Correo { get; set; }

    public string? Telefono { get; set; }

    public virtual ICollection<Reserva> Reservas { get; set; } = new List<Reserva>();
}
