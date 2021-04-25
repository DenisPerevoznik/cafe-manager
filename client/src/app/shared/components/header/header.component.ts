import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() showSidebarToggle = true;
  @Input() showHomeButton = true;
  @Output() sidebarToggleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  sidebarStatus = true;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  onLogoutClick(){
    this.auth.logout();
  }

  sidebarToggle(){
    this.sidebarStatus = !this.sidebarStatus;
    this.sidebarToggleChange.emit(this.sidebarStatus);
  }
}
