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
import { rooms } from "@/lib/data/data"
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

  // Validation state for each field
  const [errors, setErrors] = useState<{
    ownerName?: string;
    ownerContact?: string;
    propertyType?: string;
    address?: string;
    district?: string;
    locality?: string;
    landmark?: string;
    pincode?: string;
    area?: string;
    floors?: string;
    price?: string;
    furnishing?: string;
  }>({});

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Check if more than 5 images are selected
      if (files.length > 5) {
        setImageError("You can only upload a maximum of 5 images");
        return;
      }
      
      setImageFiles(files);
      setImageError(null);
    }
  };
  
  // Validation functions
  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case 'ownerName':
        return value.length < 2 ? 'Name must be at least 2 characters' : 
               value.length > 50 ? 'Name cannot exceed 50 characters' : undefined;
      case 'ownerContact':
        return !/^\d{10}$/.test(value) ? 'Contact must be exactly 10 digits' : undefined;
      case 'price':
        return isNaN(Number(value)) || Number(value) <= 0 ? 'Price must be a positive number' : undefined;
      case 'area':
        return isNaN(Number(value)) || Number(value) <= 0 ? 'Area must be a positive number' : undefined;
      case 'floors':
        return isNaN(Number(value)) || Number(value) < 0 ? 'Floors must be a non-negative number' : undefined;
      case 'pincode':
        return !/^\d{6}$/.test(value) ? 'Pincode must be exactly 6 digits' : undefined;
      case 'address':
      case 'district':
      case 'locality':
      case 'landmark':
        return value.length < 3 ? `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least 3 characters` : 
               value.length > 100 ? `${name.charAt(0).toUpperCase() + name.slice(1)} cannot exceed 100 characters` : undefined;
      case 'furnishing':
        return value.length > 50 ? 'Furnishing details cannot exceed 50 characters' : undefined;
      default:
        return undefined;
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate the field and update errors
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate all fields
      const newErrors: {[key: string]: string} = {};
      let hasErrors = false;
      
      // Validate required fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'notes') return; // Notes are optional
        
        const error = validateField(key, value);
        if (error) {
          newErrors[key] = error;
          hasErrors = true;
        }
      });
      
      // Check location
      if (!location) {
        toast.error("Please set the location on the map.");
        hasErrors = true;
      }

      // Check if images are selected
      if (imageFiles.length === 0) {
        setImageError("Please select at least one image");
        hasErrors = true;
      }
      
      // Update errors state
      setErrors(newErrors);
      
      // Don't proceed if there are errors
      if (hasErrors) {
        toast.error("Please fix the errors before submitting.");
        return;
      }

      setLoading(true);
      
      // Upload images to S3
      const imageUrls = await uploadImagesToS3(imageFiles);
      
      // Prepare property data
      const propertyData = {
        ...formData,
        coordinates: location,
        imageUrls: imageUrls,
        images: imageUrls,
        category: 'sale',
        brokerId: process.env.NEXT_PUBLIC_BROKERID || "68e29be01cc7a9a6eed56cfb",
      };

      // Save property to database
      const response = await addProperty(propertyData);
      toast.success("Property added successfully!");
      console.log("Property response:", response);

      // Reset form after successful submission
      resetForm();
    } catch (err) {
      console.error('Error:', err);
      handleSubmissionError(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to upload images to S3
  const uploadImagesToS3 = async (files: File[]): Promise<string[]> => {
    const imageUrls: string[] = [];
    
    // Initialize S3 SDK with environment variables
    const s3 = new AWS.S3({
      accessKeyId: 'AKIASTHTHQ7K2L2AF3ON',
      secretAccessKey: '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',
      region: 'us-east-1',
    });

    // Upload each image to S3
    for (const file of files) {
      const params = {
        Bucket: "propertiesimages",
        Key: `properties/${Date.now()}_${file.name}`,
        Body: file,
        ContentType: file.type,
      };

      const uploadResult = await s3.upload(params).promise();
      imageUrls.push(uploadResult.Location);
    }
    
    return imageUrls;
  };

  // Helper function to handle submission errors
  const handleSubmissionError = (err: unknown) => {
    if (err instanceof Error) {
      toast.error(err.message || "Failed to create property.");
    } else {
      toast.error("Failed to create property.");
    }
  };

  // Helper function to reset form
  const resetForm = () => {
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
    setImageFiles([]);
    setImageError(null);
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
                      <Input 
                        id="ownerName" 
                        name='ownerName' 
                        placeholder="John Smith" 
                        value={formData.ownerName} 
                        onChange={handleChange}
                        className={errors.ownerName ? "border-destructive" : ""} 
                      />
                      {errors.ownerName && <p className="text-sm text-destructive">{errors.ownerName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ownerContact">Owner Contact <span className="text-destructive">*</span></Label>
                      <Input 
                        id="ownerContact" 
                        name='ownerContact' 
                        placeholder="9876543210" 
                        value={formData.ownerContact} 
                        onChange={handleChange}
                        className={errors.ownerContact ? "border-destructive" : ""} 
                      />
                      {errors.ownerContact && <p className="text-sm text-destructive">{errors.ownerContact}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="area">Area <span className="text-destructive">*</span></Label>
                      <Input 
                        id="area" 
                        name='area' 
                        placeholder="area in sq feet" 
                        value={formData.area} 
                        onChange={handleChange}
                        className={errors.area ? "border-destructive" : ""} 
                      />
                      {errors.area && <p className="text-sm text-destructive">{errors.area}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="floors">Floors <span className="text-destructive">*</span></Label>
                      <Input 
                        id="floors" 
                        name='floors' 
                        placeholder="2 floors" 
                        value={formData.floors} 
                        onChange={handleChange}
                        className={errors.floors ? "border-destructive" : ""} 
                      />
                      {errors.floors && <p className="text-sm text-destructive">{errors.floors}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rooms">Rooms</Label>
                      <Select name="rooms" onValueChange={(val) => setFormData(prev => ({ ...prev, rooms: val }))} value={formData.rooms}>
                        <SelectTrigger id="rooms">
                          <SelectValue placeholder="Select rooms" />
                        </SelectTrigger>
                        <SelectContent>

                          {rooms.map((room) => (
                            <SelectItem key={room} value={room}>
                              {room}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Label htmlFor="furnishing">Furnishing <span className="text-destructive">*</span></Label>
                      <Input 
                        id="furnishing" 
                        name='furnishing' 
                        placeholder="semi-furnished" 
                        value={formData.furnishing} 
                        onChange={handleChange}
                        className={errors.furnishing ? "border-destructive" : ""} 
                      />
                      {errors.furnishing && <p className="text-sm text-destructive">{errors.furnishing}</p>}
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Property Type</Label>
                      <Select 
                        name="propertyType" 
                        onValueChange={(val) => {
                          setFormData(prev => ({ ...prev, propertyType: val }));
                          const error = validateField('propertyType', val);
                          setErrors(prev => ({ ...prev, propertyType: error }));
                        }} 
                        value={formData.propertyType}
                      >
                        <SelectTrigger id="propertyType" className={errors.propertyType ? "border-destructive" : ""}>
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
                      {errors.propertyType && <p className="text-sm text-destructive">{errors.propertyType}</p>}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
                      <Input 
                        id="address" 
                        name="address" 
                        placeholder="New York, NY" 
                        value={formData.address} 
                        onChange={handleChange}
                        className={errors.address ? "border-destructive" : ""} 
                      />
                      {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">District <span className="text-destructive">*</span></Label>
                      <Input 
                        id="district" 
                        name="district" 
                        placeholder="New York, NY" 
                        value={formData.district} 
                        onChange={handleChange}
                        className={errors.district ? "border-destructive" : ""} 
                      />
                      {errors.district && <p className="text-sm text-destructive">{errors.district}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="locality">Locality <span className="text-destructive">*</span></Label>
                      <Input 
                        id="locality" 
                        name="locality" 
                        placeholder="New York, NY" 
                        value={formData.locality} 
                        onChange={handleChange}
                        className={errors.locality ? "border-destructive" : ""} 
                      />
                      {errors.locality && <p className="text-sm text-destructive">{errors.locality}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landmark">Landmark <span className="text-destructive">*</span></Label>
                      <Input 
                        id="landmark" 
                        name="landmark" 
                        placeholder="New York, NY" 
                        value={formData.landmark} 
                        onChange={handleChange}
                        className={errors.landmark ? "border-destructive" : ""} 
                      />
                      {errors.landmark && <p className="text-sm text-destructive">{errors.landmark}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price <span className="text-destructive">*</span></Label>
                      <Input 
                        id="price" 
                        name="price" 
                        type="number" 
                        placeholder="500000" 
                        value={formData.price} 
                        onChange={handleChange}
                        className={errors.price ? "border-destructive" : ""} 
                      />
                      {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                    </div>
                  </div>




                  <div className="space-y-2">
                    <Label htmlFor="image">Property Image (Max 5)</Label>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      onChange={handleImageChange} // Handle image upload
                      multiple
                      className={imageError ? "border-destructive" : ""}
                    />
                    {imageError && <p className="text-sm text-destructive">{imageError}</p>}
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

