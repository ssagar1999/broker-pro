"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import  { AppLayout }  from "../../components/layout/app-layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { DashboardNav } from "@/components/dashboard-nav"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function AddDataPageUI() {
  return (
          <AppLayout title="Add New Data" description="Create a new entry for your broker records">

      
    <div className="min-h-screen bg-background">
      {/* <DashboardNav /> */}


      <main className="container mx-auto px-4 py-2">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold">Add New Data</h1>
            <p className="text-muted-foreground">Create a new entry for your broker records</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
              <CardDescription>Enter the details for the new broker entry</CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-6">
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

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name <span className="text-destructive">*</span></Label>
                    <Input id="clientName" placeholder="John Smith" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type <span className="text-destructive">*</span></Label>
                    <Input id="propertyType" placeholder="Residential, Commercial, etc." />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location <span className="text-destructive">*</span></Label>
                    <Input id="location" placeholder="New York, NY" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price <span className="text-destructive">*</span></Label>
                    <Input id="price" type="number" placeholder="500000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Additional information..." rows={4} />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">Save Data</Button>
                  <Button type="button" variant="outline">Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
        </AppLayout>
  )
}
