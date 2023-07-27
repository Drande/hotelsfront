import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl("", { validators: [Validators.required, Validators.email] }),
    password: new FormControl("", { validators: [Validators.required, Validators.minLength(6)] }),
  });
  loading: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {
    
  }

  handleLoginFormSubmit() {
    this.loading = true;
    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).then(_ => {
      // TODO: Implement proper role handling
      if(username.includes("admin")) {
        this.router.navigate(["/admin"]);
      } else {
        this.router.navigate(["/home"]);
      }
    }).catch(error => {
      console.error(error);
    }).finally(() => {
      this.loading = false;
    });
  }
}
