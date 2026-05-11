import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const requiredRole = route.data['role'];
  const userRole = localStorage.getItem('role');
  if (userRole !== requiredRole) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
