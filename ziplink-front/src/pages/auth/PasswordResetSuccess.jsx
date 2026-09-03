import { CheckCircle2 } from "lucide-react";
import AuthMessage from "../../components/common/AuthMessage";
import { ROUTES } from "../../constants/routes";

export default function PasswordResetSuccess() {
  return (
    <AuthMessage
      icon={CheckCircle2}
      title="Password updated"
      description="Your password has been changed successfully. Use it the next time you log in."
      actionLabel="Go to login"
      actionTo={ROUTES.LOGIN}
    />
  );
}
