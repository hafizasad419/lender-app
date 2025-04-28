import { NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  to: string;
  label?: string;
  className?: string;
}

const BackButton = ({
  to,
  label = "Back",
  className = "" }: BackButtonProps) => {
  return (
    <NavLink
      to={to}
      className={`btn-outline !text-sm !mb-4 inline-flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </NavLink>



  );
};

export default BackButton;

