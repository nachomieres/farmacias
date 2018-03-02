import { PosicionProvider } from '../../providers/posicion/posicion';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { FarmaciaProvider } from '../../providers/farmacia/farmacia';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LISTA_LOCALIDADES } from './../../datos/codigos';
import { stringify } from '@angular/core/src/util';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  resultado: NativeGeocoderReverseResult;
  geoposition: Geoposition;
  listaFarmacias: any;
  fecha: Date;
  fechaGuardia: any;
  localidad: string ="";
  poblacion: any;
  botonMapa = true;

  constructor(public navCtrl: NavController, 
              private posicion: PosicionProvider,               
              private farmacia: FarmaciaProvider,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {
      this.fecha = new Date ();
      this.getPosicion ();
  }

  getPosicion () {
    try {
      let loader = this.loadingCtrl.create({
        content: "Buscando ubicación...",        
      });
      loader.present();
      this.posicion.getLocalidad().then (datos => {    
        datos.subscribe (data => {          
          console.log (data);
          console.log (data.results[1].address_components[1].types[0]);
          var localidad: string ='';
          if (data.results[1].address_components[0].types[0] == 'locality') {
            localidad = data.results[1].address_components[0].long_name;
          }
          if (data.results[1].address_components[1].types[0] == 'locality') {
            localidad = data.results[1].address_components[1].long_name;            
          }
          if (data.results[1].address_components[2].types[0] == 'locality') {
            localidad = data.results[1].address_components[2].long_name;            
          }

          let codigo = LISTA_LOCALIDADES.indexOf (localidad.toLowerCase ());
          console.log (codigo + ' ' + localidad);
          this.farmacia.getFarmacia (this.fecha, codigo).subscribe (data => {
            console.log (data);
            this.listaFarmacias = data;
            this.fechaGuardia = data[0].fecha;
            this.localidad = localidad.toLocaleUpperCase();
            //console.log (data);*/
            loader.dismiss ();
            this.botonMapa = false;
          })      
        });
        loader.dismiss ();
      })
      .catch (error => {
        console.log (error);
        this.muestraToast (error.message);
      });
    }
    catch (e) {
      console.log (e);      
    }
  }

  alMapa (direccion: string) {    
    this.navCtrl.push ('RutaPage',{destino: direccion});
  }

  alMapaRes () {
    this.navCtrl.push ('MapaResultadosPage', {lista: this.listaFarmacias});
  }

  muestraToast (texto: string) {
    let toast = this.toastCtrl.create({
      message: texto,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  doRefresh(refresher) {
    this.getPosicion ();
    refresher.complete();
  }
}
