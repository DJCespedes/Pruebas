import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../services/usuarios.service';
import { InteresesService } from '../../services/intereses.service';

@Component({
  selector: 'app-usuario-perfil',
  templateUrl: './perfil.component.html'
})

export class PerfilComponent implements OnInit {
  usuario = { dni: '', matricula: '', pathFoto: '', fotoAdjunta: '', intereses: [] };
  pathFoto = '';
  tableWidget: any;
  shipmentsTable: any;

  /*@HostListener('focusout', ['$event']) public onListenerTriggered(event: any): void { }*/

  ngOnInit(): void {
    this.contruirDataTable();
  }

  contruirDataTable() {
    let dtIntereses: any = {
      columns: [
        {
          defaultContent: '',
          className: "select-checkbox"
        }, {
          title: "#",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          title: 'Nombre',
          data: 'nombre',
          width: "35%"
        }, {
          title: 'Descripción',
          data: 'descripcion',
          width: "50%"
        }],
      select: {
        style: "multi",
        selector: "td:first-child"
      },
      paging: false, bFilter: false, bSearchable: false, bInfo: false, bSort: false,
      dom: 'Bfrtip',
      buttons: []
    };

    this.shipmentsTable = $(this.el.nativeElement.querySelector('table'));
    this.tableWidget = this.shipmentsTable.DataTable(dtIntereses);
  }

  constructor(private usuariosService: UsuariosService, private interesesService: InteresesService, private el: ElementRef) {
    this.buscar();
  }

  leerPath(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.pathFoto = (<FileReader>event.target).result;
        var binaryString = (<FileReader>event.target).result;
        this.usuario.fotoAdjunta = btoa(binaryString);
      }
      reader.readAsDataURL(event.target.files[0]);
    }

  }

  buscar() {
    this.usuariosService.buscar(1).subscribe((res) => {
      this.usuario = res.json();
      console.log(this.usuario);
      this.tableWidget.rows.add(this.usuario.intereses).draw();
      this.tableWidget.rows().every(function (rowIdx, tableLoop, rowLoop) {
        if (this.data().interesDelUsuario) {
          this.select();
        }
      });

      this.pathFoto = 'data:image/png;base64,' + this.usuario.fotoAdjunta;
    }), err => {
    }
  }

  actualizar() {
    Swal({
      title: '¿Estás seguro de editar su Perfil?',
      text: "¡No podras revertir la acción!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, confirmar!',
      cancelButtonText: '<i class="fa fa-ban">&nbsp;</i>Cancelar'
    }).then((result) => {
      if (result) {
        var seleccionados = this.tableWidget.rows({ selected: true }).data();
        var intereses = [];
        for (var cont = 0; cont < seleccionados.length; cont++) {
          intereses.push(seleccionados[cont]);
        }
        console.log(intereses);
        this.usuario.intereses = intereses;
        this.usuariosService.editar(this.usuario).subscribe((res) => {
          Swal({
            position: 'right-end',
            type: 'success',
            title: 'Se Edito con exito',
            showConfirmButton: false,
            timer: 1500
          }).catch(error => { });
        }), err => {
          Swal({
            position: 'right-end',
            type: 'error',
            title: 'No se Edito con exito',
            showConfirmButton: false,
            timer: 1500
          }).catch(error => { });
        };
      }
    }).catch(error => { });
  }
}
