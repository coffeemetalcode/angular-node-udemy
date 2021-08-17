/* Angular Module imports */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

/* rxjs imports */
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

/* Data model imports */
import { Post } from "./post.model";

@Injectable({providedIn: 'root'})
export class PostsService {
  private _posts: Post[] = [];
  private _postsUpdated = new Subject<Post[]>();

  constructor(private _http: HttpClient, private _router: Router) {}

  getPosts() {
    return this._http.get<{message: string, posts: any}>('http://localhost:8080/api/posts')
    .pipe(map((data) => {
      // console.log('The original data', data.posts);
      return data.posts.map((post) => {
        return {
          id: post._id,
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl
        }
      });
      
    }))
    .subscribe((posts) => {
      // console.log('The transformed data', posts);
      this._posts = posts;
      this._postsUpdated.next([...this._posts]);
    });
  }

  getPost(id: string) {
    // return {...this._posts.find((post) => post.id === id)};
    return this._http.get<{_id: string, title: string, content: string}>(
      'http://localhost:8080/api/posts/' + id
    );
  }

  getPostsUpdatedListener() {
    return this._postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this._http.post<{ message: string, post: Post }>('http://localhost:8080/api/posts', postData)
      .subscribe((data) => {
        const post: Post = {
          id: data.post.id,
          title: data.post.title,
          content: data.post.content,
          imageUrl: data.post.imageUrl
        }
        this._posts.push(post);
        this._postsUpdated.next([...this._posts]);
        this._router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {
      id: id,
      title: title,
      content: content,
      imageUrl: null
    };

    this._http.put<{ message: string, id: string }>('http://localhost:8080/api/posts/' + id, post)
      .subscribe((data) => {
        console.log(data.message);
        this._router.navigate(['/']);

        // update local copy of post optimistically
        // TODO: understand what this is doing

        /* const updatedPosts = [...this._posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this._posts = updatedPosts;
        this._postsUpdated.next([...this._posts]); */
      });
  }

  deletePost(id: string) {
    this._http.delete<{ message: string }>('http://localhost:8080/api/posts/' + id)
      .subscribe((data) => {
        console.log(data.message);
        const updatedPosts = this._posts.filter((post) => post.id !== id);
        this._posts = updatedPosts;
        this._postsUpdated.next([...this._posts]);
      });
  }
}