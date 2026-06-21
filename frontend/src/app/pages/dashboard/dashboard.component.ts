import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { FoodReserveService } from '../../services/food-reserve.service';
import { CourseReserveService } from '../../services/course-reserve.service';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NzAvatarModule, NzButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user: any = null;
  foodReservations: any[] = [];
  courseReservations: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private dashboardService: DashboardService,
    private foodService: FoodReserveService,
    private courseService: CourseReserveService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.dashboardService.getDashboard().subscribe({
      next: (res) => {
        this.user = res.user;
        this.foodReservations = res.food_reservations.map((f: any) => ({ ...f, reserved: true }));
        this.courseReservations = res.course_reservations.map((c: any) => ({ ...c, reserved: true }));

        if (this.user.amount !== undefined) {
          this.profileService.updateAmount(this.user.amount);
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.errorMessage = 'خطا در دریافت داشبورد';
        this.isLoading = false;
      }
    });
  }

  cancelFood(reservationId: number) {
    this.foodService.cancelReservation(reservationId).subscribe({
      next: (res: any) => {
        console.log('Food reservation canceled:', res);
        this.foodReservations = this.foodReservations.filter(f => f.id !== reservationId);
      },
      error: (err) => {
        console.error('Error canceling food reservation:', err);
      }
    });
  }

  cancelCourse(reservationId: number) {
    this.courseService.cancelReservation(reservationId).subscribe({
      next: (res: any) => {
        console.log('Course reservation canceled:', res);
        this.courseReservations = this.courseReservations.filter(c => c.id !== reservationId);
      },
      error: (err) => {
        console.error('Error canceling course reservation:', err);
      }
    });
  }
}
