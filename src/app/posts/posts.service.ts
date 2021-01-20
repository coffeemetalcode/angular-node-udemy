import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Post } from "./post.model";

@Injectable({providedIn: 'root'})
export class PostsService {
  private _posts: Post[] = [];
  private _postsUpdated = new Subject<Post[]>();

  constructor(private _http: HttpClient) {}

  getPosts() {
    return this._http.get<{message: string, posts: any}>('http://localhost:8080/api/posts')
    .pipe(map((data) => {
      // console.log('The original data', data.posts);
      return data.posts.map((post) => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        }
      });
      
    }))
    .subscribe((posts) => {
      // console.log('The transformed data', posts);
      this._posts = posts;
      this._postsUpdated.next([...this._posts]);
    });
  }

  getPostsUpdatedListener() {
    return this._postsUpdated.asObservable();
  }

  addPost(id: string, title: string, content: string) {
    const post: Post = {
      id: id,
      title: title,
      content: content
    };
    this._http.post<{ message: string, id: string }>('http://localhost:8080/api/posts', post)
      .subscribe((data) => {
        post.id = data.id;
        this._posts.push(post);
        this._postsUpdated.next([...this._posts]);
      });
  }

  deletePost(id: string) {
    this._http.delete<{ message: string }>('http://localhost:8080/api/posts/' + id)
      .subscribe((data) => {
        const updatedPosts = this._posts.filter((post) => post.id !== id);
        this._posts = updatedPosts;
        this._postsUpdated.next([...this._posts]);
      });
  }
}