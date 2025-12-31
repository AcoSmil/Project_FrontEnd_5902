import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { PlaybackLog } from '../../core/models/playback-log.model';
import { User } from '../../core/models/user.model';
import { Exhibit } from '../../core/models/exhibit.model';

@Component({
  selector: 'app-logs-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logs-page.component.html',
  styleUrls: ['./logs-page.component.css'],
})
export class LogsPageComponent implements OnInit {
  logs: PlaybackLog[] = [];
  users: User[] = [];
  exhibits: Exhibit[] = [];

  q = '';
  error = '';

  form = {
    playbackId: '',
    userId: '',
    exhibitId: '',
    language: 'EN',
    timestamp: '',
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadAll();
    this.newLog();
  }

  newLog() {
    this.form = {
      playbackId: crypto.randomUUID(),
      userId: '',
      exhibitId: '',
      language: 'EN',
      timestamp: new Date().toISOString(),
    };
  }

  loadAll() {
    this.error = '';
    this.api.get<User[]>('/users').subscribe({ next: v => this.users = v, error: e => this.fail(e) });
    this.api.get<Exhibit[]>('/exhibits').subscribe({ next: v => this.exhibits = v, error: e => this.fail(e) });
    this.loadLogs();
  }

  loadLogs() {
    this.api.get<PlaybackLog[]>('/logs').subscribe({ next: v => this.logs = v, error: e => this.fail(e) });
  }

  get filtered(): PlaybackLog[] {
    const q = this.q.trim().toLowerCase();
    if (!q) return this.logs;
    return this.logs.filter(l =>
      (l.playbackId || '').toLowerCase().includes(q) ||
      (l.language || '').toLowerCase().includes(q) ||
      (this.userName(l.userId) || '').toLowerCase().includes(q) ||
      (this.exhibitName(l.exhibitId) || '').toLowerCase().includes(q)
    );
  }

  userName(id: string | null) {
    if (!id) return '';
    return this.users.find(u => u.userId === id)?.name ?? '';
  }

  exhibitName(id: string | null) {
    if (!id) return '';
    return this.exhibits.find(e => e.exhibitId === id)?.name ?? '';
  }

  create() {
    this.error = '';
    if (!this.form.userId || !this.form.exhibitId) {
      this.error = 'Pick both a user and an exhibit';
      return;
    }

    const payload = {
      playbackId: this.form.playbackId,
      language: this.form.language,
      timestamp: this.form.timestamp,
      userId: this.form.userId,
      exhibitId: this.form.exhibitId,
    };

    this.api.post<PlaybackLog>('/logs', payload).subscribe({
      next: () => { this.loadLogs(); this.newLog(); },
      error: e => this.fail(e),
    });
  }

  remove(id: string) {
    if (!confirm('Delete this log?')) return;
    this.api.delete<void>(`/logs/${id}`).subscribe({
      next: () => this.loadLogs(),
      error: e => this.fail(e),
    });
  }

  private fail(e: any) {
    this.error = `API error (${e?.status ?? 'unknown'})`;
  }
}
