import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Subject } from 'rxjs';

import { Post } from "./post.model";

@Injectable({providedIn: 'root'})
export class PostsService {
  private _posts: Post[] = [];
  private _postsUpdated = new Subject<Post[]>();

  constructor(private _http: HttpClient) {}

  getPosts() {
    return this._http.get<{message: string, posts: Post[]}>('http://localhost:8080/api/posts')
      .subscribe((data) => {
        this._posts = data.posts;
        this._postsUpdated.next([...this._posts])
      });
  }

  getPostsUpdatedListener() {
    return this._postsUpdated.asObservable();
  }

  addPost(id: null, title: string, content: string) {
    const post: Post = {
      id: id,
      title: title,
      content: content
    };
    this._http.post<{message: string}>('http://localhost:8080/api/posts', post)
      .subscribe((data) => {
        console.log(data.message);
        this._posts.push(post);
        this._postsUpdated.next([...this._posts]);
      });
  }
}