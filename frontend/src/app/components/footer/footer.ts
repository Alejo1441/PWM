import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.html',
})
export class FooterComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  idTaller: string | null = null;

  ngOnInit() {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {

      let route = this.activatedRoute.root;
      while (route.firstChild) {
        route = route.firstChild;
      }

      this.idTaller = route.snapshot.paramMap.get('id');
    });
  }
}
