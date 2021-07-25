import { Routes } from "@angular/router";
import { EditStationsComponent } from "./edit-stations/edit-stations.component";
import { EnableStationsComponent } from "./enable-stations/enable-stations.component";

export const AdminRoutes : Routes = [
    {
        path:'',
        children: [
            {
                path: 'habilitar',
                component: EnableStationsComponent,
                data: {
                    title: 'Habilitar y deshabilitar estaciones'
                }
            },
            {
                path: 'estaciones/editar',
                component: EditStationsComponent,
                data: {
                    title: 'Editar detalles de estaciones'
                }
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'habilitar'
            }
        ]
    }
]