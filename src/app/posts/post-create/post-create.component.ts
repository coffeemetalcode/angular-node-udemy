import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  mode = 'create';
  post: Post;
  imagePreview: string;

  private _postId: string;

  constructor(public route: ActivatedRoute, public postsService: PostsService) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this._postId = paramMap.get('id');
        this.isLoading = true;
        this.postsService.getPost(this._postId).subscribe((post) => {
          this.isLoading = false;
          this.post = {
            id: post._id,
            title: post.title,
            content: post.content,
            imageUrl: null
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          });
        });
      } else {
        this.mode = 'create';
        this._postId = null;
      }
    });
  }
  
  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    
    const id = null;
    const title = this.form.value.title;
    const content = this.form.value.content;
    const image = this.form.value.image;
    
    if (this.mode === 'create') {
      this.postsService.addPost(title, content, image);
    } else if (this.mode === 'edit') {
      this.postsService.updatePost(this._postId, title, content);
    }

    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}