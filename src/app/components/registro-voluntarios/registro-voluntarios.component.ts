import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import Swal from 'sweetalert2';
//import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-registro-voluntarios',
  templateUrl: './registro-voluntarios.component.html',
  styles: []
})
export class RegistroVoluntariosComponent implements OnInit {
  correoContacto = "contactanos@bcp.com.pe"
  
  constructor(private usuariosService: UsuariosService) {
  }

  ngOnInit() {
  }

  generarPassword(dni:string) {
    console.log("value:"+dni);
    return this.usuariosService.generarPassword(dni)
    .subscribe((res) => {
        console.log(res.status);
        Swal({
          type: 'success',
          title: 'Se envió el correo',
          showConfirmButton: false,
          timer: 1500
        }).catch(err => { console.log("Swal:"+err)});
      },
      err=> {
        Swal({
          type: 'error',
          title: 'Ocurrio un error, por favor intente despues',
          showConfirmButton: false,
          timer: 1500
        }).catch(err => { console.log("Swal:"+err)});
      }
    );
  }
}
