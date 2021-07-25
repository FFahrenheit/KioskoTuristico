import { Routes } from "@angular/router";
import { EditPlacesComponent } from "./edit-places/edit-places.component";
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
                path: 'puntos/editar',
                component: EditPlacesComponent,
                data: {
                    title: 'Editar detalles de puntos de interés'
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