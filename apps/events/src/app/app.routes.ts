import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    title: 'GDG Wrocław',
    loadComponent: () => import('./pages/home-page').then((m) => m.HomePage),
  },
  {
    path: 'workshops/:slug',
    title: 'Workshop · GDG Wrocław',
    loadComponent: () =>
      import('./pages/workshop-route').then((m) => m.WorkshopRoute),
  },
  {
    path: 'contact',
    title: 'Contact · GDG Wrocław',
    loadComponent: () =>
      import('./pages/contact-page').then((m) => m.ContactPage),
  },
  {
    path: '**',
    title: 'Page not found · GDG Wrocław',
    loadComponent: () =>
      import('./pages/not-found-page').then((m) => m.NotFoundPage),
  },
];
