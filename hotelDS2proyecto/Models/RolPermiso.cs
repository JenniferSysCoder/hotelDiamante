using System;
using System.Collections.Generic;

namespace hotelDS2proyecto.Models;

public partial class RolPermiso
{
    public int IdRolPermiso { get; set; }

    public int IdRol { get; set; }

    public int IdPermiso { get; set; }

    public virtual Permiso IdPermisoNavigation { get; set; } = null!;

    public virtual Role IdRolNavigation { get; set; } = null!;
}
