import { Routes } from '@angular/router';
import { Home } from './pages/Home/home';
import { Login } from './pages/login/login';
import { Profile } from './pages/profile/profile';
import { Calendar } from './pages/calendar/calendar'
import {CarSelect} from "./pages/car_select/car_select";
import {TallerInformacion} from "./pages/TalleresInformacion/TallerInformacion";
import {Reviews} from './pages/reviews/reviews';
import { InfoComponent } from './components/text/text';



export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'profile', component: Profile },
  {path: 'TallerInformacion/:id', component: TallerInformacion },
  {path: 'reviews/:id', component: Reviews },
  {path: 'calendar/:id', component: Calendar },
  {path: 'car_select/:id', component: CarSelect },
  { path: 'text/:id', component: InfoComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
