import { NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  to: string;
  label?: string;
  className?: string;
}

const BackButton = ({ to, label = "Back", className = "" }: BackButtonProps) => {
  return (
    <button className={`btn-outline !text-sm !mb-4 flex items-center gap-2 ${className}`}>
      <NavLink to={to}>
        <ArrowLeft className="w-4 h-4" />
        {label}
      </NavLink>
    </button>
  );
};

export default BackButton;
