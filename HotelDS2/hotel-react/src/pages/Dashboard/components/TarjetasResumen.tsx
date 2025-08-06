import { FaUsers, FaDollarSign, FaClipboardList, FaSmile } from "react-icons/fa";

const tarjetas = [
  {
    titulo: "Clientes Activos",
    valor: "1,024",
    cambio: "+5.2%",
    icono: <FaUsers size={28} className="text-primary" />,
    bg: "bg-light",
  },
  {
    titulo: "Ventas del Mes",
    valor: "$12,450",
    cambio: "+3.1%",
    icono: <FaDollarSign size={28} className="text-success" />,
    bg: "bg-light",
  },
  {
    titulo: "Pedidos Pendientes",
    valor: "87",
    cambio: "-1.8%",
    icono: <FaClipboardList size={28} className="text-warning" />,
    bg: "bg-light",
  },
  {
    titulo: "Satisfacción",
    valor: "92%",
    cambio: "+1.3%",
    icono: <FaSmile size={28} className="text-info" />,
    bg: "bg-light",
  },
];

export default function TarjetasResumen() {
  return (
    <div className="row g-3">
      {tarjetas.map((t, i) => (
        <div className="col-md-6 col-lg-3" key={i}>
          <div className={`card h-100 shadow-sm ${t.bg}`}>
            <div className="card-body d-flex align-items-center">
              <div className="me-3">{t.icono}</div>
              <div>
                <h6 className="mb-0">{t.titulo}</h6>
                <h5 className="mb-0 fw-bold">{t.valor}</h5>
                <small
                  className={`${
                    t.cambio.startsWith("+") ? "text-success" : "text-danger"
                  }`}
                >
                  {t.cambio}
                </small>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
