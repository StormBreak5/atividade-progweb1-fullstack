import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

import { BookService, Livro } from '../services/book.service';

@Component({
  selector: 'app-create-book',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.scss'],
})
export class CreateBookComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  private currentBookId: number | null = null;

  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      editora: ['', Validators.required],
      isbn: ['', Validators.required],
      categoria: ['', Validators.required],
      dataPublicacao: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.currentBookId = +id;
        this.bookService.getBookById(this.currentBookId).subscribe(book => {
          this.form.patchValue(book);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const bookData: Livro = this.form.value;

    if (this.isEditMode && this.currentBookId) {
      // MODO EDIÇÃO: Chama o serviço de update
      this.bookService.updateBook(this.currentBookId, bookData).subscribe(() => {
        console.log('Livro atualizado com sucesso!');
        this.router.navigate(['/']);
      });
    } else {
      this.bookService.createBook(bookData).subscribe(() => {
        console.log('Livro criado com sucesso!');
        this.router.navigate(['/']);
      });
    }
  }
}
