import { XCircle } from "lucide-react";
import AuthMessage from "../../components/common/AuthMessage";
import { ROUTES } from "../../constants/routes";

export default function VerificationFailed() {
  return (
    <AuthMessage
      icon={XCircle}
      tone="danger"
      title="Verification failed"
      description="This verification link is invalid or has expired. Request a new one to continue."
      actionLabel="Back to login"
      actionTo={ROUTES.LOGIN}
    />
  );
}
