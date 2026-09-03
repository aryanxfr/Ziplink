import { Link } from "react-router-dom";
import { Link2 } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import { BRAND } from "../../constants/brand";

export default function Logo({ className }) {
  return (
    <Link to={ROUTES.HOME} className={`inline-flex items-center gap-2 ${className || ""}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white">
        <Link2 className="h-4.5 w-4.5" />
      </span>
      <span className="text-lg font-semibold text-heading">{BRAND.name}</span>
    </Link>
  );
}
