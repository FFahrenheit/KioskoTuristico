import { Routes } from "@angular/router";
import { InicioComponent } from "./inicio/inicio.component";
import { BlankComponent } from "./layouts/blank/blank.component";

export const AppRoutes: Routes = [
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
