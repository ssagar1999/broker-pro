import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import AWS from "aws-sdk";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    case "pending":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20"
    case "closed":
      return "bg-slate-500/10 text-slate-600 border-slate-500/20"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function getStatusBadgeStyles(status: string) {
  switch (status) {
    case "available":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
    case "booked":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
    case "unavailable":
      return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
    default:
      return ""
  }
}


  export const uploadImagesToS3 = async (files: File[]): Promise<string[]> => {
    const imageUrls: string[] = [];
      const s3 = new AWS.S3({
        accessKeyId: 'AKIASTHTHQ7K2L2AF3ON',
        secretAccessKey: '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',
        region: 'us-east-1',
      });

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

    // Validation functions
    export const validateField = (name: string, value: any): string | undefined => {
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

