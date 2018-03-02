import { LISTA_LOCALIDADES } from './../../datos/codigos';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { ToastController } from 'ionic-angular';
/*
  Generated class for the PosicionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PosicionProvider {

  geoOptions: GeolocationOptions;
  key: string = 'AIzaSyAh3_73n6XR3IsHoiJKqgLfpzLDURdcLE0';
  key_geocode:string = 'AIzaSyAh3_73n6XR3IsHoiJKqgLfpzLDURdcLE0';
  url: string = 'https://maps.googleapis.com/maps/api/geocode/json';
  url_geocode: string = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(public http: Http, 
              private geolocation: Geolocation, 
              private platform: Platform, 
              private natGeo: NativeGeocoder,
              public toastCtrl: ToastController) {        
  }

  async getPosicion () {
    await this.platform.ready ();
    this.geoOptions = {
      maximumAge: 10000,
      timeout: 30000,
      enableHighAccuracy: true
    };    
    return await this.geolocation.getCurrentPosition (this.geoOptions).then (data => {      
       return data;
    })
  };

  getLocalidad() {
    return this.getPosicion ().then (data => {      
      //console.log (data);
      let lat = 43.3757547;
      let long = -5.8274826;
      return this.http.get (`${this.url}?latlng=${data.coords.latitude},${data.coords.longitude}&key=${this.key}`)       
      //return this.http.get (`${this.url}?latlng=${lat},${long}&region=es&key=${this.key}`)       
        .map (data => data.json())                  
    })
  }

  getCoordenadas (direccion: string) {
    return this.http.get (`${this.url_geocode}?address=${direccion}&region=es&key=${this.key_geocode}`)
      .map (data => data.json ())
  }

  muestraToast (texto: string, pos: string) {
    let toast = this.toastCtrl.create({
          message: texto,
          duration: 2000,
          position: pos
        });
        toast.present();
  }
}
