import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BookService, Livro } from '../services/book.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  searchField: 'titulo' | 'autor' | 'editora' | 'isbn' = 'titulo';
  searchTerm: string = '';
  books: Livro[] = [];

  private bookService = inject(BookService);

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
      },
      error: (err) => {
        console.error('Erro ao carregar livros', err);
      }
    });
  }

  deleteBook(id: number): void {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.books = this.books.filter(book => book.id !== id);
          console.log(`Livro com id ${id} excluído com sucesso.`);
        },
        error: (err) => {
          console.error(`Erro ao excluir livro com id ${id}`, err);
        }
      });
    }
  }

  filteredBooks(): Livro[] {
    if (!this.searchTerm.trim()) {
      return this.books;
    }
    const term = this.searchTerm.toLowerCase().trim();
    const field = this.searchField;
    return this.books.filter(book => {
      const value = (book[field] as string)?.toLowerCase() || '';
      return value.includes(term);
    });
  }
}
