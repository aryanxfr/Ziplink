import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import notify from "../../utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, Lock, User } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { ROUTES } from "../../constants/routes";

const schema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters.").max(50, "Username cannot exceed 50 characters."),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try{
      await authService.register({
        username:data.username,
        email:data.email,
        password: data.password,
      });
      notify.success("Registration successful! Please verify your email!.");
      reset();

      navigate(ROUTES.VERIFY_EMAIL,{
        state:{
          email:data.email,
        },
      });
    } catch (error){
      notify.error(
        error.response?.data?.message ?? "Registration Failed."
      );
    }
  };


  return (
    <div>
      <h1 className="text-2xl font-semibold text-heading">Create your account</h1>
      <p className="mt-2 text-sm text-body">Start shortening and tracking links in minutes.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input label="Username" icon={User} placeholder="Jane Doe" error={errors.name?.message} {...register("username")} />
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
        <Input
          label="Confirm password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-body">
        Already have an account?{" "}
        <Link to={ROUTES.LOGIN} className="font-medium text-accent hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
