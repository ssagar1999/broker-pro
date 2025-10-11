"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Building2, AlertCircle } from "lucide-react"
import axios from "axios"
import { registerUser } from "../../lib/api/userApi"
import { toastUtils, toastMessages } from "../../lib/utils/toast"


export default function RegisterPageUI() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic client-side validation
    if (!formData.username || !formData.email || !formData.phoneNumber || !formData.password || !formData.confirmPassword) {
      setError(toastMessages.requiredFields)
      toastUtils.error(toastMessages.requiredFields)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError(toastMessages.passwordMismatch)
      toastUtils.error(toastMessages.passwordMismatch)
      return
    }

    if (formData.password.length < 6) {
      setError(toastMessages.weakPassword)
      toastUtils.error(toastMessages.weakPassword)
      return
    }

    setLoading(true)
    
    try {
      console.log("Registering user:", formData)
      
      // Use promise-based toast for better UX
      await toastUtils.promise(
        registerUser(formData),
        {
          loading: 'Creating your account...',
          success: toastMessages.registerSuccess,
          error: toastMessages.registerError,
        }
      )

      // Reset the form
      setFormData({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      })

      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push("/")
      }, 1500) // Small delay to let user see success message

    } catch (error) {
      console.error("Registration error:", error)
      
      // Handle specific error messages
      let errorMessage = toastMessages.registerError
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || toastMessages.registerError
      }
      
      setError(errorMessage)
      toastUtils.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Enter your information to get started with BrokerPro
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Display error message if there's any */}
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="9876543210"
                required
              />
            </div>


            <div className="space-y-2">


            </div>



            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full my-4" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
