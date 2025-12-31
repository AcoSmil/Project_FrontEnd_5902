import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiKeyInterceptor } from './core/interceptors/api-key.interceptor';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

import { DashboardPageComponent } from './features/dashboard/dashboard-page.component';
import { ExhibitsPageComponent } from './features/exhibits/exhibits-page.component';
import { UsersPageComponent } from './features/users/users-page.component';
import { BookmarksPageComponent } from './features/bookmarks/bookmarks-page.component';
import { LogsPageComponent } from './features/logs/logs-page.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    // Import standalone page components so the router can instantiate them
    DashboardPageComponent,
    ExhibitsPageComponent,
    UsersPageComponent,
    BookmarksPageComponent,
    LogsPageComponent,
  ],
})
export class AppModule {}
