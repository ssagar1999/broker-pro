"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import useUserStore  from "../../lib/store/userStore"
import { loginUser } from "../../lib/api/userApi"
import { toastUtils, toastMessages } from "../../lib/utils/toast"

export function AuthCard() {
  const router = useRouter()
  const [form, setForm] = useState({ emailOrphone: "", password: "" })
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }))
  }

   const onSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();
    setError(null);
    
    const formData = { emailOrphone: form.emailOrphone, password: form.password };
    
    if (!form.emailOrphone || !form.password) {
      setError(toastMessages.requiredFields);
      toastUtils.error(toastMessages.requiredFields);
      return;
    }

    setLoading(true);

    try {
      console.log("Logging in user:", formData);
      
      // Use promise-based toast for better UX
      const response = await toastUtils.promise(
        loginUser(formData),
        {
          loading: 'Signing you in...',
          success: toastMessages.loginSuccess,
          error: toastMessages.loginError,
        }
      );
      const respons = await toastUtils.promise(
        loginUser(formData),
        {
          loading: 'Signing you in...',
          success: toastMessages.loginSuccess,
          error: toastMessages.loginError,
        }
      );
      
      console.log("Login response:", response);
      
      // Use the login function from userStore
      useUserStore.getState().login({
        id: response.userId,
        token: response.token,
        role: response.role || 'user',
        username: response.username || 'User'
      });
      
      // Redirect to properties page after successful login
      setTimeout(() => {
        router.push("/all-properties");
      }, 1000); // Small delay to let user see success message

    } catch (error) {
      console.error("Login error:", error);
      
      // Handle specific error messages
      let errorMessage = toastMessages.loginError;
      if (error instanceof Error) {
        errorMessage = error.message || toastMessages.loginError;
      }
      
      setError(errorMessage);
      toastUtils.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="mb-4 text-center">
        <h2 className="text-lg font-semibold text-foreground">Sign in</h2>
        <p className="text-sm text-muted-foreground">Access your broker workspace</p>
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="identifier">Email or phone</Label>
          <Input
            id="emailOrphone"
            name="emailOrphone"
            placeholder="name@company.com or 9988776623"
            onChange={onChange}
            value={form.emailOrphone}
            aria-required="true"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Passwordd</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            onChange={onChange}
            value={form.password}
            aria-required="true"
          />
          <div>hi im coding</div>
          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-muted-foreground hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          New to the app?{" "}
          <Link href="/register" className="text-foreground hover:underline">
            Create an account.
          </Link>
        </p>
      </form>
    </div>
  )
}
