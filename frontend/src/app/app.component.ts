import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'challenge';

  @ViewChild('addPostDialog') addPostDialog: TemplateRef<any>;

  filtro: FormControl;
  publicaciones: any[];
  encabezados:string[] = [
    'name',
    'description',
    'options'
  ];

  constructor(public dialog: MatDialog){
    this.filtro = new FormControl('');
    this.publicaciones = [];
    this.addPostDialog = {} as TemplateRef<any>;

    this.getPosts();

  }

  buscar():void {
    console.log(this.filtro.value);
  }

  async getPosts(){
    const result = await fetch('http://localhost:5047/posts');

    this.publicaciones = (await result.json()) as any[];

  }

  showAddPostForm(){
    const dialogForm = this.dialog.open(this.addPostDialog);
  }

  addPost(){

  }

  warningDeletePost(datos:any){

    Swal.fire({
      title: '¡Precaución!',
      text:`Está seguro que desea eliminar "${datos.name}"`,
      icon: 'warning',
      confirmButtonText:'Sí, eliminar',
      confirmButtonColor: 'crimson',
      showCancelButton:true,
      cancelButtonText:'Cancelar',
      loaderHtml: '<mat-spinner></mat-spinner>',
      preConfirm: () => {
        Swal.showLoading()
      },
    }).then(async (result) => {

      const responseStatus = await this.deletePost(datos.id);

      if(responseStatus == 200){
        Swal.fire('Eliminado', `Se ha eliminado "${datos.name}" correctamente`, 'success');
      }
      else{
        Swal.fire('¡Ups!', `Ha ocurrido un erroral intentar eliminar "${datos.name}"`, 'error');
      }
      this.getPosts();
    });

  }

  async deletePost(postId:number): Promise<number>{
    const result = await fetch('http://localhost:5047/posts',
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: postId,
        })
      }
    );
    return result.status;

  }

}
