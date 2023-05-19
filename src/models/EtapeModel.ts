import { CoordonnesEtapeModel } from './CoordonnesEtapeModel';

export interface EtapeModel {
    id?: number;
    coordonneesList: Array<CoordonnesEtapeModel>;
    parcours_id: number;
    distance?: number;
    startDate?: Date;
    endDate?: Date;
    duree?: Duration;
    vitesse?: number;
}
  