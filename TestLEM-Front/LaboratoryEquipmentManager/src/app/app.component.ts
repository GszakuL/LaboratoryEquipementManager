import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from './auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private inactivityTime: any; // Timer do inaktywności
  private timeoutDuration: number = 2 * 60 * 1000; // 5 minut

  constructor(private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.resetTimer();
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/devices-list']);
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.resetTimer();
      }
    });

    window.addEventListener('beforeunload', () => {
      this.authService.logout();
    });
  }
  title = 'LaboratoryEquipmentManager';

  resetTimer() {
    this.clearTimer();

    this.inactivityTime = setTimeout(() => {
      if (this.authService.isAuthenticated()) {  // Sprawdzaj logowanie tutaj
        this.authService.logout();
        this.router.navigate(['/login']);
        alert('Wylogowano z powodu braku aktywności');
      }
    }, this.timeoutDuration);
  }

  clearTimer() {
    if (this.inactivityTime) {
      clearTimeout(this.inactivityTime);
    }
  }

  @HostListener('window:mousemove') resetTimerOnActivity() {
    this.resetTimer();
  }

  @HostListener('window:keydown') resetTimerOnKeydown() {
    this.resetTimer();
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
  navigateToProfile(){
    this.router.navigate(['/user']);
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
