import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export default function Spinner({ className, size = "h-5 w-5" }) {
  return <Loader2 className={cn("animate-spin text-primary", size, className)} />;
}
