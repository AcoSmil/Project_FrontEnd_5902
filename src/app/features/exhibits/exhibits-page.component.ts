import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Exhibit } from '../../core/models/exhibit.model';

@Component({
  selector: 'app-exhibits-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exhibits-page.component.html',
  styleUrls: ['./exhibits-page.component.css'],
})
export class ExhibitsPageComponent implements OnInit {
  exhibits: Exhibit[] = [];
  q = '';
  error = '';

  form: Exhibit = {
    exhibitId: '',
    name: '',
    description: '',
    audioUrlEnglish: '',
    audioUrlMacedonian: '',
    createdAt: '',
  };

  editMode = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  get filtered(): Exhibit[] {
    const q = this.q.trim().toLowerCase();
    if (!q) return this.exhibits;
    return this.exhibits.filter(e =>
      (e.name || '').toLowerCase().includes(q) ||
      (e.description || '').toLowerCase().includes(q) ||
      (e.exhibitId || '').toLowerCase().includes(q)
    );
  }

  load() {
    this.error = '';
    this.api.get<Exhibit[]>('/exhibits').subscribe({
      next: (v) => (this.exhibits = v),
      error: (e) => (this.error = `LOAD FAILED (${e?.status ?? 'unknown'})`),
    });
  }

  startCreate() {
    this.editMode = false;
    this.form = {
      exhibitId: crypto.randomUUID(),
      name: '',
      description: '',
      audioUrlEnglish: '',
      audioUrlMacedonian: '',
      createdAt: new Date().toISOString(),
    };
  }

  startEdit(ex: Exhibit) {
    this.editMode = true;
    this.form = { ...ex };
  }

  save() {
    this.error = '';
    if (!this.form.exhibitId || !this.form.name) {
      this.error = 'exhibitId and name are required';
      return;
    }
    const body = { ...this.form, createdAt: this.form.createdAt || new Date().toISOString() };

    const req = this.editMode
      ? this.api.put<Exhibit>(`/exhibits/${this.form.exhibitId}`, body)
      : this.api.post<Exhibit>('/exhibits', body);

    req.subscribe({
      next: () => {
        this.load();
        this.startCreate();
      },
      error: (e) => (this.error = `SAVE FAILED (${e?.status ?? 'unknown'})`),
    });
  }

  remove(exhibitId: string) {
    if (!confirm('Delete this exhibit?')) return;
    this.api.delete<void>(`/exhibits/${exhibitId}`).subscribe({
      next: () => this.load(),
      error: (e) => (this.error = `DELETE FAILED (${e?.status ?? 'unknown'})`),
    });
  }
}
