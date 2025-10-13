"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { AppLayout } from "../../../components/layout/app-layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GoogleMapPicker from "../../../components/Map/map";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updatePropertyById } from "../../../lib/api/propertiesApi";
import { usePropertiesStore } from "../../../lib/store/propertyStore";
import { toastUtils, toastMessages } from "../../../lib/utils/toast";
import { rooms } from "../../../lib/data/data";
import { uploadImagesToS3 } from "../../../lib/utils";
import { AlertCircle, CheckCircle } from "lucide-react";


const propertyTypes = [
  "house",
  "apartment",
  "office",
  "shop",
  "land",
  "warehouse",
  "other",
  "pg",
  "hostel",
  "farmhouse",
  "villa",
  "duplex",
  "studio",
  "penthouse",
  "residential plot",
  "commercial plot",
];

export default function AddDataPageUI() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    ownerName: "",
    ownerContact: "",
    propertyType: "",
    rooms: "",
    address: "",
    brokerId: "",
    district: "",
    city: "",
    category: "",
    locality: "",
    title: "",
    description:'',
    landmark: "",
    pincode: "",
    area: 0,
    floors: 0,
    furnishing: "",
    price: 0,
    status: "" ,
    notes: "",
  });

  const params = useParams() as { id?: string };
  const id = params?.id ?? "";

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  console.log(formData,);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  const detailsById = usePropertiesStore((s) => s.detailsById || {});
  const isLoadingDetail = usePropertiesStore((s) => !!s.isLoadingDetail);
  const fetchPropertyById = usePropertiesStore((s) => s.fetchPropertyById!);

  const property = detailsById[id];

  useEffect(() => {
    if (!id) return;
    if (!property) fetchPropertyById(id, true);
  }, [id, property, fetchPropertyById]);

  useEffect(() => {
    if (!property) return
      setFormData({
        ownerName: property.owner.name,
        ownerContact: property?.owner?.phoneNumber || "",
        rooms: property.rooms,
        title: property.title,
        description: property.description,
        propertyType: property.propertyType,
        address: property.location.address,
        brokerId: property.brokerId,
        district: property.location.district,
        city: property.location.city,
        locality: property.location.locality || "",
        landmark: property.location.landmark || "",
        pincode: property.pincode,
        area: property.area,
        category: property.category,
        floors: property.floors,
        furnishing: property.furnishing,
        price: property.price,
        status: property.status || "available",
        notes: property.notes || "",
      });
      
      // Set location if coordinates exist
      if (property.location.coordinates) {
        setLocation({
          lat: property.location.coordinates[1], // latitude is second element
          lng: property.location.coordinates[0]  // longitude is first element
        });
      }
    
  }, [property, formData.status, formData.propertyType, formData.rooms, property?.rooms,   property?.location.coordinates ]);
  const [errors, setErrors] = useState<{
    ownerName?: string;
    ownerContact?: string;
    propertyType?: string;
    address?: string;
    brokerId?: string;
    district?: string;
    locality?: string;
    landmark?: string;
    title?: string;
    description?: string;
    pincode?: string;
    area?: string;
    floors?: string;
    price?: string;
    furnishing?: string;
  }>({});
  


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      if (files.length > 5) {
        setImageError("You can only upload a maximum of 5 images");
        return;
      }

      setImageFiles(files);
      setImageError(null);
    }
  };

  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case "ownerName":
        return value.length < 2 ? "Name must be at least 2 characters" : value.length > 50 ? "Name cannot exceed 50 characters" : undefined;
      case "ownerContact":
        return !/^\d{10}$/.test(value) ? "Contact must be exactly 10 digits" : undefined;
      case "price":
        return isNaN(Number(value)) || Number(value) <= 0 ? "Price must be a positive number" : undefined;
      case "area":
        return isNaN(Number(value)) || Number(value) <= 0 ? "Area must be a positive number" : undefined;
      case "floors":
        return isNaN(Number(value)) || Number(value) < 0 ? "Floors must be a non-negative number" : undefined;
      case "pincode":
        return !/^\d{6}$/.test(value) ? "Pincode must be exactly 6 digits" : undefined;
      case "address":
      case "district":
      case "locality":
      case "landmark":
        return value.length < 3 ? `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least 3 characters` : value.length > 100 ? `${name.charAt(0).toUpperCase() + name.slice(1)} cannot exceed 100 characters` : undefined;
      case "furnishing":
        return value.length > 50 ? "Furnishing details cannot exceed 50 characters" : undefined;
      case "title":
        return value.length < 3 ? "Title must be at least 3 characters" : value.length > 100 ? "Title cannot exceed 100 characters" : undefined;
      case "description":
        return value.length > 500 ? "Description cannot exceed 500 characters" : undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate the field and update errors
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasErrors = false;

    const newErrors: { [key: string]: string } = {};
    // Validate all fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "notes") return; // Notes are optional
        const error = validateField(key, value);
        if (error) {
          newErrors[key] = error;
          hasErrors = true;
        }
    });

    // Check location
    if (!location) {
      toastUtils.error("Please set the location on the map.");
      hasErrors = true;
    }

    // Update errors state
    setErrors(newErrors);

    // Don't proceed if there are errors
    if (hasErrors) {
      toastUtils.error("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      // Upload images to S3
      const imageUrls = imageFiles.length === 0 ?  property.images : await uploadImagesToS3(imageFiles);

      // Prepare property data
      const propertyData = {
        brokerId: property.brokerId || "",
        propertyType: formData.propertyType,
        address: formData.address,
        ownerName: formData.ownerName,
        ownerContact: formData.ownerContact,
        rooms: formData.rooms,
        district: formData.district,
        locality: formData.locality,
        landmark: formData.landmark,
        area: formData.area,
        floors: formData.floors,
        images: imageUrls,
        furnishing: formData.furnishing,
        pincode: formData.pincode,
        price: formData.price,
        status: formData.status,
        notes: formData.notes,
        // Add location data
        location: {
          city: formData.city,
          address: formData.address,
          district: formData.district,
          locality: formData.locality,
          landmark: formData.landmark,
          coordinates: location ? [Number(location.lng), Number(location.lat)] : undefined
        },
        // Add title and description
        title: formData.title,
        description: formData.description,
        category: formData.category || "sale"
      };

      // Save property to database with promise-based toast
      const response = await toastUtils.promise(
        updatePropertyById(property.brokerId, id, propertyData),
        {
          loading: 'Updating your property...',
          success: toastMessages.propertyUpdated,
          error: toastMessages.propertyError,
        }
      );
      
      console.log("Property response:", response);
      

      resetForm();
      
      // Redirect to properties page after successful update
      setTimeout(() => {
        router.push("/all-properties");
      }, 1500);
    } catch (err) {
      console.error("Error:", err);
      handleSubmissionError(err);
    } finally {
      setLoading(false);
    }
  };



  const handleSubmissionError = (err: unknown) => {
    if (err instanceof Error) {
      toastUtils.error(err.message || "Failed to create property.");
    } else {
      toastUtils.error("Failed to create property.");
    }
  };

  const resetForm = () => {
    setFormData({
      ownerName: "",
      ownerContact: "",
      propertyType: "",
      rooms: "",
      brokerId: "",
      address: "",
      district: "",
      category: "",
      title:'',
      description:'',
      locality: "",
      city: "",
      landmark: "",
      pincode: "",
      area: 0,
      floors: 0,
      furnishing: "",
      price: 0,
      status: "available" as "available" | "booked" | "unavailable",
      notes: "",
    });
    setLocation(null);
    setImageFiles([]);
    setImageError(null);
  };


  if (isLoadingDetail) {
    return (
      <AppLayout title="Edit Property" description="Edit the details of the property you want to update.">
        <div className="min-h-screen bg-background">
          <main className="container mx-auto px-4 py-2">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6">
                <h1 className="mb-2 text-3xl font-bold">Edit Property</h1>
                <p className="text-muted-foreground">Loading property details...</p>
              </div>
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading property details...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </AppLayout>
    );
  }

  if (!property) {
    return (
      <AppLayout title="Edit Property" description="Edit the details of the property you want to update.">
        <div className="min-h-screen bg-background">
          <main className="container mx-auto px-4 py-2">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6">
                <h1 className="mb-2 text-3xl font-bold">Edit Property</h1>
                <p className="text-muted-foreground">Property not found.</p>
              </div>
            </div>
          </main>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Edit Property" description="Edit the details of the property you want to update.">
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-2">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold">Edit Property</h1>
              <p className="text-muted-foreground">Edit the details of the property you want to update.</p>
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
                      <Label htmlFor="locality">Title <span className="text-destructive">*</span></Label>
                      <Input 
                        id="title" 
                        name="title" 
                        placeholder="2 gaj ka makan" 
                        value={formData.title} 
                        onChange={handleChange}
                        className={errors.title ? "border-destructive" : ""} 
                      />
                      {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
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

                          <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode <span className="text-destructive">*</span></Label>
                      <Input 
                        id="pincode" 
                        name="pincode" 
                        type="number" 
                        placeholder="110094" 
                        value={formData.pincode} 
                        onChange={handleChange}
                        className={errors.pincode ? "border-destructive" : ""} 
                      />
                      {errors.pincode && <p className="text-sm text-destructive">{errors.pincode}</p>}
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
                    <Label htmlFor="description">Desctiption</Label>
                    <Textarea id="description" name="description" placeholder="description..." rows={4} value={formData.description} onChange={handleChange} />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">Update</Button>
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

