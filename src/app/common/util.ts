import {fromEvent, interval, Observable} from 'rxjs';


export function createHttpObservable(url: string) {
  return Observable.create(observer => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, {signal})
      .then(resp => {
        if (resp.ok) {
          return resp.json()
        } else {
          observer.error(`Request failed with status code ${resp.status}`);
        }
      })
      .then(body => {
        observer.next(body);
        observer.complete();
      })
      .catch(err => observer.error(err));

    return () => controller.abort(); // this is called when unsubscribe() is executed on the http$ subscription
  });
}

function rxjsBasics() {
  const interval$ = interval(1000);
  const sub = interval$.subscribe(val => console.log(`Stream 1 ${val}`));

  setTimeout(() => sub.unsubscribe(), 5000);

  const click$ = fromEvent(document, 'click');

  click$.subscribe(e => console.log(e), err => console.log(err), () => console.log('completed'));
}

