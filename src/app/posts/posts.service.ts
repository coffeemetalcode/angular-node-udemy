import { Injectable } from "@angular/core";

import { Subject } from 'rxjs';

import { Post } from "./post.model";

@Injectable({providedIn: 'root'})
export class PostsService {
  private _posts: Post[] = [
    {
      title: 'Dummy Post',
      content: 'Dummy Content'
    }
  ];
  private _postsUpdated = new Subject<Post[]>();

  getPosts() {
    return [...this._posts];
  }

  getPostsUpdatedListener() {
    return this._postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {
      title: title,
      content: content
    };

    this._posts.push(post);
    this._postsUpdated.next([...this._posts]);
  }
}