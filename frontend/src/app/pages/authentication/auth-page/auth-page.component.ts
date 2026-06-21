import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../../services/authentication/auth.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { IAuthCredentials } from '../../../interfaces/interfaces';
import { MessageService } from '../../../services/message.service';
import { SharedModule } from "../../../shared/shared.module";
import { ModalService } from '../../../services/modal.service';
import { Observable, Observer } from 'rxjs';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-auth-page',
  imports: [NzIconModule, FormsModule, CommonModule, FormsModule, SharedModule, NzUploadModule,],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss'
})
export class AuthPageComponent {
  isActive = false;

  toggleActive() {
    this.isActive = !this.isActive;
  }

  LoginData: IAuthCredentials = {
    username: '',
    password: '',
  };
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private message: MessageService,
    private modal: ModalService,
  ) { }

  // Register
  registerForm = {
    username: '',
    password: '',
    email: '',
    profileimg: null as File | null
  };

  // Profile Pic 
  loading = false;
  avatarUrl?: string;

  onCustomFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.message.show('error', 'Only JPG or PNG files are allowed!');
      return;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      this.message.show('success', 'Image must be smaller than 5MB!');
      return;
    }

    this.loading = true;

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarUrl = reader.result as string;
      this.registerForm.profileimg = file;
      this.loading = false;
    };
    reader.onerror = () => {
      this.message.show('error', 'Failed to upload image');
      this.loading = false;
    };
    reader.readAsDataURL(file);
  }

  removeAvatar(): void {
    this.avatarUrl = undefined;
    this.registerForm.profileimg = null;
  }

  addProfile() {
    this.modal.toggleModal('addProfilePicture');
  }

  profilePicSave(confirmed: boolean) {
    if (confirmed && this.registerForm.profileimg) {
      this.message.show('success', 'Profile picture saved successfully!');
    }
  }

  submitRegisterForm(): void {
    const { username, password, email, profileimg } = this.registerForm;

    if (!username || !password || !email) {
      this.message.show('warning', 'Please complete all required fields!');
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);

    if (profileimg) {
      formData.append('profile_image', profileimg);
    }

    this.sendRegister(formData);
  }

  private sendRegister(formData: FormData) {
    console.log('📤 Sending FormData:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    this.authService.register(formData).subscribe({
      next: (res) => {
        console.log('✅ Server response:', res);
        this.message.show('success', 'Registration successful!');
        this.loading = false;

        this.LoginData.username = this.registerForm.username;
        this.LoginData.password = this.registerForm.password;

        this.isActive = false;
      },
      error: (err) => {
        console.log('❌ Error:', err);
        const errorMessage = this.getErrorMessage(err);
        this.message.show('error', errorMessage);
        this.loading = false;
      },
    });
  }




  // Login
  handleLogin() {
    this.isLoading = true;

    if (!this.LoginData.username || !this.LoginData.password) {
      this.message.show('warning', 'Please enter username and password');
      this.isLoading = false;
      return;
    }

    this.authService.login(this.LoginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response) {
          console.log('Login successful, received response:', response);

          if (response.access && response.refresh) {
            localStorage.setItem('access_token', response.access);
            localStorage.setItem('refresh_token', response.refresh);
          }

          this.message.show('success', 'Login successful!');
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.log('❌ Login error:', err);

        const errorMessage = this.getErrorMessage(err);
        this.message.show('error', errorMessage);

        this.isLoading = false;
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.error) {
      if (error.error.detail) {
        return error.error.detail;
      }

      if (error.error.username) {
        return Array.isArray(error.error.username)
          ? error.error.username.join(', ')
          : error.error.username;
      }

      if (error.error.email) {
        return Array.isArray(error.error.email)
          ? error.error.email.join(', ')
          : error.error.email;
      }

      if (error.error.password) {
        return Array.isArray(error.error.password)
          ? error.error.password.join(', ')
          : error.error.password;
      }

      if (error.error.error && typeof error.error.error === 'string') {
        return error.error.error;
      }

      if (Array.isArray(error.error) && error.error.length > 0) {
        return error.error[0];
      }

      if (error.error.message) {
        return error.error.message;
      }

      if (typeof error.error === 'string') {
        return error.error;
      }
    }

    if (error.status === 0) {
      return 'Network error: Please check your internet connection';
    }

    if (error.status === 400) {
      return 'Bad request: Please check your input data';
    }

    if (error.status === 401) {
      return 'Unauthorized: Invalid credentials';
    }

    if (error.status === 403) {
      return 'Forbidden: Access denied';
    }

    if (error.status === 404) {
      return 'Not found: The requested resource was not found';
    }

    if (error.status >= 500) {
      return 'Server error: Please try again later';
    }

    return 'An unexpected error occurred. Please try again.';
  }
}