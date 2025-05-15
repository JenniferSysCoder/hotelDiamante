using System;
using System.Collections.Generic;

namespace hotelDS2proyecto.Models;

public partial class Pago
{
    public int IdPago { get; set; }

    public decimal Monto { get; set; }

    public DateTime FechaPago { get; set; }

    public string? MetodoPago { get; set; }

    public int IdFactura { get; set; }

    public virtual Factura IdFacturaNavigation { get; set; } = null!;
}
