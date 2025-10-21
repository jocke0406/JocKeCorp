import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-register-closed',
    imports: [CommonModule, RouterLink],
    templateUrl: './register-closed.component.html',
    styleUrls: ['./register-closed.component.scss'],
})
export class RegisterClosedComponent { }
