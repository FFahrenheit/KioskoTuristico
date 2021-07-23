import { Routes } from "@angular/router";
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
                path: '',
                pathMatch: 'full',
                redirectTo: 'habilitar'
            }
        ]
    }
]