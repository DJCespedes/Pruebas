import { Component, OnInit, ViewChild, ElementRef, HostListener,NgZone } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProgramasService } from "../../services/programas.service";
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administracion-programas',
  templateUrl: './programas.component.html'
})

export class ProgramasComponent implements OnInit {
  titulo = null;
  programa = null;
  anhios = [2015, 2016, 2017, 2018];
  tiposPrograma = [{ value: true, nombre: 'Con Grado' }, { value: false, nombre: 'Sin Grado' }];

  shipmentsTable: any;
  tableWidget: any;
  shipmentsTableGrados: any;
  tableWidgetGrados: any;
  modalRef: BsModalRef;

  @ViewChild('tplPrograma') private tplPrograma;
  @ViewChild('divDtProgramas') divDtProgramas: ElementRef;
  @ViewChild('dtGrados')
  private dtGrados: ElementRef;

  @ViewChild('tplPrograma') tplPrograma2: ElementRef;

  @HostListener('focusout', ['$event']) public onListenerTriggered(event: any): void { }

  constructor(private programasService: ProgramasService
      ,private modalService: BsModalService
      ,private router:Router
      ,private route:ActivatedRoute
      ,private el: ElementRef
      ,private _ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.contruirDataTable();
  }

  contruirDataTable() {
    if (this.tableWidget) {
      this.tableWidget.ajax.reload();
    }
    else {
      let optProgramas: any = {
        ajax: (dataTablesParameters: any, callback) => {
          this.programasService.listar().subscribe((data) => {
            console.log(data.json());
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
          title: 'Grados',
          width: "10%",
          render: function (data, type, programa, meta) {
            var rsp = (programa.conGrados ? 'Si' : 'No')
            return rsp;
          }
        }, {
          render: function (data, type, programa, meta) {
            
            var btn = '<button type="button" class="btn btn-primary  btn-sm" '
            btn += 'onclick="functions.editar(' + programa.programaId + ')">'
            btn += '<i class="fa fa-edit">&nbsp;</i>Editar'
            btn += '</button>';
            return btn;
          },
          width: "5%"
        }, {
          render: function (data, type, programa, meta) {
            var btn = '<button type="button" class="btn btn-danger  btn-sm"'
            btn += 'onclick="functions.eliminar(' + programa.programaId + ')">'
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
      window.functions.editar = this.editarPrograma.bind(this);
      window.functions.eliminar = this.eliminarPrograma.bind(this);

      this.shipmentsTable = $(this.divDtProgramas.nativeElement.querySelector('table'));// $(this.dtProgramas.nativeElement.querySelector('table'));
      this.tableWidget = this.shipmentsTable.DataTable(optProgramas);
    }
  }

  agregarPrograma(){
      this.router.navigate(['/programa','nuevo']);
  }

  guardar() {
    Swal({
      title: (this.programa.id === 0 ? '¿Estás seguro de crear el Programa?' : '¿Estás seguro de editar el Programa?'),
      text: "¡No podras revertir la acción!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle">&nbsp;</i>¡Si, confirmar!',
      cancelButtonText: '<i class="fa fa-ban">&nbsp;</i>Cancelar'
    }).then((result) => {
      if (result) {
        console.log(this.programa);
        if (this.programa.id === 0) {
          this.programasService.insertar(this.programa).subscribe((res) => {
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
          this.programasService.editar(this.programa).subscribe((res) => {
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

  // ver(cadena) {
  //   var cadenaDeco = decodeURI(cadena);
  //   var cadenaJson = JSON.parse(cadenaDeco);
  //   this.titulo = 'Editar Programa';
  //   this.programa = cadenaJson;
  //   this.modalRef = this.modalService.show(this.tplPrograma, { class: 'modal-lg' });
  // }
  editarPrograma(programaId) {
    this._ngZone.run(() => {
      this.router.navigate(['/programa','actualizar',programaId]);
    });
  }

  eliminarPrograma(id) {
    Swal({
      title: '¿Estás seguro de eliminar el Programa?',
      text: "¡No podrás revertir la acción!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle">&nbsp;</i>¡Si, confirmar!',
      cancelButtonText: '<i class="fa fa-ban">&nbsp;</i>Cancelar'
    }).then((result) => {
      if (result) {
          this.programasService.eliminar(id).subscribe((res) => {
          this.contruirDataTable();
          Swal({
            position: 'right-end',
            type: 'success',
            title: 'Se Elimino con exito',
            showConfirmButton: false,
            timer: 1500
          }).catch(error => { });
        }), err => {
        };
      }
    }).catch(error => { });
  }

}


