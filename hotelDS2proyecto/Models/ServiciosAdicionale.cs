using System;
using System.Collections.Generic;

namespace hotelDS2proyecto.Models;

public partial class ServiciosAdicionale
{
    public int IdServicio { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public decimal Precio { get; set; }

    public virtual ICollection<Factura> Facturas { get; set; } = new List<Factura>();
}
