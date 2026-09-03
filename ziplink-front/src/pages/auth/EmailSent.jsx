import { Send } from "lucide-react";
import AuthMessage from "../../components/common/AuthMessage";
import { ROUTES } from "../../constants/routes";

export default function EmailSent() {
  return (
    <AuthMessage
      icon={Send}
      title="Reset link sent"
      description="If an account exists for that email, a password reset link is on its way."
      actionLabel="Back to login"
      actionTo={ROUTES.LOGIN}
    />
  );
}
