import {Injectable} from '@angular/core';
import {Post} from './post.model';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {Observable, Subject, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  posts: Post[];
  error = new Subject<string>();

  constructor(private httpClient: HttpClient) {
    this.posts = [];
  }

  storePost(title: string, content: string): void {
    const postData: Post = {title, content};
    this.httpClient.post('https://ng-complete-guide-c9a62-default-rtdb.firebaseio.com/posts.json',
      postData,
      {
        observe: 'response'
      }
    )
      .subscribe(() => {
        this.posts.push(postData);
      }, error => {
        this.error.next(error.message);
      });
  }

  fetchPosts(): Observable<any> {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('foo', 'bar');
    return this.httpClient.get('https://ng-complete-guide-c9a62-default-rtdb.firebaseio.com/posts.json',
      {
        headers: new HttpHeaders({'Custom-Header': 'Hello'}),
        params: searchParams
      })
      .pipe(map((responseData: { [key: string]: Post }) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({...responseData[key], id: key});
            }
          }
          return postArray;
        }),
        catchError(errorResponse => {
          // Send to logging / analytics server
          // Pass it on
          return throwError(errorResponse);
        })
      );
  }

  deleteAllPosts(): Observable<any> {
    return this.httpClient.delete('https://ng-complete-guide-c9a62-default-rtdb.firebaseio.com/posts.json', {
      observe: 'events',
      responseType: 'json' // blob, text etc.
    })
      .pipe(tap(event => {
        console.log(event);
        if (event.type === HttpEventType.Response) {
          console.log(event.body);
        }
      }));
  }
}
