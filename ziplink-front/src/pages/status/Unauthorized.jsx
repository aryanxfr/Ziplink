import { Lock } from "lucide-react";
import StatusPage from "../../components/common/StatusPage";
import { ROUTES } from "../../constants/routes";

export default function Unauthorized() {
  return (
    <StatusPage
      code="401"
      icon={Lock}
      title="Log in to continue"
      description="You need to be signed in to view this page."
      actionLabel="Go to login"
      actionTo={ROUTES.LOGIN}
    />
  );
}
