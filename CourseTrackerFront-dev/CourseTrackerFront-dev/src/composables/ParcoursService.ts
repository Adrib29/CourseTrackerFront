import axios from 'axios';
import { ParcoursModel } from '../models/ParcoursModel';

export function useParcoursService() {
  return {
    async list(): Promise<Array<ParcoursModel>> {
      const response = await axios.get<Array<ParcoursModel>>('http://localhost:8081/parcours');
      return response.data;
    },
    async getParcours(parcoursId: number): Promise<ParcoursModel> {
      const response = await axios.get<ParcoursModel>(`http://localhost:8081/parcours/${parcoursId}`);
      return response.data;
    },
    async setParcours(parcours : ParcoursModel): Promise<ParcoursModel> {
      /*console.log(parcours.nom);
      console.log(parcours.coordonneesList);
      const response = await axios.post<ParcoursModel>(`http://localhost:8081/parcours`, { parcours });
      return response.data;*/
      
      const response = await axios.post<ParcoursModel>('http://localhost:8081/parcours', parcours);
      console.log(response.data);
      return response.data;
    },

    async updateParcours(parcours : ParcoursModel): Promise<ParcoursModel> {  
      const response = await axios.put<ParcoursModel>(`http://localhost:8081/parcours/${parcours.id}`, parcours);
      console.log(response.data);
      return response.data;
    },

    async deleteParcours(id : number): Promise<void> {  
      await axios.delete(`http://localhost:8081/parcours/${id}`);
    }

  };
}
