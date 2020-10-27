import { Component, OnInit, Input } from '@angular/core';
// , ViewChild
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isUserLoggedIn: Boolean = false;

  constructor(
    private loginService: LoginService,
    public userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService
  ) {
    this.isUserLoggedIn = loginService.isLoggedIn();
  }

  openloginModal() {
    this.modalService.open(LoginModalComponent);
  }

  // ----- FORM
  headerDropdown: false;
  toggleMenuItems = false;

  // ------------- LOGIN
  // Main header alert message
  HeaderMessage = {
    type: '',
    message: ''
  }
  navItems = [
    { path: '/users/dashboard', name: 'Dashboard' },
    { path: '/property/new', name: 'Add New Property' },
    { path: '/property/search', name: 'Find Property' },
    { path: '/property/listing', name: 'My Listing' },
    { path: '/users/profile/edit', name: 'My Profile' }
  ];

  closeHeaderMessage() {
    this.HeaderMessage.message = '';
  }

  changeHeaderMessage(type, message) {
    this.HeaderMessage = { type: type, message: message }
    var self = this;
    setTimeout(function () {
      self.closeHeaderMessage();
    }, 5000);
  }

  handleLogout() {
    this.loginService.logOut()
  }

  pageloaderStatus: boolean = true;

  ngOnInit() {
    document.addEventListener('scroll', (event) => {
      if (window.pageYOffset > 30) {
        document.getElementById('logoImg').classList.add('smallLogo');
        // document.getElementById('navbar').style.top = '35px'
      }
      else if (window.pageYOffset < 30) {
        document.getElementById('logoImg').classList.remove('smallLogo');
        // document.getElementById('navbar').style.top = '0px'
      }
    });

    this.route.queryParamMap.subscribe((data) => {
      if (data.get('action') === 'signUpsuccess') {
        this.changeHeaderMessage('success', 'Congratulations, you have been successfully registered, login to continue');
        this.openloginModal();
      }
      else if (data.get('action') === 'logOut') {
        this.changeHeaderMessage('success', 'You have logged out successfully');
        this.openloginModal();
      }
      else if (data.get('action') === 'login') {
        this.changeHeaderMessage('success', 'Please login to continue');
        this.openloginModal();
      }
    });

    // HEADER MESSAGE
    this.commonService.HeaderMessage$.subscribe((data: any) => {
      if (data)
        this.changeHeaderMessage(data.type, data.message);
    });

    // Toggling Page Loader status
    this.commonService.togglePageLoader$.subscribe(data => this.pageloaderStatus = data);
  }
}