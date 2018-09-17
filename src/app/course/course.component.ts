import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

  course$: Observable<Course>;
  lessons$: Observable<Lesson>;
  courseId: number;

  @ViewChild('searchInput') input: ElementRef;

  constructor(private route: ActivatedRoute) {


  }

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];

    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);
    this.lessons$ = this.loadLessons();
  }

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        map((e: any) => e.target.value),
        debounceTime(400),
        distinctUntilChanged(),
        concatMap(serch => this.loadLessons(serch))
      )
      .subscribe(console.log);
  }

  loadLessons(search?: string) {
    const filter = search ? `filter=${search}` : '';
    const courseId = this.courseId ? `courseId=${this.courseId}` : '';
    const queryParams = [filter, courseId].join('&');
    const url = ['/api/lessons', queryParams].join('?');

    return createHttpObservable(url).pipe(
      map(res => res['payload'])
    );
  }
}
