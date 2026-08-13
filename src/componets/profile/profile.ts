import { Component, inject, OnInit, signal } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { Profiledata } from '../../models/profile.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private profileService = inject(ProfileService);
  profile = signal<Profiledata | null>(null);
  loading = signal(true);
  private fb = inject(FormBuilder);
  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]
    ],

  })

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.profileService.getProfile().subscribe({
      next: (res: any) => {
        // console.log(res);
        this.profile.set(res.data)
        this.loading.set(false)
        this.profileForm.patchValue({
          firstName: res.data.fname,
          lastName: res.data.lname,
          phone: res.data.phone
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.loading.set(false)
      }
    })
  }
  updateProfile() {

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.profileService.updateProfile(this.profileForm.value)
      .subscribe({

        next: (res: any) => {

          this.profile.set(res.data);
          this.getProfile();
          (document.getElementById('closeModalBtn') as HTMLButtonElement)?.click();

          // alert('Profile updated successfully');

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

}
