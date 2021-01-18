import { Component, OnDestroy, OnInit } from "@angular/core";

import { Subscription } from 'rxjs';

import { PostsService } from "../posts.service";
import { Post } from '../post.model'

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
 /* posts = [
  {
    title: 'the first post title',
    content: 'first content'
  },
  {
    title: 'the second post title',
    content: 'second content'
  },
  {
    title: 'the third post title',
    content: 'third content'
  }
 ]; */
 posts: Post[] = [];
 private _postsSub: Subscription;

 constructor(public postsService: PostsService) { }

 ngOnInit() {
   this.posts = this.postsService.getPosts();

   this._postsSub = this.postsService.getPostsUpdatedListener()
    .subscribe((posts: Post[]) => {
      this.posts = posts;
    });
 }

 ngOnDestroy() {
  this._postsSub.unsubscribe();
 }
}