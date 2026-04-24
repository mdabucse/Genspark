export interface Trip {
  tripId: number;
  busName: string;
  busType: string;
  seatLayout: string;
  operatorName: string;
  source: string;
  destination: string;
  pickupPoint?: string;
  dropPoint?: string;
  departureTime: Date;
  arrivalTime: Date;
  baseFare: number;
  taxPercent: number;
  totalFare: number;
  availableSeats: number;
  totalSeats: number;
  status: string;
  rows?: number;
  columns?: number;
  hasUpperDeck?: boolean;
}

export interface SeatStatus {
  seatId: number;
  seatNumber: string;
  seatType: string;
  status: 'available' | 'booked' | 'locked';
  row?: number;
  column?: number;
  deck?: string;
}

export interface Route {
  id: number;
  source: string;
  destination: string;
  distanceKm: number;
  tripCount: number;
}
