import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delayWhen, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses: Observable<Course[]>;
  advancedCourses: Observable<Course[]>;

  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');

    const courses$ = http$.pipe(
      catchError(e => {
        console.log(`Error occurred ${e}`);

        return throwError(e);
      }),
      tap(() => console.log('HTTP request executed')),
      map(res => res['payload']),
      shareReplay(),
      finalize(() => console.log('Finalized.'))
    );

    this.beginnerCourses = courses$.pipe(
      map((courses: Course[]) => courses.filter(course => course.category === 'BEGINNER'))
    );

    this.advancedCourses = courses$.pipe(
      map((courses: Course[]) => courses.filter(course => course.category === 'ADVANCED'))
    );
  }
}
