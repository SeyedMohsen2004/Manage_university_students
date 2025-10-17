import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { DepositService } from '../../services/deposit.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './deposit.component.html',
})
export class DepositComponent {
  amount: number | null = null;
  isLoading = false;

  constructor(
    private message: NzMessageService,
    private depositService: DepositService,
    private profileService: ProfileService
  ) { }

  deposit() {
    if (!this.amount || this.amount <= 0) {
      this.message.error('Please enter a valid amount');
      return;
    }

    this.isLoading = true;

    this.depositService.deposit(this.amount).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.message.success(res.detail || 'Deposit successful');
        this.amount = null;
        console.log('New balance:', res.new_amount);

        if (res.new_amount !== undefined) {
          this.profileService.updateAmount(res.new_amount.toString());
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err.error?.detail || 'Deposit failed');
      },
    });
  }
}
