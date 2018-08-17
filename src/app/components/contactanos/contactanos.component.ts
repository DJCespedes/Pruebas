import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contactanos',
  templateUrl: './contactanos.component.html',
  styles: []
})
export class ContactanosComponent implements OnInit {

  correo = { email: '', subject: '', mensaje: ''};

  constructor(private usuariosService: UsuariosService ) { }

  ngOnInit() {
  }

  public enviarCorreo() {
    return this.usuariosService.enviarCorreo(this.correo)
    .subscribe((res) => {
        console.log(res.status);
        Swal({
          type: 'success',
          title: 'Se envió el correo',
          showConfirmButton: false,
          timer: 1500
        }).catch(err1 => { console.log('Swal:' + err1); });
      },
      err => {
        Swal({
          type: 'error',
          title: 'Ocurrio un error, por favor intente despues',
          showConfirmButton: false,
          timer: 1500
        }).catch(err2 => { console.log('Swal:' + err); });
      }
    );
  }
}
