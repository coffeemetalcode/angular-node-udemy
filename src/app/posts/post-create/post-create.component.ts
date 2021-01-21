import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  post: Post;
  mode = 'create';
  private _postId: string;

  constructor(public route: ActivatedRoute, public postsService: PostsService) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this._postId = paramMap.get('id');
        this.postsService.getPost(this._postId).subscribe((post) => {
          this.post = {
            id: post._id,
            title: post.title,
            content: post.content
          }
        });
      } else {
        this.mode = 'create';
        this._postId = null;
      }
    });
  }
  
  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const id = null;
    const title = form.value.title;
    const content = form.value.content;
    
    if (this.mode === 'create') {
      this.postsService.addPost(id, title, content);
    } else if (this.mode === 'edit') {
      this.postsService.updatePost(this._postId, title, content);
    }

    form.resetForm();
  }
}