import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/checkout/checkout.module').then(
        (m) => m.CheckoutModule
      ),
  },
];
