import {
  AfterViewChecked,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import './components/shoelace/shoelace';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewChecked {
  //logoClass = 'scale-[2.0] translate-y-10';
  logoClass = '';
  // splashClasses = 'opacity-0';

  onWindowScroll() {
    // this.splashClasses = 'opacity-0';
    if (window.scrollY > 0) {
      this.logoClass = 'scale-[.6]';
    } else {
      this.logoClass = 'scale-100';
    }
  }
  ngAfterViewChecked(): void {
    // setTimeout(() => {
    //   this.logoClass = 'scale-100';
    //   this.splashClasses = 'opacity-0';
    // }, 3000);
  }

  get currentYear(): string {
    return new Date().getFullYear().toString();
  }
}
