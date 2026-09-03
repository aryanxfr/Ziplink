import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import authService from "../../services/auth.service";
import notify from "../../utils/toast";
import { z } from "zod";
import { Lock } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { ROUTES } from "../../constants/routes";

const schema = z
  .object({
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams]=useSearchParams();
  const token=searchParams.get("token");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    if(!token){
      notify.error("Invalid or expired reset link.");
      return;
    }
    try{
      await authService.resetPassword({
        token,
        newPassword: data.password,
      });
      notify.success("Password reset successfully.");

      navigate(ROUTES.PASSWORD_RESET_SUCCESS);
    } catch(error){
      notify.error(
        error.response?.data?.message ?? "Password reset failed."
      );
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-heading">Set a new password</h1>
      <p className="mt-2 text-sm text-body">Choose a strong password you haven't used before.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input
          label="New password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm new password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Reset password
        </Button>
      </form>
    </div>
  );
}
