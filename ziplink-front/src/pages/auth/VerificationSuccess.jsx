import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import AuthMessage from "../../components/common/AuthMessage";
import authService from "../../services/auth.service";
import notify from "../../utils/toast";
import { ROUTES } from "../../constants/routes";

export default function VerificationSuccess() {
    const [loading, setLoading] = useState(true);

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            navigate(ROUTES.VERIFICATION_FAILED, {
                replace: true,
            });
            return;
        }

        const verify = async () => {
            try {
                await authService.verifyEmail(token);

                notify.success(
                    "Email verified successfully."
                );
            } catch (error) {
                notify.error(
                    error.response?.data?.message ??
                        "Verification failed."
                );

                navigate(
                    ROUTES.VERIFICATION_FAILED,
                    {
                        replace: true,
                    }
                );

                return;
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, []);

    if (loading) {
        return null;
    }

    return (
        <AuthMessage
            icon={CheckCircle2}
            title="Email verified"
            description="Your email has been confirmed. You can now log in and start shortening links."
            actionLabel="Go to login"
            actionTo={ROUTES.LOGIN}
        />
    );
}