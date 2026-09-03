import { TimerOff } from "lucide-react";
import StatusPage from "../../components/common/StatusPage";
import { ROUTES } from "../../constants/routes";

export default function SessionExpired() {
  return (
    <StatusPage
      icon={TimerOff}
      title="Your session has expired"
      description="For your security, please log in again to continue."
      actionLabel="Log in again"
      actionTo={ROUTES.LOGIN}
    />
  );
}
