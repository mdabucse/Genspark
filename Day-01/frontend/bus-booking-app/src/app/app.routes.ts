import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) 
  },
  { 
    path: 'search', 
    loadComponent: () => import('./features/search/search-results/search-results.component').then(m => m.SearchResultsComponent) 
  },
  {
    path: 'help',
    loadComponent: () => import('./features/help/help.component').then(m => m.HelpComponent)
  },
  {
    path: 'offers',
    loadComponent: () => import('./features/offers/offers.component').then(m => m.OffersComponent)
  },
  { 
    path: 'booking/:tripId', 
    loadComponent: () => import('./features/booking/seat-selection/seat-selection.component').then(m => m.SeatSelectionComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'booking/passengers/:tripId', 
    loadComponent: () => import('./features/booking/passenger-form/passenger-form.component').then(m => m.PassengerFormComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'payment/:bookingId', 
    loadComponent: () => import('./features/booking/payment/payment.component').then(m => m.PaymentComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'booking/success/:bookingId', 
    loadComponent: () => import('./features/booking/booking-success/booking-success.component').then(m => m.BookingSuccessComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent),
    canActivate: [authGuard] 
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/dashboard/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/policies/policies.component').then(m => m.PoliciesComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/policies/policies.component').then(m => m.PoliciesComponent)
  },
  {
    path: 'refund',
    loadComponent: () => import('./features/policies/policies.component').then(m => m.PoliciesComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    children: [
      { path: '', loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'routes', loadComponent: () => import('./features/admin/manage-routes/manage-routes.component').then(m => m.ManageRoutesComponent) },
      { path: 'operators', loadComponent: () => import('./features/admin/manage-operators/manage-operators.component').then(m => m.ManageOperatorsComponent) },
      { path: 'bookings', loadComponent: () => import('./features/admin/manage-bookings/manage-bookings.component').then(m => m.ManageBookingsComponent) },
      { path: 'audit-logs', loadComponent: () => import('./features/admin/audit-logs/audit-logs.component').then(m => m.AuditLogsComponent) }
    ]
  },
  {
    path: 'operator',
    loadComponent: () => import('./features/operator/operator-layout/operator-layout.component').then(m => m.OperatorLayoutComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'operator' },
    children: [
      { path: '', loadComponent: () => import('./features/operator/operator-dashboard/operator-dashboard.component').then(m => m.OperatorDashboardComponent) },
      { path: 'buses', loadComponent: () => import('./features/operator/manage-buses/manage-buses.component').then(m => m.ManageBusesComponent) },
      { path: 'trips', loadComponent: () => import('./features/operator/schedule-trips/schedule-trips.component').then(m => m.ScheduleTripsComponent) },
      { path: 'bookings', loadComponent: () => import('./features/operator/operator-bookings/operator-bookings.component').then(m => m.OperatorBookingsComponent) },
      { path: 'buses/:id/layout', loadComponent: () => import('./features/operator/bus-layout-designer/bus-layout-designer.component').then(m => m.BusLayoutDesignerComponent) }
    ]
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];
