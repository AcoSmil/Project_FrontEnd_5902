import { Routes } from '@angular/router';
import { DashboardPageComponent } from './features/dashboard/dashboard-page.component';
import { ExhibitsPageComponent } from './features/exhibits/exhibits-page.component';
import { UsersPageComponent } from './features/users/users-page.component';
import { BookmarksPageComponent } from './features/bookmarks/bookmarks-page.component';
import { LogsPageComponent } from './features/logs/logs-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'exhibits', component: ExhibitsPageComponent },
  { path: 'users', component: UsersPageComponent },
  { path: 'bookmarks', component: BookmarksPageComponent },
  { path: 'logs', component: LogsPageComponent },
  { path: '**', redirectTo: 'dashboard' },
];
