import { BrowserModule} from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { FormsModule} from "@angular/forms";
import { HttpModule} from "@angular/http";
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SweetAlertService } from 'ng2-sweetalert2';
import { DataTableModule} from "angular-6-datatable";
import { DataTablesModule } from 'angular-datatables';

//RUTAS
import { APP_ROUTING} from './app.routes';
//SERVICIOS
import { ActividadService} from './services/actividad.service';
import { UsuariosService } from './services/usuarios.service';
import { AutenticacionService } from './services/autenticacion.service';
import { Guardian } from './services/guardian.service';
import { InteresesService } from './services/intereses.service';
import  {ProgramasService} from './services/programas.service';

//COMPONENTES
import { AppComponent } from './app.component';
import { InicioComponent } from './inicio.component';
import { IngresoComponent } from "./components/usuario/ingreso.component";
import { ProgramasComponent } from './components/programas/programas.component';
import { InteresesComponent } from './components/intereses/intereses.component';
import { PerfilComponent } from './components/usuario/perfil.component';
import { RegistroVoluntariosComponent } from './components/registro-voluntarios/registro-voluntarios.component';
import { ContactanosComponent } from './components/contactanos/contactanos.component';
import { ActividadComponent } from './components/actividad/actividad.component';
import { AppBootstrapModule } from './app-bootstrap/app-bootstrap.module';
import { DataFilterPipe } from './pipe/datatable.filter.pipe';
import { NgxPopper } from 'angular-popper';
import { NgxCaptchaModule } from 'ngx-captcha';
import { GradoComponent } from './components/grado/grado.component';
import { ProgramaComponent } from './components/programas/programa.component';
import { ConvocatoriasComponent } from './components/convocatorias/convocatorias.component';
import { ConvocatoriasService } from './services/convocatorias.service';
import { GradoService } from './services/grado.service';
import { ConvocatoriaComponent } from './components/convocatorias/convocatoria.component';

@NgModule({
  declarations: [
    AppComponent,
	  InicioComponent,
    IngresoComponent,
    ProgramasComponent,
    InteresesComponent,
    PerfilComponent,
    DataFilterPipe,
    RegistroVoluntariosComponent,
    ContactanosComponent,
    ActividadComponent,
    GradoComponent,
    ProgramaComponent,
    ConvocatoriasComponent,
    ConvocatoriaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
	  AngularFontAwesomeModule,
    AppBootstrapModule,
    DataTableModule,
    DataTablesModule,
  HttpModule,
  NgxPopper,
    APP_ROUTING,
    NgxCaptchaModule.forRoot({
      reCaptcha2SiteKey: '6LeM9GQUAAAAAD3xeCfm7swF8S9wblz-6mjcAyGx',
      // invisibleCaptchaSiteKey: '6LeM9GQUAAAAAEK_roGSxI9duMyB-XbEMWk-65s7'
    }),
  ],
  providers: [
    SweetAlertService,
    ProgramasService,
    AutenticacionService,
    InteresesService,
    UsuariosService,
    ActividadService,
    ConvocatoriasService,
    GradoService,
    Guardian
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
