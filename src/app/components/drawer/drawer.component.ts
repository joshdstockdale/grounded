import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlDrawer } from '@shoelace-style/shoelace';

@Component({
  selector: 'app-drawer',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent {
  @ViewChild('drawer')
  drawer?: ElementRef<SlDrawer>;

  showDrawer() {
    this.drawer?.nativeElement.show();
  }
}
