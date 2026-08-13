import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendancelist',
  imports: [CommonModule],
  templateUrl: './attendancelist.html',
  styleUrl: './attendancelist.css',
})
export class Attendancelist implements OnInit {
  private attendanceService = inject(AttendanceService);
  private cdr = inject(ChangeDetectorRef);


  todayAttendance: any = null;
  attendanceHistory: any[] = [];

  loading = false;

  ngOnInit(): void {
    //this.loadTodayAttendance();
    this.loadMyTodayAttendance();
    this.loadAttendanceHistory();
  }


  // loadTodayAttendance() {
  //   this.attendanceService.getTodaysAttendance().subscribe({
  //     next: (res: any) => {
  //       this.todayAttendance = res.data.length > 0 ? res.data[0] : null;
  //     },
  //     error: (err: any) => {
  //       console.error(err);
  //     }
  //   });
  // }

  loadMyTodayAttendance() {
    this.attendanceService.getMyTodayAttendance().subscribe({
      next: (res: any) => {
        // console.log("myToday:", res);
        this.todayAttendance = res.data;

        this.cdr.detectChanges();
        //this.loadMyTodayAttendance();
        //console.log("todayAttendance:", this.todayAttendance);
      }
    });
  }

  loadAttendanceHistory() {
    this.attendanceService.myAttendance().subscribe({
      next: (res: any) => {
        this.attendanceHistory = res.data || [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }
  loadAllAttendanceHistory() {
    this.attendanceService.getTodaysAttendance().subscribe({
      next: (res: any) => {
        this.attendanceHistory = res.data || [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  checkIn() {
    this.loading = true;

    this.attendanceService.checkIn().subscribe({
      next: () => {
        this.loading = false;
        this.loadMyTodayAttendance();
        // this.loadTodayAttendance();
        this.loadAttendanceHistory();
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    });
  }

  checkOut() {
    this.loading = true;

    this.attendanceService.checkOut().subscribe({
      next: () => {
        this.loading = false;
        //this.loadTodayAttendance();
        this.loadMyTodayAttendance();
        this.loadAttendanceHistory();
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    });
  }

}

