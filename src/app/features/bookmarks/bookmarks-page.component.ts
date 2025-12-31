import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
 selector: 'app-bookmarks-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookmarks-page.component.html',
  styleUrls: ['./bookmarks-page.component.css']
})
export class BookmarksPageComponent implements OnInit {
  private api = 'http://localhost:8080';
  private headers = { 'X-API-Key': 'my-secret-key' };

  // UI state
  q = '';
  error = '';

  // Data
  bookmarks: any[] = [];
  users: any[] = [];
  exhibits: any[] = [];

  // Form model used in your HTML
  form = {
    bookmarkId: '',
    userId: '',
    exhibitId: '',
    timestamp: '00:00:00'
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAll();
  }

  // derived list for the table
  get filtered(): any[] {
    const qq = (this.q || '').toLowerCase().trim();
    if (!qq) return this.bookmarks;

    return this.bookmarks.filter(b =>
      String(b.bookmarkId || '').toLowerCase().includes(qq) ||
      String(b.userId || '').toLowerCase().includes(qq) ||
      String(b.exhibitId || '').toLowerCase().includes(qq) ||
      String(this.userName(b.userId) || '').toLowerCase().includes(qq) ||
      String(this.exhibitName(b.exhibitId) || '').toLowerCase().includes(qq)
    );
  }

  loadAll(): void {
    this.error = '';

    // load users + exhibits first (so name mapping works)
    this.http.get<any[]>(`${this.api}/users`, { headers: this.headers }).subscribe({
      next: (u) => { this.users = u || []; },
      error: (e) => { this.error = `LOAD USERS FAILED (${e.status || 'no status'})`; }
    });

    this.http.get<any[]>(`${this.api}/exhibits`, { headers: this.headers }).subscribe({
      next: (ex) => { this.exhibits = ex || []; },
      error: (e) => { this.error = `LOAD EXHIBITS FAILED (${e.status || 'no status'})`; }
    });

    this.http.get<any[]>(`${this.api}/bookmarks`, { headers: this.headers }).subscribe({
      next: (b) => { this.bookmarks = b || []; },
      error: (e) => { this.error = `LOAD BOOKMARKS FAILED (${e.status || 'no status'})`; }
    });
  }

  newBookmark(): void {
    this.error = '';
    const now = new Date();
    this.form = {
      bookmarkId: '',
      userId: '',
      exhibitId: '',
      timestamp: this.formatTime(now)
    };
  }

  create(): void {
    this.error = '';

    if (!this.form.bookmarkId || !this.form.userId || !this.form.exhibitId) {
      this.error = 'Please fill bookmarkId, user, and exhibit.';
      return;
    }

    const payload = {
      bookmarkId: this.form.bookmarkId,
      timestamp: this.form.timestamp,
      userId: this.form.userId,
      exhibitId: this.form.exhibitId
    };

    this.http.post(`${this.api}/bookmarks`, payload, { headers: this.headers }).subscribe({
      next: () => {
        this.newBookmark();
        this.loadAll();
      },
      error: (e) => {
        this.error = `CREATE FAILED (${e.status || 'no status'})`;
      }
    });
  }

  remove(bookmarkId: string): void {
    this.error = '';
    if (!bookmarkId) return;

    this.http.delete(`${this.api}/bookmarks/${encodeURIComponent(bookmarkId)}`, { headers: this.headers }).subscribe({
      next: () => this.loadAll(),
      error: (e) => (this.error = `DELETE FAILED (${e.status || 'no status'})`)
    });
  }

  userName(userId: string): string {
    const u = this.users.find(x => x.userId === userId);
    return u ? (u.name || '') : '';
  }

  exhibitName(exhibitId: string): string {
    const e = this.exhibits.find(x => x.exhibitId === exhibitId);
    return e ? (e.name || '') : '';
  }

  private formatTime(d: Date): string {
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
}
