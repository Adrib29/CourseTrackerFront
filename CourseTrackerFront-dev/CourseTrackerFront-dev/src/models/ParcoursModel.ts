import { CoordonnesModel } from './CoordonnesModel';

export interface ParcoursModel {
    id?: number;
    nom: string;
    coordonneesList: Array<CoordonnesModel>;
}
  