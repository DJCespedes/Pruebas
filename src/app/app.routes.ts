import {Routes, RouterModule} from '@angular/router';

import { Guardian } from './services/guardian.service';
import { InicioComponent} from './inicio.component';
import { IngresoComponent} from "./components/usuario/ingreso.component";
import { PerfilComponent } from './components/usuario/perfil.component';
import { ProgramasComponent} from './components/programas/programas.component';
import { ProgramaComponent} from './components/programas/programa.component';
import { InteresesComponent } from './components/intereses/intereses.component';
import { RegistroVoluntariosComponent } from './components/registro-voluntarios/registro-voluntarios.component';
import { ContactanosComponent } from './components/contactanos/contactanos.component';
import { ActividadComponent } from './components/actividad/actividad.component';
import { GradoComponent } from './components/grado/grado.component';
import { ConvocatoriasComponent } from './components/convocatorias/convocatorias.component';
import { ConvocatoriaComponent } from './components/convocatorias/convocatoria.component';

const APP_ROUTES: Routes = [
    {path: '', component: InicioComponent},
    {path: 'inicio', component: InicioComponent},
    {path: 'ingreso', component: IngresoComponent},
    {path: 'usuario/perfil', component: PerfilComponent, canActivate:[Guardian]},
    {path: 'programas', component: ProgramasComponent, canActivate:[Guardian]},
    //Nuevo : http://localhost:4200/programa/nuevo
    {path: 'programa/:accion', component: ProgramaComponent, canActivate:[Guardian]},
    //Nuevo : http://localhost:4200/actualizar/1
    {path: 'programa/:accion/:programaId', component: ProgramaComponent, canActivate:[Guardian]},
    {path: 'administracion/intereses', component: InteresesComponent, canActivate:[Guardian]},
    {path: 'convocatorias', component: ConvocatoriasComponent, canActivate:[Guardian]},
    {path: 'contactanos', component: ContactanosComponent, canActivate:[Guardian]},
    {path: 'registro-voluntarios', component: RegistroVoluntariosComponent, canActivate:[Guardian]},
    //Nuevo : http://localhost:4200/grado/nuevo/1
    {path: 'grado/:accion/:programaId', component: GradoComponent, canActivate:[Guardian]},
    //Nuevo : http://localhost:4200/grado/actualizar/1/15
    {path: 'grado/:accion/:programaId/:gradoId', component: GradoComponent, canActivate:[Guardian]},
    //Nuevo : http://localhost:4200/actividad/nuevo/1
    {path: 'actividad/:accion/:gradoId', component: ActividadComponent, canActivate:[Guardian]},
    //Nuevo : http://localhost:4200/actividad/actualizar/1/15
    {path: 'actividad/:accion/:gradoId/:actividadId', component: ActividadComponent, canActivate:[Guardian]},
    //Nuevo : http://localhost:4200/convocatoria/nuevo/1
    {path: 'convocatoria/:accion/:convocatoriaId', component: ConvocatoriaComponent, canActivate:[Guardian]},
    {path: '**', pathMatch:'full', redirectTo:'inicio'},
  ]
  
  export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);