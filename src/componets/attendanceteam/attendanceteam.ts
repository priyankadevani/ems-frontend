import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, NgZone, Signal } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attendanceteam',
  imports: [CommonModule],
  templateUrl: './attendanceteam.html',
  styleUrl: './attendanceteam.css',
})
export class Attendanceteam {

  private attendanceService = inject(AttendanceService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  attendanceScope: 'team' | "organization" = 'team';
  //private ngzone = inject(NgZone);

  todayAttendance: any[] = [];
  attendanceHistory: any[] = [];

  loadingToday = false;
  loadingHistory = false;

  ngOnInit() {
    this.attendanceScope = this.route.snapshot.data['attendanceScope'] || "team";
    this.loadTodayAttendance();
    this.loadAttendanceHistory();
  }

  loadTodayAttendance() {
    this.loadingToday = true;
    const request = this.attendanceScope === 'organization' ?
      this.attendanceService.getOrganizationAttendance() :
      this.attendanceService.getTodaysAttendance();
    request.subscribe((res: any) => {
      //this.ngzone.run(() => {
      this.todayAttendance = res.data;
      // console.log("today response:", res.data);
      // console.log("today var:", this.todayAttendance);

      this.loadingToday = false;
      this.cdr.detectChanges();

      //  })

    })
  }

  loadAttendanceHistory() {
    this.loadingHistory = true;
    const request = this.attendanceScope === 'organization' ?
      this.attendanceService.getOrganizationAttendanceHistory() :
      this.attendanceService.getAttendanceHistory();
    request.subscribe((res: any) => {
      // this.ngzone.run(() => {
      this.attendanceHistory = res.data;
      console.log("history response:", res.data);
      //console.log("history var:", this.attendanceHistory);
      this.loadingHistory = false;
      this.cdr.detectChanges();
      //  })


    })
  }



}

