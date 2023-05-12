import { ref } from "vue";
import { CoordonnesEtapeModel } from "../models/CoordonnesEtapeModel";
import { CoordonnesModel } from "../models/CoordonnesModel";
import { disconnect } from "process";

export function etapeIsOnParcours(coordonneesEtape: Array<CoordonnesEtapeModel>, coordonnesParcours : Array<CoordonnesModel>): boolean {
    const tolerence = 15.0;
    for(let i = 0; i < coordonneesEtape.length; i++) {
        let isOnParcours = false;
        const c = coordonneesEtape[i];
        for(let j = 0; j < coordonnesParcours.length; j++) {
            const p = coordonnesParcours[j];
            const coordinates = ({
                lat: c.latitude,
                lng: c.longitude,
            })
            const coordinates2 = ({
                lat: p.latitude,
                lng: p.longitude,
            })
            const distance = google.maps.geometry.spherical.computeDistanceBetween(coordinates, coordinates2);
            if(distance < tolerence) {
                isOnParcours = true;
                break;
            }
        }
        if(!isOnParcours) {
            return false;
        }
    }
    return true;
}


export async function traceEtapeOnParcours(coordonneesEtape: Array<CoordonnesEtapeModel>, coordonnesParcours : Array<CoordonnesModel>): Promise<Array<CoordonnesEtapeModel>> {
    const etapeOnParcours = [];
    const tolerence = 5000.0;
    let distance =0.0;
    let tracefound = false;
    const coordinatesParcours = coordonnesParcours.map(p => ({
      lat: p.latitude,
      lng: p.longitude,
    }));
    for (const c of coordonneesEtape) {
      let isOnParcours = false;
      const coordinatesEtape = {
        lat: c.latitude,
        lng: c.longitude,
      };
      for (const p of coordinatesParcours) {
        distance = google.maps.geometry.spherical.computeDistanceBetween(coordinatesEtape, p);
        if (distance < tolerence) {
          tracefound = true;
          isOnParcours = true;
          etapeOnParcours.push(c);
          break;
        }
      }
      if (!isOnParcours && tracefound) {
        return etapeOnParcours;
      }
    }
    return etapeOnParcours;
  }

export function CoordToPosition(coordonneesList: Array<CoordonnesEtapeModel> | Array<CoordonnesModel> ) {
    if(coordonneesList.length > 0){
        return coordonneesList.map(coord => {
            return {lat: coord.latitude, lng: coord.longitude};
          });
    }
    return null;
}

export function GetMiddleCoord(coordonneesList: Array<CoordonnesEtapeModel> | Array<CoordonnesModel> ) {
    var start = coordonneesList.at(0);
    var end = coordonneesList.at(coordonneesList.length-1);
    
    if(start && end){
        var lat = (start!.latitude + end!.latitude)/2;
        var lng = (start!.longitude + end!.longitude)/2;
        var id = coordonneesList.at(0)!.id;
        var middleCoord : CoordonnesEtapeModel = {latitude: lat, longitude: lng, etape_id: id!}
        return middleCoord;
    }
    var middleCoord : CoordonnesEtapeModel = {latitude: 48.419603, longitude: -4.459316, etape_id: id!}
    return middleCoord;


}

export function CalculDistance(coordonneesList: Array<CoordonnesEtapeModel> | Array<CoordonnesModel> ) : number{
    var distance =0.0;
    for (var i = 0; i < coordonneesList.length-1; i++){
       const coordinates = ({
       lat: coordonneesList[i].latitude,
       lng: coordonneesList[i].longitude,
       })
       const coordinates2 = ({
       lat: coordonneesList[i+1].latitude,
       lng: coordonneesList[i+1].longitude,
       })
       distance = distance + google.maps.geometry.spherical.computeDistanceBetween(coordinates, coordinates2);
    }
    //Distance en km
    return  parseFloat((distance/1000).toFixed(2));
}


export function GetEtapeOnParcours(coordonneesList: CoordonnesModel[], markers : { lat: number, lng: number }[], etapeId : number ) : CoordonnesEtapeModel[]{
    
    const coord: CoordonnesEtapeModel[] = [];
    let saveCoord = false;
    let reverseCoord = false;
    let stopSaveCoord = false;

    for(const c of coordonneesList) {
        if((markers[0].lat === c.latitude && markers[0].lng === c.longitude) || (markers[1].lat === c.latitude && markers[1].lng === c.longitude)){
            if(!saveCoord){
                saveCoord = true;
            } else {
                stopSaveCoord = true;
            }
            if(markers[1].lat === c.latitude && markers[1].lng === c.longitude && saveCoord){
                reverseCoord = true;
            }
        }
        if(saveCoord){
            const coordToAdd: CoordonnesEtapeModel = { latitude: c.latitude, longitude: c.longitude, etape_id: etapeId };
            coord.push(coordToAdd);
            if(stopSaveCoord){
                saveCoord = false;
                stopSaveCoord = false;
            }
        }
    }
    if(reverseCoord){
        coord.reverse();
    }

    return coord;
}

export function GetZoomMap(coordonneesList: Array<CoordonnesEtapeModel> | Array<CoordonnesModel> ) : number{

    var lat_sw = Number.MAX_VALUE;
    var lat_ne = Number.MIN_VALUE;
    var lng_sw = Number.MAX_VALUE;
    var lng_ne = Number.MIN_VALUE;

    for (var i = 0; i < coordonneesList.length; i++){
        if(coordonneesList[i].latitude > lat_ne){
            lat_ne = coordonneesList[i].latitude
        }
        if(coordonneesList[i].latitude > lng_ne){
            lng_ne = coordonneesList[i].latitude
        }
        if( coordonneesList[i].latitude < lat_sw ){
            lat_sw = coordonneesList[i].latitude
        }
        if(coordonneesList[i].longitude < lng_sw){
            lng_sw = coordonneesList[i].longitude
        }
    }
      const mapDim = {
        height: 700,
        width: 700
      };

      return getBoundsZoomLevel(lat_sw,lat_ne,lng_sw,lng_ne,mapDim);
}

function getBoundsZoomLevel(lat_min: number, lat_max: number,lng_min: number, lng_max: number, mapDim: { height: number; width: number; }) {
    var WORLD_DIM = { height: 256, width: 256 };
    var ZOOM_MAX = 21;

    var ne = {
        lat: lat_max,
        lng: lng_max,
        }
    var sw = {
        lat: lat_min,
        lng: lng_min,
        }

    var latFraction = (latRad(ne.lat) - latRad(sw.lat)) / Math.PI;

    var lngDiff = ne.lng - sw.lng;
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction) ;
    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction) ;

    return Math.max(latZoom, lngZoom);
}

function latRad(lat: number) {
    var sin = Math.sin(lat * Math.PI / 180);
    var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
}

function zoom(mapPx: number, worldPx: number, fraction: number) {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
}


