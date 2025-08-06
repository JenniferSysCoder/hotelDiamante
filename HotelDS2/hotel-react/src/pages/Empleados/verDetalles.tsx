import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { FaUser, FaPhone, FaIdBadge, FaHotel } from "react-icons/fa";
import type { IEmpleado } from "../../Interfaces/IEmpleado";

interface VerDetalleEmpleadoModalProps {
  empleado: IEmpleado;
  onClose: () => void;
}

export function VerDetalleEmpleadoModal({ empleado, onClose }: VerDetalleEmpleadoModalProps) {
  if (!empleado) return null;

  return (
    <Modal isOpen={true} toggle={onClose} centered>
      <ModalHeader toggle={onClose} className="bg-primary text-white">
        <FaUser className="me-2" />
        Detalles del Empleado
      </ModalHeader>
      <ModalBody>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px #0001",
            padding: 24,
            maxWidth: 400,
            margin: "0 auto",
          }}
        >
          <div className="d-flex flex-column align-items-center mb-4">
            <div
              className="rounded-circle bg-primary d-flex justify-content-center align-items-center mb-3"
              style={{ width: 70, height: 70 }}
            >
              <FaUser size={36} color="#fff" />
            </div>
            <h4 className="fw-bold mb-0">
              {empleado.nombre} {empleado.apellido}
            </h4>
            <div className="text-muted small">ID: {empleado.idEmpleado}</div>
          </div>
          <div className="mb-2 d-flex align-items-center">
            <FaIdBadge className="me-2 text-primary" />
            <span className="fw-semibold">Cargo:</span>
            <span className="ms-2">{empleado.cargo}</span>
          </div>
          <div className="mb-2 d-flex align-items-center">
            <FaPhone className="me-2 text-primary" />
            <span className="fw-semibold">Teléfono:</span>
            <span className="ms-2">{empleado.telefono ?? <span className="text-muted">No definido</span>}</span>
          </div>
          <div className="mb-2 d-flex align-items-center">
            <FaHotel className="me-2 text-primary" />
            <span className="fw-semibold">Hotel:</span>
            <span className="ms-2">{empleado.nombreHotel ?? <span className="text-muted">No definido</span>}</span>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
