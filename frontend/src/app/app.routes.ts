import { Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { CreateBookComponent } from './create-book/create-book.component';

export const routes: Routes = [
  {path: '', component: BookListComponent , title: 'Livros'},
  {path: 'create', component: CreateBookComponent , title: 'Cadastrar Livro'},
  {path: 'create/:id', component: CreateBookComponent , title: 'Editar Livro'}
];
