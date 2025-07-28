"use client";

import { userRegister } from "@/hooks/user";
import { registerFormValue, userRegisterSchema } from "@/validations/user.validation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle, FaGithub, FaLinkedin, FaMailBulk } from "react-icons/fa";
import { toast, Toaster } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const register = userRegister();
  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm<registerFormValue>({
    resolver: zodResolver(userRegisterSchema),
  });

  const onSubmit = async (data: registerFormValue) => {
    try {
      setErrorMessage("");
      await register.mutateAsync({
        email: data.email,
        password: data.password,
      });
      toast.success("Register successfully");
    } catch (error: any) {
      toast.error("Register failed");
      console.log("Erreur lors de la creation du compte", error);
      setErrorMessage(error?.response?.data?.message || "Une erreur est survenue");
    }
  };

  return (
    <div className="min-h-screen w-full">
      <Toaster />
      <div className="flex items-center justify-center w-full h-full relative">
        <div className="bg-red-500 w-full h-full flex items-center justify-start">
          {/* illust */}
          illust
        </div>

        <div className="w-full h-full flex items-center justify-center flex-col">
          <div className="w-full h-full flex items-center justify-center flex-col space-y-4 py-7">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Ravi de vous voir</h2> <p>Créez votre compte</p>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <div className="border border-slate-700 outline-none p-2 px-8 rounded-full">
                <FaGoogle className="text-red-500" />
              </div>
              <div className="border border-slate-700 outline-none p-2 px-8 rounded-full">
                <FaGithub />
              </div>
              <div className="border border-slate-700 outline-none p-2 px-8 rounded-full">
                <FaLinkedin className="text-blue-500" />
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <div className="h-0.5 w-32 bg-slate-700" />
              <p>ou</p>
              <div className="h-0.5 w-32 bg-slate-700" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md w-full">
              <div className="">
                <Card>
                  {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="block text-sm font-medium">
                        Email
                      </Label>
                    </div>
                    <div className="relative group flex flex-col items-center">
                      <Mail className="absolute left-3 top-2 h-5 w-5" />
                      <Input
                        {...registerForm("email")}
                        type="email"
                        id="email"
                        placeholder="test@gmail.com"
                        className="px-10 rounded-2xl outline-none"
                      />
                      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="block text-sm font-medium">
                        Password
                      </Label>
                    </div>
                    <div className="relative group flex flex-col items-center">
                      <Lock className="absolute left-3 top-2 h-5 w-5" />
                      <Input
                        {...registerForm("password")}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="********"
                        className="px-10 rounded-2xl outline-none"
                      />
                      <Button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0"
                      >
                        {showPassword ? <Eye /> : <EyeOff />}
                      </Button>
                      {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="block text-sm font-medium">
                        Confirm Password
                      </Label>
                    </div>
                    <div className="relative group flex flex-col items-center">
                      <Lock className="absolute left-3 top-2 h-5 w-5" />
                      <Input
                        {...registerForm("confirmPassword")}
                        type={showPasswordConfirm ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="********"
                        className="px-10 rounded-2xl outline-none"
                      />
                      <Button
                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        className="absolute right-0"
                      >
                        {showPasswordConfirm ? <Eye /> : <EyeOff />}
                      </Button>
                      {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      type="submit"
                      disabled={register.isPending}
                      className="w-full py-2 text-lg rounded-md bg-primary hover:bg-primary/90 focus-visible:ring-0 focus-visible:ring-offset-0"
                    >
                      {register.isPending ? (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Register"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </form>

            <div className="text-sm text-foreground flex items-center gap-2 justify-center">
              <p>Vous avez deja un compte ?</p>
              <Link href="/auth/login">Se connecter</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
