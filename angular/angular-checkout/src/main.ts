import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appRoutes } from './app/app.routing';
import { provideRouter } from '@angular/router';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule),
        provideRouter(appRoutes),
        provideAnimations(),
    ]
})
  .catch((err) => console.error(err));
