import { ShieldAlert } from "lucide-react";
import StatusPage from "../../components/common/StatusPage";

export default function Forbidden() {
  return (
    <StatusPage
      code="403"
      icon={ShieldAlert}
      title="You don't have access"
      description="Your account doesn't have permission to view this page."
    />
  );
}
