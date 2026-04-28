import { Routes } from '@angular/router';
import { Home } from './pages/Home/home';
import { Login } from './pages/login/login';
import { Profile } from './pages/profile/profile'; // <--- MIRA ESTO

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'profile', component: Profile }, // <--- DEBE COINCIDIR CON LA CLASE
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];