import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, Lock } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { ROUTES } from "../../constants/routes";
import notify from "../../utils/toast";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const {register,handleSubmit,
    formState: { errors, isSubmitting },} = useForm({ resolver: zodResolver(schema) });

  const navigate= useNavigate()
  const {login}=useAuth();
  
  const onSubmit = async (data) => {
    try{
      await login({
        email: data.email,
        password: data.password,
      });
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch(error) {
      notify.error(
        error.response?.data?.message ?? "Invalid email or password."
      );
    }
  };


  return (
    <div>
      <h1 className="text-2xl font-semibold text-heading">Welcome back</h1>
      <p className="mt-2 text-sm text-body">Log in to manage your links and analytics.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="flex justify-end">
          <Link to={ROUTES.FORGOT_PASSWORD} className="text-sm font-medium text-accent hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Log in
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-body">
        Don't have an account?{" "}
        <Link to={ROUTES.REGISTER} className="font-medium text-accent hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
