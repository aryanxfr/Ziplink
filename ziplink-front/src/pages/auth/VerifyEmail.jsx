import { useState } from "react";
import { MailCheck } from "lucide-react";
import AuthMessage from "../../components/common/AuthMessage";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import authService from "../../services/auth.service";
import notify from "../../utils/toast";

export default function VerifyEmail() {
  const [showResend, setShowResend] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    if (!email.trim()) {
      notify.error("Please enter your email address.");
      return;
    }
    try {
      setSending(true);
      await authService.resendVerification({ email });
      notify.success("Verification email sent! Check your inbox.");
      setShowResend(false);
      setEmail("");
    } catch (err) {
      notify.error(err.response?.data?.message ?? "Failed to resend. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AuthMessage
      icon={MailCheck}
      title="Check your inbox"
      description="We've sent a verification link to your email address. Click it to activate your account."
      secondary={
        <div className="mt-6 space-y-3">
          {!showResend ? (
            <p className="text-xs text-body">
              Didn't get an email?{" "}
              <button
                onClick={() => setShowResend(true)}
                className="font-medium text-accent hover:underline"
              >
                Resend verification email
              </button>
            </p>
          ) : (
            <div className="space-y-2">
              <Input
                label="Your email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleResend} isLoading={sending} className="flex-1">
                  Send link
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowResend(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
