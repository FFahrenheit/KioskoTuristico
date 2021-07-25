export const sidebar = [
    {
        title: 'Estaciones',
        options: [
            {
                title: 'Habilitar y Deshabilitar estaciones',
                icon: 'fas fa-toggle-on',
                route: ['administrador', 'habilitar']
            },
            {
                title: 'Editar estaciones',
                icon: 'fas fa-thumbtack',
                route: ['administrador', 'estaciones', 'editar']
            },
        ]
    },
    {
        title: 'Puntos de interés',
        options: [
            {
                title: 'Editar punto de interés',
                icon: 'fas fa-place-of-worship',
                route: ['administrador','habilitar']
            }
        ]
    }
]