import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, ArrowLeft } from "lucide-react";
import authService from "../../services/auth.service";
import notify from "../../utils/toast";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { ROUTES } from "../../constants/routes";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try{
      await authService.forgotPassword({
        email:data.email,
      });
      notify.success("If an account exists for this email, a reset link has been sent.");

      navigate(ROUTES.EMAIL_SENT);
    } catch (error){
      notify.error(
        error.response?.data?.message ?? "Something went wrong."
      );
    }
  };

  return (
    <div>
      <Link to={ROUTES.LOGIN} className="inline-flex items-center gap-1.5 text-sm font-medium text-body hover:text-heading">
        <ArrowLeft className="h-4 w-4" /> Back to login
      </Link>
      <h1 className="mt-5 text-2xl font-semibold text-heading">Forgot your password?</h1>
      <p className="mt-2 text-sm text-body">Enter your email and we'll send you a reset link.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Send reset link
        </Button>
      </form>
    </div>
  );
}
