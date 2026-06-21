import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormPatchModule } from 'ng-zorro-antd/core/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { SharedModule } from '../../shared/shared.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    CommonModule,
    NzFormPatchModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzAvatarModule,
    NzUploadModule,
    NzModalModule,
    SharedModule,
  ],
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  isLoading = false;
  isChangingPassword = false;
  profileData: any = {};
  amount: number = 0;
  passwordChangeMessage: string = '';
  passwordChangeSuccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private message: NzMessageService
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      profile_image: [null],
    });

    this.passwordForm = this.fb.group(
      {
        old_password: ['', [Validators.required]],
        new_password: ['', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.loadProfileData();

    this.profileService.userInfo$.subscribe((user) => {
      if (user) {
        this.profileData = user;
        this.amount = parseFloat(user.amount) || 0;

        this.profileForm.patchValue({
          username: user.username,
          email: user.email,
        });
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('new_password')?.value;
    const confirmPassword = form.get('confirm_password')?.value;

    if (newPassword !== confirmPassword) {
      form.get('confirm_password')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      return null;
    }
  }

  loadProfileData(): void {
    this.isLoading = true;
    this.profileService.getProfileText().subscribe({
      next: (response: string) => {
        console.log('Raw response:', response);

        try {
          const data = JSON.parse(response);
          this.profileData = data;
          this.amount = parseFloat(data.amount) || 0;
          this.profileForm.patchValue({
            username: data.username,
            email: data.email,
          });
        } catch (e) {
          console.error('Response is not JSON:', e);
          this.message.error('Invalid server response');
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.isLoading = false;
        this.message.error('Error loading profile');
      },
    });
  }

  handleFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profileForm.patchValue({ profile_image: file });
      this.profileForm.get('profile_image')?.updateValueAndValidity();
      this.profileForm.markAsDirty();

      const reader = new FileReader();
      reader.onload = () => {
        this.profileData.profile_image = reader.result as string; 
      };
      reader.readAsDataURL(file);
    }
  }

  saveChanges(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('username', this.profileForm.get('username')?.value);
      formData.append('email', this.profileForm.get('email')?.value);

      if (this.profileForm.get('profile_image')?.value) {
        formData.append('profile_image', this.profileForm.get('profile_image')?.value);
      }

      this.profileService.updateProfile(formData).subscribe({
        next: (response) => {
          this.profileData = response;
          this.amount = parseFloat(response.amount) || 0;

          this.profileService.loadUserProfile();

          this.isLoading = false;
          this.message.success('Profile updated successfully');
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.isLoading = false;
          this.message.error('Error updating profile');
        },
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isChangingPassword = true;
      this.passwordChangeMessage = '';

      const passwordData = {
        old_password: this.passwordForm.get('old_password')?.value,
        new_password: this.passwordForm.get('new_password')?.value,
      };

      this.profileService.changePassword(passwordData).subscribe({
        next: (response) => {
          this.passwordChangeSuccess = true;
          this.passwordChangeMessage = response.detail || 'Password changed successfully';
          this.passwordForm.reset();
          this.isChangingPassword = false;
          this.message.success(this.passwordChangeMessage);
        },
        error: (error) => {
          this.passwordChangeSuccess = false;
          this.passwordChangeMessage = error.error?.detail || 'Error changing password';
          this.isChangingPassword = false;
          this.message.error(this.passwordChangeMessage);
        },
      });
    }
  }
}
