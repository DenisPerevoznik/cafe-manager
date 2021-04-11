import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize, catchError } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
  signInForm: FormGroup;
  loader: boolean = false;
  unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      this.router.navigate(['']);
    }
    this.signInForm = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  signIn() {
    if (this.signInForm.invalid) return;

    this.loader = true;
    this.authService.login(this.signInForm.value.email, this.signInForm.value.password)
    .pipe(finalize(() => {this.loader = false}), takeUntil(this.unsubscribe))
    .subscribe(() => {},
      response => {
        this.toastService.show('error', response.error.message)});
  }
}
