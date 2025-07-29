"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { userLogin } from "@/hooks/user"
import { type loginFormValue, userLoginSchema } from "@/validations/user.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader, Lock, Mail, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast, Toaster } from "sonner"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const login = userLogin()

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormValue>({
    resolver: zodResolver(userLoginSchema),
  })

  const onSubmit = async (data: loginFormValue) => {
    try {
      setErrorMessage("")
      await login.mutateAsync({
        email: data.email,
        password: data.password,
      })
      toast.success("Connexion réussie")
    } catch (error: any) {
      toast.error("Échec de la connexion")
      console.log("Erreur lors de la connexion", error)
      setErrorMessage(error?.response?.data?.message || "Une erreur est survenue")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Toaster position="top-center" />

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Ravi de vous voir</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Connectez-vous à votre compte</p>
          </div>

          {/* Login Form */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl text-center">Connexion</CardTitle>
              <CardDescription className="text-center">
                Entrez vos identifiants pour accéder à votre compte
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                {/* Error Message */}
                {errorMessage && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      {...registerForm("email")}
                      type="email"
                      id="email"
                      placeholder="votre@email.com"
                      className="pl-10 h-11 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-200"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      {...registerForm("password")}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-200"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      </span>
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  disabled={login.isPending}
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  {login.isPending ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>

                {/* Register Link */}
                <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Pas encore de compte ?{" "}
                  <Link
                    href="/auth/register"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Créer un compte
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-xs text-slate-500 dark:text-slate-400">
            En vous connectant, vous acceptez nos{" "}
            <Link href="/terms" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
