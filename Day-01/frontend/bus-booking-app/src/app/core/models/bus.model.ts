export interface Bus {
  id: number;
  operatorId: number;
  busNumber: string;
  busName: string;
  capacity: number;
  busType: string;
  seatLayout: string;
  isActive: boolean;
  createdAt: Date;
}
