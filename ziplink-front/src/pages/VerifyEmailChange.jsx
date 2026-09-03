import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { ROUTES } from "../constants/routes";
import authService from "../services/auth.service";

export default function VerifyEmailChange() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }

    const verify = async () => {
      try {
        const response = await authService.verifyEmailChange(token);
        setStatus("success");
        setMessage(response?.data?.message ?? "Email updated successfully. Please log in with your new email.");
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ?? "Verification failed. The link may have expired."
        );
      }
    };
    verify();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-body">Verifying your new email...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <h2 className="text-xl font-semibold text-heading">Email Updated!</h2>
            <p className="text-sm text-body">{message}</p>
            <Link to={ROUTES.LOGIN}>
              <Button className="mt-4">Sign in with new email</Button>
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <XCircle className="h-12 w-12 text-danger" />
            <h2 className="text-xl font-semibold text-heading">Verification Failed</h2>
            <p className="text-sm text-body">{message}</p>
            <Link to={ROUTES.LOGIN}>
              <Button variant="outline" className="mt-4">Go to login</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
