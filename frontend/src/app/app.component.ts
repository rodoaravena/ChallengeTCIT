import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  NgForm,
  FormGroup,
} from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
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
    MatTableModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'challenge';

  @ViewChild('addPostDialog') addPostDialog: TemplateRef<any>;

  filtro: FormControl;
  formAddPost = new FormGroup({
    pub: new FormControl(null),
    desc: new FormControl(null),
  });

  sourcePosts: MatTableDataSource<any[]>;
  encabezados: string[] = ['name', 'description', 'options'];

  constructor(public dialog: MatDialog) {
    this.filtro = new FormControl('');
    this.sourcePosts = new MatTableDataSource();
    this.addPostDialog = {} as TemplateRef<any>;
    this.getPosts();
  }

  searchPost(): void {
    let filterValue = this.filtro.value.trim().toLowerCase();
    this.sourcePosts.filter = filterValue;
  }

  async getPosts() {
    Swal.fire({
      title: 'Obteniendo datos...',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    await fetch('http://localhost:5047/posts').then(async result=>{
      if (result.status==200){
        this.sourcePosts.data = (await result.json()) as any[];
      }
      Swal.close();

    }).catch(()=>{
        Swal.fire('Error', 'Ha ocurrido un error al recuperar los post.<br>Inténtelo de nuevo más tarde', 'error');
    });


  }

  showAddPostForm() {
    this.dialog.open(this.addPostDialog);
  }

  async saveFormAddPost() {
    let data = {} as any;
    this.dialog.closeAll();
    if (this.formAddPost.valid) {
      data = this.formAddPost.controls;
      Swal.fire({
        title: `Guardando "${data.pub.value}"...`,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const saved = await this.addPost(data);
      Swal.close();
      if (saved) {
        Swal.fire(
          '¡Guardado!',
          `Se ha guardado "${data.pub.value}" correctamente`,
          'success'
        );
      } else {
        Swal.fire('¡Ups!', `No se pudo guardar "${data.pub.value}"`, 'error');
      }
    } else {
      Swal.fire(
        '¡Error!',
        'El formulario tiene errores, verifique e intentelo de nuevo',
        'error'
      );
    }
    this.getPosts();
  }

  async addPost(formData: any): Promise<boolean> {
    let saved = false;

    await fetch('http://localhost:5047/posts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.pub.value,
        description: formData.desc.value,
      }),
    }).then(result =>{
      if (result.status == 201) {
        saved = true;
      }
    }).catch(()=>{
      saved = false;
    });


    return saved;
  }

  warningDeletePost(datos: any) {
    let responseStatus = 0;
    Swal.fire({
      title: '¡Precaución!',
      text: `Está seguro que desea eliminar "${datos.name}"`,
      icon: 'warning',
      confirmButtonText: 'Sí, eliminar',
      confirmButtonColor: 'crimson',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      loaderHtml: '<mat-spinner></mat-spinner>',
      preConfirm: async () => {
        Swal.showLoading();
        responseStatus = await this.deletePost(datos.id);
      },
    }).then((result) => {
      if (responseStatus == 200) {
        Swal.fire(
          'Eliminado',
          `Se ha eliminado "${datos.name}" correctamente`,
          'success'
        );
      } else {
        Swal.fire(
          '¡Ups!',
          `Ha ocurrido un error al intentar eliminar "${datos.name}"`,
          'error'
        );
      }
      this.getPosts();
    });
  }

  async deletePost(postId: number): Promise<number> {
    let status = 0;

    await fetch(`http://localhost:5047/post/${postId}`, {
      method: 'DELETE',
    }).then(result =>{
      status = result.status
    }).catch(()=>{
      status=0;
    });
    return status;
  }
}
