import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  form: FormGroup;
  type = false;

  constructor(
    public router: Router,
    public authService: AuthenticationService
  ) {
    this.initForm();
  }

  ngOnInit() {}

  signUp(email, password) {
    this.authService
      .RegisterUser(email.value, password.value)
      .then((res) => {
        // Do something here
        this.authService.SendVerificationMail();
        this.router.navigate(['menu/listing']);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  initForm() {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }), // added email validator also
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }

  changeType() {
    this.type = !this.type;
  }

  onSubmit(email, password) {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    this.signUp(email, password);
    console.log(this.form.value);
  }
}
