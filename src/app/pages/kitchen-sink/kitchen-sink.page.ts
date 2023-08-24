import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlDrawer } from '@shoelace-style/shoelace';

@Component({
  selector: 'app-kitchen-sink',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  imports: [CommonModule],
  templateUrl: './kitchen-sink.page.html',
})
export class KitchenSinkComponent {
  @ViewChild('drawer')
  drawer?: ElementRef<SlDrawer>;

  showDrawer() {
    this.drawer?.nativeElement.show();
  }
}
