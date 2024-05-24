import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-err-toast',
  standalone: true,
  imports: [],
  templateUrl: './err-toast.component.html',
  styleUrl: './err-toast.component.scss'
})
export class ErrToastComponent {
  @Input() message: string = '';
}
