import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { FaUser, FaEnvelope, FaPhone, FaIdCard } from "react-icons/fa";
import type { ICliente } from "../../Interfaces/ICliente";

interface VerDetalleClienteModalProps {
  cliente: ICliente;
  onClose: () => void;
}

export function VerDetalleClienteModal({ cliente, onClose }: VerDetalleClienteModalProps) {
  if (!cliente) return null;

  return (
    <Modal isOpen={true} toggle={onClose} centered>
      <ModalHeader toggle={onClose} className="bg-primary text-white">
        <FaUser className="me-2" />
        Detalles del Cliente
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
              {cliente.nombre} {cliente.apellido}
            </h4>
            <div className="text-muted small">ID: {cliente.idCliente}</div>
          </div>
          <div className="mb-2 d-flex align-items-center">
            <FaIdCard className="me-2 text-primary" />
            <span className="fw-semibold">Documento:</span>
            <span className="ms-2">{cliente.documento}</span>
          </div>
          <div className="mb-2 d-flex align-items-center">
            <FaEnvelope className="me-2 text-primary" />
            <span className="fw-semibold">Correo:</span>
            <span className="ms-2">{cliente.correo ?? <span className="text-muted">No definido</span>}</span>
          </div>
          <div className="mb-2 d-flex align-items-center">
            <FaPhone className="me-2 text-primary" />
            <span className="fw-semibold">Teléfono:</span>
            <span className="ms-2">{cliente.telefono ?? <span className="text-muted">No definido</span>}</span>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}