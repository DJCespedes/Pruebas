import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { InteresesService } from "../../services/intereses.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administracion-intereses',
  templateUrl: './intereses.component.html'
})

export class InteresesComponent implements OnInit {
  titulo = null;
  interes = null;

  shipmentsTable: any;
  tableWidget: any;
  modalRef: BsModalRef;

  @ViewChild('tplInteres') private tplInteres;

  @HostListener('focusout', ['$event']) public onListenerTriggered(event: any): void { }

  constructor(private interesesService: InteresesService, private modalService: BsModalService, private el: ElementRef) {
  }

  ngOnInit(): void {
    this.contruirDataTable();
  }

  contruirDataTable() {
    if (this.tableWidget) {
      this.tableWidget.ajax.reload();
    }
    else {
      let dtIntereses: any = {
        ajax: (dataTablesParameters: any, callback) => {
          this.interesesService.listar().subscribe((data) => {
            callback({
              recordsTotal: data.json().length,
              recordsFiltered: data.json().length,
              data: data.json()
            });
          }), err => {
            Swal({
              position: 'right-end',
              type: 'error',
              title: err,
              showConfirmButton: false,
              timer: 1500
            }).catch(error => { });
          };
        },
        columns: [{
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
        }, {
          render: function (data, type, interes, meta) {
            var cadena = encodeURI(JSON.stringify(interes));
            var btn = '<button type="button" class="btn btn-primary" '
            btn += 'onclick=';
            btn += '"functions.editar(';
            btn += "'" + cadena + "'";
            btn += ')">';
            btn += '<i class="fa fa-edit">&nbsp;</i>Editar'
            btn += '</button>';
            return btn;
          },
          width: "5%"
        }, {
          render: function (data, type, interes, meta) {
            var btn = '<button type="button" class="btn btn-danger"'
            btn += 'onclick="functions.eliminar(' + interes.interesId + ')">'
            btn += '<i class="fa fa-trash-o">&nbsp;</i>Eliminar'
            btn += '</button>';
            return btn;
          },
          width: "5%"
        }],
        select: false,
        bSort: false,
        pageLength: 5,
        language: { url: "./../assets/Spanish.js" },
        dom: 'Bfrtip',
        buttons: []
      };

      window.functions = window.functions || {};
      window.functions.editar = this.ver.bind(this);
      window.functions.eliminar = this.eliminar.bind(this);

      this.shipmentsTable = $(this.el.nativeElement.querySelector('table'));
      this.tableWidget = this.shipmentsTable.DataTable(dtIntereses);
    }
  }

  nuevo() {
    this.titulo = 'Nuevo interes';
    this.interes = { interesId: 0, nombre: '', descripcion: '', estado: 1 }
    this.modalRef = this.modalService.show(this.tplInteres);
  }

  guardar() {
    Swal({
      title: (this.interes.interesId === 0 ? '¿Estás seguro de crear el interes?' : '¿Estás seguro de editar el interes?'),
      text: "¡No podras revertir la acción!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, confirmar!',
      cancelButtonText: '<i class="fa fa-ban">&nbsp;</i>Cancelar'
    }).then((result) => {
      if (result) {
        if (this.interes.interesId === 0) {
          this.interesesService.insertar(this.interes).subscribe((res) => {
            this.contruirDataTable();
            Swal({
              position: 'right-end',
              type: 'success',
              title: 'Se Creo con exito',
              showConfirmButton: false,
              timer: 1500
            }).catch(error => { });
          }), err => {
          };
        }
        else {
          this.interesesService.editar(this.interes).subscribe((res) => {
            this.contruirDataTable();
            Swal({
              position: 'right-end',
              type: 'success',
              title: 'Se Edito con exito',
              showConfirmButton: false,
              timer: 1500
            }).catch(error => { });

          }), err => {

          };
        }
        this.modalRef.hide();
      }
    }).catch(error => { });
  }

  ver(cadena) {
    var cadenaDeco = decodeURI(cadena);
    var cadenaJson = JSON.parse(cadenaDeco);
    this.titulo = 'Editar interes';
    this.interes = cadenaJson;
    this.modalRef = this.modalService.show(this.tplInteres);
  }

  eliminar(interesId) {
    Swal({
      title: '¿Estás seguro de eliminar el interes?',
      text: "¡No podrás revertir la acción!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, confirmar!',
      cancelButtonText: '<i class="fa fa-ban">&nbsp;</i>Cancelar'
    }).then((result) => {
      if (result) {
        this.interesesService.eliminar(interesId).subscribe(
          (res) => {
            this.contruirDataTable();
            Swal({
              position: 'right-end',
              type: 'success',
              title: 'Se Elimino con exito',
              showConfirmButton: false,
              timer: 1500
            }).catch(error => { });
          })
          , 
          err => { 
            Swal({
              position: 'right-end',
              type: 'success',
              title: 'Se Elimino con exito',
              showConfirmButton: false,
              timer: 1500
            }).catch(error => { });
                 };
      }
    }).catch(error => { });
  }

}