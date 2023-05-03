import axios from 'axios';
import { EtapeModel } from '../models/EtapeModel';

export function useEtapeService() {
  return {
    async list(parcoursId : number): Promise<Array<EtapeModel>> {
      const response = await axios.get<Array<EtapeModel>>(`http://localhost:8081/parcours/${parcoursId}/etape`);
      return response.data;
    },
    //parcoursId: number,    /parcours/${parcoursId}
    async getEtape(etapeId: number): Promise<EtapeModel> {
      console.log(etapeId);
      const response = await axios.get<EtapeModel>(`http://localhost:8081/etape/${etapeId}`);
      return response.data;
    },
    async setEtape(etape : EtapeModel, parcoursId : number): Promise<EtapeModel> {     
      const response = await axios.post<EtapeModel>(`http://localhost:8081/parcours/${parcoursId}/etape`, etape);
      console.log(response.data);
      return response.data;
    },

    async updateEtape(parcoursId: number, etape : EtapeModel): Promise<EtapeModel> {  
      const response = await axios.put<EtapeModel>(`http://localhost:8081/parcours/${parcoursId}/etape/${etape.id}`, etape);
      console.log(response.data);
      return response.data;
    },

    async deleteEtape(id : number): Promise<void> {  
      await axios.delete(`http://localhost:8081/etape/${id}`);
    }

  };
}
