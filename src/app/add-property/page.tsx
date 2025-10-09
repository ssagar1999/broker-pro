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
import AWS from 'aws-sdk';



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
    status: "available" as "available" | "booked" | "unavailable",
    notes: ""
  });

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    setImageFiles(Array.from(e.target.files));
  }
};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Check if required fields are filled out
  if (!formData.ownerName || !formData.propertyType || !formData.price || !location) {
    toast.error("Please fill all required fields and set the location on the map.");
    return;
  }

  setLoading(true);
  const imageUrls = []; // Array to store URLs of uploaded images

  try {
    // Initialize S3 SDK with environment variables (safe way to load credentials)
    const s3 = new AWS.S3({
      accessKeyId: 'AKIASTHTHQ7K2L2AF3ON',
      secretAccessKey: 'ONzLPbcYzgUXhhgwL7rHwJDF8fsfVDgN4jhh8kFH',
      region: 'us-east-1', // Change to your bucket's region
    });

    // Loop through the selected images and upload each to S3
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];

      const params = {
        Bucket: "propertiesimages", // Set the S3 bucket name
        Key: `properties/${Date.now()}_${file.name}`, // Generate a unique file name
        Body: file,
        ContentType: file.type,
  
      };

      // Upload the file to S3
      const uploadResult = await s3.upload(params).promise();
      imageUrls.push(uploadResult.Location); // Store the S3 URL

      console.log(`${file.name} uploaded successfully!`);
    }

    // Combine the form data with location and image URLs
    const propertyData = {
      ...formData,
      coordinates: location,
      imageUrls: imageUrls, // Save the image URLs from S3
      images: imageUrls, // Add the required 'images' property
      category: 'sale', // Example category
      brokerId: process.env.NEXT_PUBLIC_BROKERID || "68e29be01cc7a9a6eed56cfb", // Example broker ID
    };

    // Call the API to save property data to MongoDB
    const response = await addProperty(propertyData);
    toast.success("Property added successfully!");
    console.log("Property response:", response);

    // Reset the form after successful submission
    setFormData({
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
    status: "available" as "available" | "booked" | "unavailable",
    notes: ""
  });
    setLocation(null);
    setImageFiles([]); // Clear the selected image files

  } catch (err) {
    console.error('Error:', err);
    if (err instanceof Error) {
      toast.error(err.message || "Failed to create property.");
    } else {
      toast.error("Failed to create property.");
    }
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
                    <Select name="status" onValueChange={(val) => setFormData(prev => ({ ...prev, status: val as "available" | "booked" | "unavailable" }))} value={formData.status}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="booked">Booked</SelectItem>
                        <SelectItem value="unavailable">UNavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
  <Label htmlFor="image">Property Image</Label>
  <Input
    id="image"
    name="image"
    type="file"
    onChange={handleImageChange} // Handle image upload
    multiple
  />
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

