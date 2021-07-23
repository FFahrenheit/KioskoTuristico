import { compileClassMetadata } from "@angular/compiler";
import { Routes } from "@angular/router";
import { InicioComponent } from "./inicio/inicio.component";
import { AdminComponent } from "./layouts/admin/admin.component";
import { BlankComponent } from "./layouts/blank/blank.component";

export const AppRoutes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'administrador',
                loadChildren: () =>
                import('./admin/admin.module').then(
                    (m) => m.AdminModule
                )
            }
        ]
    },
    {
        path: '',
        component: BlankComponent,
        children: [
            {
                path: 'inicio',
                component: InicioComponent,
                data: {
                    title: '¡Bienvenido al Kiosko Turístico GDL!'
                }
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'inicio'
            }
        ]
    },
    {
        path: '**',
        component: InicioComponent
    }
]
