import { Button } from "react-bootstrap";

interface CustomButtonProps {
  label: string;
  onClick: () => void;
  variant?: string;
}

export default function CustomButton({ label, onClick, variant = "primary" }: CustomButtonProps) {
  return (
    <Button variant={variant} onClick={onClick}>
      {label}
    </Button>
  );
}