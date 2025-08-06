using System;
using System.Collections.Generic;

namespace hotelDS2proyecto.Models;

public partial class Permiso
{
    public int IdPermiso { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public virtual ICollection<RolPermiso> RolPermisos { get; set; } = new List<RolPermiso>();
}
