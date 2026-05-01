import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import{ HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent, FooterComponent],
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('BuscaTaller');

  private router = inject(Router);

  public showLayout = signal(true);

  ngOnInit() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const noLayoutRoutes = ['/login'];
        const currentUrl = event.urlAfterRedirects.split('?')[0];
        this.showLayout.set(!noLayoutRoutes.includes(currentUrl));
      });
  }
}
