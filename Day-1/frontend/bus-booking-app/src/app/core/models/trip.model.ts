export interface Trip {
  tripId: number;
  busName: string;
  busType: string;
  seatLayout: string;
  operatorName: string;
  source: string;
  destination: string;
  departureTime: Date;
  arrivalTime: Date;
  baseFare: number;
  taxPercent: number;
  totalFare: number;
  availableSeats: number;
  totalSeats: number;
  status: string;
}

export interface SeatStatus {
  seatId: number;
  seatNumber: string;
  seatType: string;
  status: 'available' | 'booked' | 'locked';
}

export interface Route {
  id: number;
  source: string;
  destination: string;
  distanceKm: number;
  tripCount: number;
}
