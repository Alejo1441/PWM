import { Routes } from '@angular/router';
import { TallerInformacion} from './pages/TalleresInformacion/TallerInformacion';
import { Home} from './pages/Home/home';

export const routes: Routes = [
  { path: 'TallerInfo', component: TallerInformacion },
  { path: 'home', component: Home},
];
