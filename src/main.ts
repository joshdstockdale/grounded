import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
setBasePath('dist/shoelace/');
import { registerIconLibrary } from '@shoelace-style/shoelace/dist/utilities/icon-library.js';

registerIconLibrary('heroicons', {
  resolver: (name) =>
    `https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/${name}.svg`,
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
