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
  let formData = { emailOrphone: form.emailOrphone, password: form.password };
    if (!form.emailOrphone || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await loginUser(formData);
      console.log("Login response:", response);
      
      // Use the login function from userStore instead of individual setters
      useUserStore.getState().login({
        id: response.userId,
        token: response.token,
        role: 'user'
      });
      
      // Force a page reload to ensure cookies are properly set
      // window.location.href = "/show-properties";
      router.push("/show-properties");

    } catch (error) {
      console.error("Login error:", error);
      // Handle login error
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
            Create an account
          </Link>
        </p>
      </form>
    </div>
  )
}
