export interface Booking {
  bookingId: number;
  bookingRef: string;
  totalFare: number;
  status: string;
  bookedAt: Date;
  trip?: {
    busName: string;
    busType: string;
    source: string;
    destination: string;
    departureTime: Date;
    arrivalTime: Date;
  };
  passengers: Passenger[];
}

export interface Passenger {
  name: string;
  age: number;
  gender: string;
  seatNumber: string;
}

export interface CreateBookingPayload {
  tripId: number;
  contactEmail?: string;
  passengers: {
    seatId: number;
    name: string;
    age: number;
    gender: string;
  }[];
}
