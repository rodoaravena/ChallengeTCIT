import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

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

  filtro: FormControl;
  publicaciones: any[];
  encabezados:string[] = [
    'name',
    'description',
    'options'
  ];



  constructor(){
    this.filtro = new FormControl('');
    this.publicaciones = [];

  }

  buscar():void {
    console.log(this.filtro.value)
  }

  agregarPublicacion():void{

  }

  eliminarPublicacion(datos:any):void{

  }

}
