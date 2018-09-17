import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {createHttpObservable} from '../common/util';
import {map} from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() {
  }


  ngOnInit() {
    const req$ = createHttpObservable('/api/courses');
    const sub$ = req$.subscribe();

    setTimeout(() => sub$.unsubscribe(), 0);
  }
}
