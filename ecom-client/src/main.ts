import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';  // Import the AppModule

platformBrowserDynamic()
  .bootstrapModule(AppModule)  // Bootstrapping the module
  .catch((err) => console.error(err));
