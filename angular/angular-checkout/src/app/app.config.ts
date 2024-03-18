import { provideRouter } from '@angular/router';

import { provideAnimations } from '@angular/platform-browser/animations';
import { appRoutes } from './app.routing';

export const appConfig = {
  providers: [provideRouter(appRoutes), provideAnimations()],
};
