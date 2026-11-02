import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    title: 'GDG Wrocław',
    loadComponent: () => import('./pages/home-page').then((m) => m.HomePage),
  },
  {
    path: 'devfest',
    title: 'DevFest 2026 · GDG Wrocław',
    loadComponent: () =>
      import('./pages/devfest-agenda-route').then((m) => m.DevfestAgendaRoute),
  },
  {
    path: 'devfest/speakers',
    title: 'Speakers · DevFest 2026 · GDG Wrocław',
    loadComponent: () =>
      import('./pages/devfest-speakers-route').then(
        (m) => m.DevfestSpeakersRoute,
      ),
  },
  {
    path: 'events/:slug',
    title: 'Event · GDG Wrocław',
    loadComponent: () =>
      import('./pages/event-route').then((m) => m.EventRoute),
  },
  // The meetup was published at this URL before the Event page existed (ADR-0025).
  {
    path: 'workshops/ai-cloud-stream-meetup',
    redirectTo: 'events/ai-cloud-stream-meetup',
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
