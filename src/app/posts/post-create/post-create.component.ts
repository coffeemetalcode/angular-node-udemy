import { Component } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html'
})
export class PostCreateComponent {
  title = 'Create a Post';
  enteredValue = '';
  newPost = 'NO CONTENT';

  onAddPost() {
    // console.dir(input);
    this.newPost = this.enteredValue;
  }
}