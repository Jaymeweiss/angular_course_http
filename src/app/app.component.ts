import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post} from './post.model';
import {PostsService} from './posts.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  errorSubscription: Subscription;

  constructor(private httpClient: HttpClient, private postsService: PostsService) {
  }

  ngOnInit() {
    this.errorSubscription = this.postsService.error.subscribe(error => {
      this.error = error;
    });
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postsService.storePost(postData.title, postData.content);
    this.loadedPosts = this.postsService.posts;
  }

  onFetchPosts() {
    this.fetchPosts();
  }

  onClearPosts() {
    this.postsService.deleteAllPosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }

  dismissError() {
    this.isFetching = false;
    this.error = null;
  }

  private fetchPosts() {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching = false;
      this.error = error.message;
    });
  }
}
