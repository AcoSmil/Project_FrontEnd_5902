import { HttpClient } from '@angular/common/http';

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {

  stats = {
    exhibits: 0,
    users: 0,
    bookmarks: 0,
    logs: 0
  };

  recentLogs: any[] = [];

  topLanguage: string = '';
  mostBookmarked: string = '';
  search: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('🚀 Dashboard loaded');

    this.http.get('http://localhost:8080/users', {
      headers: { 'X-API-Key': 'my-secret-key' }
    }).subscribe({
      next: (res) => console.log('✅ BACKEND RESPONSE:', res),
      error: (err) => console.error('❌ BACKEND ERROR:', err)
    });

    // Temporary demo data (replace with API calls later)
    this.stats.exhibits = 5;
    this.stats.users = 12;
    this.stats.bookmarks = 9;
    this.stats.logs = 21;

    this.recentLogs = [
      {
        exhibitTitle: 'Ancient Art',
        userName: 'Eva',
        language: 'EN',
        timestamp: '00:01:42'
      },
      {
        exhibitTitle: 'Modern History',
        userName: 'Alex',
        language: 'MK',
        timestamp: '00:03:10'
      }
    ];

    this.topLanguage = 'EN';
    this.mostBookmarked = 'Ancient Art';
  }
}
