import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Booking, CreateBookingPayload } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  lockSeats(tripId: number, seatIds: number[]) {
    return this.http.post<{ success: boolean; lockExpiry: Date; message: string }>(
      `${this.apiUrl}/seats/lock`,
      { tripId, seatIds }
    );
  }

  createBooking(payload: CreateBookingPayload) {
    return this.http.post<Booking>(`${this.apiUrl}/bookings`, payload);
  }

  getBookingDetails(id: number) {
    return this.http.get<Booking>(`${this.apiUrl}/bookings/${id}`);
  }

  getUserBookings() {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings`);
  }

  cancelBooking(id: number) {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/bookings/${id}`);
  }

  dummyPay(bookingId: number) {
    return this.http.post<{ success: boolean; message: string; transactionId: string }>(
      `${this.apiUrl}/payments/dummy-pay`,
      { bookingId }
    );
  }

  downloadTicket(id: number) {
    return this.http.get(`${this.apiUrl}/bookings/${id}/ticket`, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  getCancellationQuote(id: number) {
    return this.http.get<CancellationQuote>(`${this.apiUrl}/bookings/${id}/cancellation-quote`);
  }
}

export interface CancellationQuote {
  bookingId: number;
  totalAmount: number;
  refundAmount: number;
  deductionAmount: number;
  cancellationPolicy: string;
  canCancel: boolean;
  cannotCancelReason?: string;
}
