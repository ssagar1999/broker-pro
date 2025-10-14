"use client"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AppLayout } from "../../components/layout/app-layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import GoogleMapPicker from '../../components/Map/map'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { addProperty } from "../../lib/api/propertiesApi";
import useUserStore from "@/lib/store/userStore"
import { toastUtils, toastMessages } from "../../lib/utils/toast"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { rooms } from "@/lib/constants/data"
import { uploadImagesToS3, validateField } from '../../lib/utils'


// inside your component


const propertyTypes = [
  'house', 'apartment', 'office', 'shop', 'land', 'warehouse', 'other',
  'pg', 'hostel', 'farmhouse', 'villa', 'duplex', 'studio', 'penthouse',
  'residential plot', 'commercial plot'
];

let furnishingTypes = ['Furnished', 'Semi-Furnished', 'Unfurnished']

// import { DashboardNav } from "@/components/dashboard-nav"
import { AlertCircle, CheckCircle } from "lucide-react"


export default function AddDataPageUI() {
  const router = useRouter()
  const brokerId = useUserStore((s) => s.userId)
  const [formData, setFormData] = useState({
    ownerName: "",
    ownerContact: "",
    propertyType: "",
    rooms: '',
    address: "",
    brokerId: '',
    district: "",
    title: "",
    description:'',
    city:'',
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

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  // Validation state for each field
  const [errors, setErrors] = useState<{
    ownerName?: string;
    ownerContact?: string;
    propertyType?: string;
    address?: string;
    brokerId?: string;
    district?: string;
    city?: string;  
    title?: string;
    description?: string;
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
        toastUtils.error("Please set the location on the map.");
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
        toastUtils.error("Please fix the errors before submitting.");
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
        brokerId: brokerId || "", // Ensure brokerId is always a string
      };

      // Save property to database with promise-based toast
      const response = await toastUtils.promise(
        addProperty(propertyData),
        {
          loading: 'Adding your property...',
          success: toastMessages.propertyAdded,
          error: toastMessages.propertyError,
        }
      );
      
      console.log("Property response:", response);

      // Reset form after successful submission
      resetForm();
      
      // Redirect to properties page after successful submission
      setTimeout(() => {
        router.push("/all-properties");
      }, 1500);
    } catch (err) {
      console.error('Error:', err);
      handleSubmissionError(err);
    } finally {
      setLoading(false);
    }
  };

  

  // Helper function to handle submission errors
  const handleSubmissionError = (err: unknown) => {
    if (err instanceof Error) {
      toastUtils.error(err.message || "Failed to create property.");
    } else {
      toastUtils.error("Failed to create property.");
    }
  };

  // Helper function to reset form
  const resetForm = () => {
    setFormData({
      ownerName: "",
      ownerContact: "",
      propertyType: "",
      rooms: '',
      brokerId: '',
      address: "",
      district: "",
      title: "",
      description:'',
      locality: "",
      city:'',
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



  return (

    <AppLayout title="Add New Data" description="Create a new entry for your broker records">

      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-2">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold">Add New Property</h1>
         
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
                      <Label htmlFor="furnishing">Furnishing</Label>
                      <Select name="furnishing" onValueChange={(val) => setFormData(prev => ({ ...prev, furnishing: val as'Furnished' | 'Semi-Furnished' | 'Unfurnished' }))} value={formData.furnishing}>
                        <SelectTrigger id="furnishing">
                          <SelectValue placeholder="Select furnishing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Furnished">Furnished</SelectItem>
                          <SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem>
                          <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <div className="space-y-2">
                      <Label htmlFor="title">title <span className="text-destructive">*</span></Label>
                      <Input 
                        id="title" 
                        name="title" 
                        type="text" 
                        placeholder="tile for property" 
                        value={formData.title} 
                        onChange={handleChange}
             
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">description <span className="text-destructive">*</span></Label>
                      <Input 
                        id="description" 
                        name="description" 
                        type="text" 
                        placeholder="description for property" 
                        value={formData.description || transcript} 
                        onChange={handleChange}
             
                      />
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      type="button"
                      onClick={() => SpeechRecognition.startListening()}
                    >
                      Start
                    </button>
                    <div className="space-y-2">
                      <Label htmlFor="city">city <span className="text-destructive">*</span></Label>
                      <Input 
                        id="city" 
                        name="city" 
                        type="text" 
                        placeholder="type city" 
                        value={formData.city} 
                        onChange={handleChange}
             
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">pincode <span className="text-destructive">*</span></Label>
                      <Input 
                        id="pincode" 
                        name="pincode" 
                        type="number" 
                        placeholder="pincode" 
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
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Additional information..."
                      rows={4}
                      value={formData.notes || transcript}
                      onChange={handleChange}
                    />
                 
               
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

