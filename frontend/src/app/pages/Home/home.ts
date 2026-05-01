import { Component} from '@angular/core';
import { TallerPrevisualizacion } from '../../components/talleresPrevisualizacion/TallerPrevisualizacion';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TallerPrevisualizacion],
  templateUrl: './home.html',
})
export class Home {}
