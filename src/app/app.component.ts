import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map, filter } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'KioskoTuristico';

  constructor(private titleService: Title,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const appTitle = this.titleService.getTitle();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.route.firstChild;

        while (child?.firstChild) {
          child = child.firstChild;
        }

        if (child?.snapshot.data['title']) {
          return child?.snapshot.data['title'];
        }
        return appTitle;
      })
    ).subscribe((newTitle: string) => {
      this.titleService.setTitle(newTitle);
    });
  }

}
