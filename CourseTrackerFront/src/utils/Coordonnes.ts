import { CoordonnesEtapeModel } from "../models/CoordonnesEtapeModel";
import { CoordonnesModel } from "../models/CoordonnesModel";



export function CoordToPosition(coordonneesList: Array<CoordonnesEtapeModel> | Array<CoordonnesModel> ) {
    return coordonneesList.map(coord => {
      return {lat: coord.latitude, lng: coord.longitude};
    });
}

export function GetMiddleCoord(coordonneesList: Array<CoordonnesEtapeModel> | Array<CoordonnesModel> ) {
    var start = coordonneesList.at(0);
    var end = coordonneesList.at(coordonneesList.length-1);
    var lat = (start!.latitude + end!.latitude)/2;
    var lng = (start!.longitude + end!.longitude)/2;
    var id = coordonneesList.at(0)!.id;
    var middleCoord : CoordonnesEtapeModel = {latitude: lat, longitude: lng, etape_id: id!}
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
    console.log(latZoom + " " + lngZoom + " "+ZOOM_MAX );
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


