"use client"

import { Button } from "@/components/ui/button"   // ShadCN Button
import { Input } from "@/components/ui/input"     // ShadCN Input
import { Label } from "@/components/ui/label"     // ShadCN Label
import { AlertCircle, CheckCircle } from "lucide-react" // For icons
import Link from "next/link" // Next.js Link
import { loginUser } from "../lib/api/userApi";
import { useState } from "react"
import { useRouter } from "next/navigation"
import  useUserStore  from "../lib/store/userStore"; // Import Zustand store

export default function Home() {
  const [formData, setFormData] = useState({
    emailOrphone: "",
    password: "",
  });
  let router = useRouter();


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left side with illustration */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-8 bg-[#B5CCBE] text-white w-1/2">
        <div className="max-w-md mx-auto text-center space-y-6">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%89%8D%E9%9D%A2%204.%20Lovebirds%20Website%20Login%20Design.jpg-1paoL13xn74ze0DJ424BHsfCXvnvkO.jpeg"
            alt="Decorative bird illustration"
            width={300}
            height={300}
            className="mx-auto"
          />
          <h2 className="text-2xl font-medium">Maecenas mattis egestas</h2>
          <p className="text-sm text-white/80">
            Eidum et malesuada fames ac ante ipsum primis in faucibus suspendisse porta
          </p>
          {/* Dots navigation */}
          <div className="flex justify-center gap-2 pt-4">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
          </div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="flex flex-col items-center justify-center p-8 w-full lg:w-1/2">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-script mb-6">auto broker</h1>
            <h2 className="text-xl text-gray-600">Welcome to auto broker</h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error message placeholder */}
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive hidden">
              <AlertCircle className="h-4 w-4" />
              <span>Error message goes here</span>
            </div>

            {/* Success message placeholder */}
            <div className="flex items-center gap-2 rounded-md bg-accent/10 p-3 text-sm text-accent hidden">
              <CheckCircle className="h-4 w-4" />
              <span>Data saved successfully! Redirecting...</span>
           
            </div>

            {/* Form Inputs */}
            <div className="space-y-2">
              <Label htmlFor="email">Phone Number or Email</Label>
              <Input id="email" placeholder="John Smith" name="emailOrphone"  onChange={handleChange}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" name="password" onChange={handleChange}/>
              <div className="text-right">
                <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white">Sign in</Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Google Sign-in Button */}
            <Button variant="outline" className="w-full border-gray-300">
              <img src="/placeholder.svg" alt="Google" width={20} height={20} className="mr-2" />
              Sign in with Google
            </Button>

            {/* Create Account Link */}
            <p className="text-center text-sm text-gray-500">
              New Lovebirds?{" "}
              <Link href="/register" className="text-gray-600 hover:text-gray-800">
                Create Account
              </Link>
                    <Link href="/add-property" className="font-medium text-primary hover:underline">
                go to add property
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
