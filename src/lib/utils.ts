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

