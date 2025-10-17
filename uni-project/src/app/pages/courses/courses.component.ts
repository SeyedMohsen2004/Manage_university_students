import { Component, OnInit } from '@angular/core';
import { CourseReserveService } from '../../services/course-reserve.service';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, SharedModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private courseService: CourseReserveService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.courseService.getCourses().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.courses = res.map((course: any) => ({
          ...course,
          reserved: false,
          reservationId: null
        }));
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.errorMessage = 'خطا در دریافت دوره‌ها';
        this.isLoading = false;
      }
    });
  }

  reserve(courseId: number | string) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;

    this.courseService.reserveCourse(courseId).subscribe({
      next: (res: any) => {
        console.log('Course reserved successfully:', res);
        course.reserved = true;
        course.reservationId = res.reservation_id;
        this.message.success('Course reserved successfully!');
      },
      error: (err: any) => {
        console.error('Error reserving course:', err);
        if (err.error?.detail) {
          this.message.error(err.error.detail);
        } else {
          this.message.error('Failed to reserve course. Please try again.');
        }
      }
    });
  }

  cancelReservation(reservationId: number | string) {
    const course = this.courses.find(c => c.reservationId === reservationId);
    if (!course) return;

    this.courseService.cancelReservation(reservationId).subscribe({
      next: (res: any) => {
        console.log('Reservation canceled:', res);
        course.reserved = false;
        course.reservationId = null;
        this.message.success('Reservation canceled and refunded!');
      },
      error: (err: any) => {
        console.error('Error canceling reservation:', err);
        if (err.error?.detail) {
          this.message.warning(err.error.detail);
        } else {
          this.message.error('Failed to cancel reservation. Please try again.');
        }
      }
    });
  }
}
