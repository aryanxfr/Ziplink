import { Compass } from "lucide-react";
import StatusPage from "../../components/common/StatusPage";

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      icon={Compass}
      title="This page doesn't exist"
      description="The link you followed may be broken, or the page may have been moved."
    />
  );
}
