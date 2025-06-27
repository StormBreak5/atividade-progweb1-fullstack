import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BookService, Livro } from '../services/book.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatButtonModule,
    DatePipe,
    MatTooltipModule
  ],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  searchField: keyof Livro = 'titulo';
  searchTerm: string = '';
  books: Livro[] = [];

  sortField: keyof Livro = 'titulo';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortOptions: { value: keyof Livro, viewValue: string }[] = [
    { value: 'titulo', viewValue: 'Título' },
    { value: 'autor', viewValue: 'Autor' },
    { value: 'editora', viewValue: 'Editora' },
    { value: 'isbn', viewValue: 'ISBN' },
    { value: 'categoria', viewValue: 'Categoria' },
    { value: 'dataPublicacao', viewValue: 'Data de Lançamento' }
  ];
  searchOptions = this.sortOptions;

  private bookService = inject(BookService);
  private datePipe = inject(DatePipe);

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
          this.loadBooks();
          console.log(`Livro com id ${id} excluído com sucesso.`);
        },
        error: (err) => {
          console.error(`Erro ao excluir livro com id ${id}`, err);
        }
      });
    }
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  getDisplayedBooks(): Livro[] {
    let filtered = this.books;
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();

      filtered = this.books.filter(book => {
        if (this.searchField === 'dataPublicacao') {
          const formattedDate = this.datePipe.transform(book.dataPublicacao, 'dd/MM/yyyy') || '';
          return formattedDate.includes(term);
        }

        const value = book[this.searchField] ? String(book[this.searchField]).toLowerCase() : '';
        return value.includes(term);
      });
    }

    return [...filtered].sort((a, b) => {
      const valA = a[this.sortField];
      const valB = b[this.sortField];
      let comparison = 0;

      if (valA == null || valB == null) {
        comparison = valA == null ? -1 : 1;
      } else if (this.sortField === 'dataPublicacao') {
        comparison = new Date(valA).getTime() - new Date(valB).getTime();
      } else {
        comparison = String(valA).localeCompare(String(valB));
      }

      if (comparison === 0) {
        return a.titulo.localeCompare(b.titulo);
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }
}
