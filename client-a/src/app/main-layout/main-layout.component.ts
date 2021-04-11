import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from '@app/shared/interfaces';
import { CompanyService } from '@app/shared/services/company.service';
import { getSelectedCompany } from '@app/store/selectors/common.selector';
import { AppState } from '@app/store/state/app.state';
import { select, Store } from '@ngrx/store';
import { Sidebar } from 'ng-sidebar';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  
  @ViewChild('sidebar') sidebar: Sidebar;
  
  public sideBarToggle = false;
  public sideBarStatus = true;
  public isMobile = false;
  private selectedCompany$ = this.store.pipe(select(getSelectedCompany));
  public selectedCompany: Company;

  constructor(private router: Router, private store: Store<AppState>, private companyService: CompanyService) {}

  ngOnInit(): void {
    this.checkIsMobile();
    this.selectedCompany$.subscribe(company => {
      if(!company){
        this.router.navigate(['companies']);
        return;
      }

      this.selectedCompany = company;
      this.companyService.selectedCompany = company;
    });
  }

  onScrollSidebar(event) {
    event.preventDefault();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkIsMobile();
  }

  private checkIsMobile(){
    if(window.innerWidth >= 320 && window.innerWidth <= 1360){
      this.isMobile = true;
      this.sideBarStatus = false;
    }
    else{
      this.isMobile = false;
      this.sideBarStatus = true;
    }
  }
}
