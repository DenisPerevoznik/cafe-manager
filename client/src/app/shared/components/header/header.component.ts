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

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  onLogoutClick(){
    this.auth.logout();
  }

  openSidebar(){
    this.sidebarToggleChange.emit(true);
  }
}
