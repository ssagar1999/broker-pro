"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AppLayout } from "../../components/layout/app-layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import GoogleMapPicker from '../../components/Map/map'
import { useState } from "react"
import { toast } from "react-hot-toast"; // optional toast notifications
import { addProperty } from "../../lib/api/propertiesApi";
import { generateRandomProperty } from "./generaterandomproperty";
import ProtectedRoute from '../../components/protected-route.tsx/protected-route';


// inside your component


const propertyTypes = [
  'house', 'apartment', 'office', 'shop', 'land', 'warehouse', 'other',
  'pg', 'hostel', 'farmhouse', 'villa', 'duplex', 'studio', 'penthouse',
  'residential plot', 'commercial plot'
];

// import { DashboardNav } from "@/components/dashboard-nav"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function AddDataPageUI() {


  const [formData, setFormData] = useState({
    ownerName: "",
    ownerContact: "",
    propertyType: "",
    rooms: '',
    address: "",
    district: "",
    locality: "",
    landmark: "",
    pincode: '',
    area: 0,
    floors: 0,
    furnishing: '',
    price: 0,
    status: "active" as "active" | "pending" | "closed",
    notes: ""
  });

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    console.log(formData, 'jkjk')
    e.preventDefault();

    if (!formData.ownerName || !formData.propertyType || !formData.price || !location) {
      console.log('sddsdsd')
      toast.error("Please fill all required fields and set the location on the map.");
      return;
    }

    setLoading(true);

    try {
      // Combine form data with location coordinates
      const propertyData = {
        ...formData,
        coordinates: location,
        category: 'sale',
        brokerId: process.env.NEXT_PUBLIC_BROKERID || "68e29be01cc7a9a6eed56cfb" // Example broker ID
      };
      console.log(propertyData)
      const response = await addProperty(propertyData); // DRY API call
      toast.success("Property added successfully!");
      console.log("Property response:", response);

      // Reset form
      setFormData({
        ownerName: "",
        ownerContact: "",
        propertyType: "",
        rooms: '',
        address: "",
        district: "",
        locality: "",
        landmark: "",
        area: 0,
        floors: 0,
        furnishing: '',
        pincode: "",
        price: 0,
        status: "active",
        notes: ""
      });
      setLocation(null);

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create property.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    const { propertyData, coordinates } = generateRandomProperty();
    setFormData(propertyData);
    setLocation(coordinates);
  };





  return (
    

  <AppLayout title="Add New Data" description="Create a new entry for your broker records">

      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-2">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold">Add New Property</h1>
              <button
                type="button"
                onClick={handleGenerate}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                🎲 Generate Random Data
              </button>
              <p className="text-muted-foreground">Create a new entry for your broker records</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
                <CardDescription>Enter the details for the new broker entry</CardDescription>
              </CardHeader>

              <CardContent>
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

                  <div className="grid gap-6 md:grid-cols-2">

                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Owner Name <span className="text-destructive">*</span></Label>
                      <Input id="ownerName" name='ownerName' placeholder="John Smith" value={formData.ownerName} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ownerContact">Owner Contact <span className="text-destructive">*</span></Label>
                      <Input id="ownerContact" name='ownerContact' placeholder="9876543210" value={formData.ownerContact} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="area">area <span className="text-destructive">*</span></Label>
                      <Input id="area" name='area' placeholder="area in sq feet" value={formData.area} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="floors">Floors <span className="text-destructive">*</span></Label>
                      <Input id="floors" name='floors' placeholder="2 floors" value={formData.floors} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="furnishing">Furnishing <span className="text-destructive">*</span></Label>
                      <Input id="furnishing" name='furnishing' placeholder="semi-furnished" value={formData.furnishing} onChange={handleChange} />
                    </div>



                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Property Type</Label>
                      <Select name="propertyType" onValueChange={(val) => setFormData(prev => ({ ...prev, propertyType: val }))} value={formData.propertyType}>
                        <SelectTrigger id="propertyType">
                          <SelectValue placeholder="Select Property Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitalize first letter */}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
                      <Input id="address" name="address" placeholder="New York, NY" value={formData.address} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">District <span className="text-destructive">*</span></Label>
                      <Input id="district" name="district" placeholder="New York, NY" value={formData.district} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="locality">Locality <span className="text-destructive">*</span></Label>
                      <Input id="locality" name="locality" placeholder="New York, NY" value={formData.locality} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landmark">Landmark <span className="text-destructive">*</span></Label>
                      <Input id="landmark" name="landmark" placeholder="New York, NY" value={formData.landmark} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price <span className="text-destructive">*</span></Label>
                      <Input id="price" name="price" type="number" placeholder="500000" value={formData.price} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))} value={formData.status}>
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
                    <Label>Property Location on Map</Label>
                    <GoogleMapPicker onLocationChange={setLocation} />

                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" name="notes" placeholder="Additional information..." rows={4} value={formData.notes} onChange={handleChange} />
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
