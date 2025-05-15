using System;
using System.Collections.Generic;

namespace hotelDS2proyecto.Models;

public partial class Usuario
{
    public int Id { get; set; }

    public string Usuario1 { get; set; } = null!;

    public string? Contrasenia { get; set; }
}
