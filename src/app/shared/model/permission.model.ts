export interface IPermission {
    name: string;
    desc: string;
}

export const permissions: IPermission[] = [
    { name: 'ALL', desc: 'Ajouter Modifier Supprimer' },
    { name: 'AM', desc: 'Add Modifier' },
    { name: 'MS', desc: 'Modifier Supprimer' },
    { name: 'M', desc: 'Modifier' },
    { name: 'A', desc: 'Add' },
    { name: 'V', desc: 'Voir' },
]
