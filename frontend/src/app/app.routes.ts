import { Routes } from '@angular/router';
import { Home } from './pages/Home/home';
import { Login } from './pages/login/login';
import { Profile } from './pages/profile/profile';
import { Calendar } from './pages/calendar/calendar'
import {CarSelect} from "./pages/car_select/car_select";

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'profile', component: Profile },
  {path: 'calendar/:id', component: Calendar },
  {path: 'car_select/:id', component: CarSelect },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];