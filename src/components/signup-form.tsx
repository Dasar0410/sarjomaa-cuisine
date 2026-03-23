import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

const formSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .max(16, "Username must be at most 16 characters."),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters.")
    .max(100, "Email must be at most 100 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be at most 100 characters."),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const navigate = useNavigate()
    const { signUp, signInWithGoogle } = UserAuth()
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onTouched",
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const { errors } = form.formState;

    async function onSubmit(data: z.infer<typeof formSchema>) {
      setLoading(true)
      setServerError(null) // Clear previous errors
      
      try {
            const result = await signUp(data.username, data.email, data.password)

            if (result.success) {
                console.log("Sign up successful!", result.data)
                navigate('/')
            } else if (result.error) {
                setServerError(result.error)
            }
        } catch (err) {
            console.error("Unexpected error during sign up:", err)
            setServerError("An unexpected error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Opprett en konto</CardTitle>
        <CardDescription>
          Skriv inn informasjonen din nedenfor for å opprette en konto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={async () => {
              setServerError(null)
              const result = await signInWithGoogle()
              if (!result.success && result.error) {
                setServerError(result.error)
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Registrer med Google
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-card px-2 text-muted-foreground">
              Eller fortsett med
            </span>
          </div>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-4">
                <p className="text-sm font-medium">{serverError}</p>
              </div>
            )}
            <Field>
              <FieldLabel htmlFor="username">Brukernavn</FieldLabel>
              <Input id="username" type="text" placeholder="" {...form.register("username")} />
              {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">E-post</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="ole@nordmann.no"
                {...form.register("email")}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
              <FieldDescription>
                Vi bruker denne for å kontakte deg. Vi deler ikke e-posten din
                med noen andre.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Passord</FieldLabel>
              <Input id="password" type="password" {...form.register("password")} />
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
              <FieldDescription>
                Må være minst 8 tegn langt.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Bekreft passord
              </FieldLabel>
              <Input id="confirm-password" type="password" {...form.register("confirmPassword")} />
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>}
              <FieldDescription>Vennligst bekreft passordet ditt.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Oppretter konto..." : "Opprett konto"}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Har du allerede en konto? <Link to="/signin" className="underline">Logg inn</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
