// utils/generateRandomProperty.ts

export type Coordinates = { lat: number; lng: number };

export interface PropertyFormData {
  ownerName: string;
  ownerContact: string;
  propertyType: string;
  rooms: string;
  address: string;
  city: string;
  district: string;
  brokerId: string;
  locality: string;
  landmark: string;
  pincode: string;
  area: number;
  floors: number;
  furnishing: string;
  price: number;
  status: "available" | "booked" | "unavailable";
  notes: string;
}

const types = ["Apartment", "Villa", "Plot", "Commercial", "Studio"];
const furnishings = ["Furnished", "Semi-Furnished", "Unfurnished"];
const districts = ["Pune", "Delhi", "Mumbai", "Bangalore", "Hyderabad"];
const localities = ["Kothrud", "Andheri", "Whitefield", "Banjara Hills", "Connaught Place"];
const landmarks = ["Near Mall", "Opposite Park", "Close to Metro", "Beside School", "Facing Garden"];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomCoordinates(): Coordinates {
  const lat = 19 + Math.random() * 5; // between 19 and 24
  const lng = 72 + Math.random() * 5; // between 72 and 77
  return { lat, lng };
}

function randomPhone(): string {
  return `99999${Math.floor(10000 + Math.random() * 89999)}`;
}

/**
 * Generates random property data for development/testing
 */
export function generateRandomProperty() {
  const district = getRandom(districts);
  const locality = getRandom(localities);
  const landmark = getRandom(landmarks);
  const furnishing = getRandom(furnishings);
  const propertyType = getRandom(types);
  const city = "Pune";

  const propertyData: PropertyFormData = {
    ownerName: `Owner ${Math.floor(Math.random() * 1000)}`,
    ownerContact: randomPhone(),
    propertyType,
    rooms: String(1 + Math.floor(Math.random() * 5)),
    address: `${Math.floor(Math.random() * 100)} ${locality} Road`,
    district,
    city,
    locality,
    landmark,
    brokerId:'68e895ab659362fb76946fbe',
    pincode: String(400000 + Math.floor(Math.random() * 9999)),
    area: 500 + Math.floor(Math.random() * 2500),
    floors: 1 + Math.floor(Math.random() * 5),
    furnishing,
    price: 500000 + Math.floor(Math.random() * 5000000),
    status: "available",
    notes: "Auto-generated property for testing."
  };

  const coordinates = randomCoordinates();

  return { propertyData, coordinates };
}
