import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css'],
})
export class UsersPageComponent implements OnInit {
  users: User[] = [];
  q = '';
  error = '';

  form: User = { userId: '', name: '', email: '' };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
    this.newUser();
  }

  get filtered(): User[] {
    const q = this.q.trim().toLowerCase();
    if (!q) return this.users;
    return this.users.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.userId || '').toLowerCase().includes(q)
    );
  }

  load() {
    this.error = '';
    this.api.get<User[]>('/users').subscribe({
      next: v => this.users = v,
      error: e => this.error = `LOAD FAILED (${e?.status ?? 'unknown'})`,
    });
  }

  newUser() {
    this.form = { userId: crypto.randomUUID(), name: '', email: '' };
  }

  create() {
    this.error = '';
    if (!this.form.userId || !this.form.name) {
      this.error = 'userId and name are required';
      return;
    }
    this.api.post<User>('/users', this.form).subscribe({
      next: () => { this.load(); this.newUser(); },
      error: e => this.error = `CREATE FAILED (${e?.status ?? 'unknown'})`,
    });
  }

  remove(id: string) {
    if (!confirm('Delete this user?')) return;
    this.api.delete<void>(`/users/${id}`).subscribe({
      next: () => this.load(),
      error: e => this.error = `DELETE FAILED (${e?.status ?? 'unknown'})`,
    });
  }
}
