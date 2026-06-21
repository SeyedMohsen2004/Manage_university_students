import { Component, OnInit } from '@angular/core';
import { FoodReserveService } from '../../services/food-reserve.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-food-reserve',
  imports: [CommonModule, SharedModule],
  templateUrl: './food-reserve.component.html',
  styleUrls: ['./food-reserve.component.scss'],
})
export class FoodReserveComponent implements OnInit {
  foods: any[] = [];
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private foodService: FoodReserveService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadFoods();
  }

  loadFoods(): void {
    this.isLoading = true;
    this.foodService.getFoods().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.foods = res.map((food: any) => ({ ...food, isReserved: false }));
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.error('Error fetching foods:', err);
        this.message.error('Could not load food list. Please try again later.');
      },
    });
  }

  reserveFood(foodId: number): void {
    const foodItem = this.foods.find(f => f.id === foodId);
    if (!foodItem) return;

    this.foodService.reserveFood(foodId).subscribe({
      next: (res: any) => {
        console.log('Food reserved successfully:', res);
        foodItem.isReserved = true;
        foodItem.reservationId = res.reservation_id;
        this.message.success(`Food reserved! New balance: ${res.new_amount}`);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error reserving food:', err);
        foodItem.isReserved = false;

        if (err.error?.detail) {
          this.message.error(err.error.detail);
        } else {
          this.message.error('Failed to reserve food. Please try again.');
        }
      }
    });
  }

  cancelReservation(foodId: number): void {
    const foodItem = this.foods.find(f => f.id === foodId);
    if (!foodItem || !foodItem.reservationId) return;

    this.foodService.cancelReservation(foodItem.reservationId).subscribe({
      next: (res: any) => {
        console.log('Reservation canceled successfully:', res);
        foodItem.isReserved = false;
        foodItem.reservationId = null;
        this.message.success(`Cancelled! New balance: ${res.new_amount}`);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error canceling reservation:', err);

        if (err.error?.detail) {
          this.message.warning(err.error.detail);
        } else {
          this.message.error('Failed to cancel reservation. Please try again.');
        }
      }
    });
  }

  getFoodEmoji(category: string): string {
    const emojiMap: {[key: string]: string} = {
      'Pizza': '🍕',
      'Burger': '🍔',
      'Pasta': '🍝',
      'Salad': '🥗',
      'Dessert': '🍰',
      'Breakfast': '🥞',
      'Seafood': '🐟',
      'Vegetarian': '🥦',
      'Drink': '🥤',
      'Coffee': '☕'
    };
    
    return emojiMap[category] || '🍽️';
  }
}