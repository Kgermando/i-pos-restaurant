import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; 
import { Router } from '@angular/router'; 
import { routes } from '../../shared/routes/routes';
import { AuthService } from '../auth.service';
import { IUser } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  dateY = "";
  public routes = routes;
  isLoading = false;

  form!: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.dateY = formatDate(new Date(), 'yyyy', 'en');
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      var body = {
        email: this.form.value.email.toLowerCase(),
        password: this.form.value.password
      };

      this.authService.login(body).subscribe({
        next: (res) => {
          console.log("res", res)
          // this.authService.storeToken(res.token);
          this.authService.user().subscribe({
            next: (user) => {
              this.isLoading = false;
              if (user.role == 'Support') {
                this.router.navigate([this.routes.entrepriseList]);
              } else if (user.role == 'Manager général') {
                this.router.navigate([this.routes.dashboard]);
              } else {
                this.router.navigate([this.routes.commandeList]);
              }
              this.toastr.success(`Bienvenue ${user.fullname} ! 🎉`, 'Success!');
              // this.router.navigate(['/web']);
              
            },
            error: (error) => {
              this.isLoading = false;
              this.router.navigate(['/auth/login']);
              console.log(error);
            }
          });
        },
        error: (e) => {
          this.isLoading = false;
          console.error(e);
          this.toastr.error(`${e.error.message}`, 'Oupss!');
          this.router.navigate(['/auth/login']);
        },
      }
      )
    }
  }
 
  public password: boolean[] = [false];

  public togglePassword(index: any) {
    this.password[index] = !this.password[index]
  }


}
