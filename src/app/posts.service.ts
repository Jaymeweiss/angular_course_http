import {Injectable} from '@angular/core';
import {Post} from './post.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  posts: Post[];

  constructor(private httpClient: HttpClient) {
    this.posts = [];
  }

  storePost(title: string, content: string): void {
    const postData: Post = {title, content};
    this.httpClient.post('https://ng-complete-guide-c9a62-default-rtdb.firebaseio.com/posts.json', postData)
      .subscribe(() => {
        this.posts.push(postData);
      });
  }

  fetchPosts(): Observable<any> {
    return this.httpClient.get('https://ng-complete-guide-c9a62-default-rtdb.firebaseio.com/posts.json')
      .pipe(map((responseData: { [key: string]: Post }) => {
        const postArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postArray.push({...responseData[key], id: key});
          }
        }
        return postArray;
      }));
  }
}
