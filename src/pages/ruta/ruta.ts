import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { ToastController } from 'ionic-angular';
import { PosicionProvider } from '../../providers/posicion/posicion';
import { HomePage } from '../home/home';
/**
 * Generated class for the RutaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()

@Component({
  selector: 'page-ruta',
  templateUrl: 'ruta.html',
})
export class RutaPage {


  @ViewChild('map') mapElement: ElementRef;
  map: any;
  geoOptions: GeolocationOptions;
  destino: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private geolocation: Geolocation,
              public toastCtrl: ToastController,
              public posicion: PosicionProvider) {
    this.geoOptions = {
      maximumAge: 1000,
      timeout: 20000,
      enableHighAccuracy: true      
    };               
    this.destino = this.navParams.get ('destino');
    if (!this.destino) {
      this.navCtrl.setRoot (HomePage);
    }
    console.log (this.destino);
  }

  ionViewDidLoad() {
    if (this.destino) {
      this.posicion.getCoordenadas (this.destino).subscribe (data => {
        console.log (data);
        this.destino = data.results[0].formatted_address;
        console.log (this.destino);
      });
      this.geolocation.getCurrentPosition (this.geoOptions)
        .then (datos => {
          this.loadMap (datos.coords.latitude, datos.coords.longitude);
          this.startNavigating (datos);
      })
      .catch (error => {
        console.log (error);
      });    
    }
  }

  loadMap(latitud: number, longitud: number){ 
    let latLng = new google.maps.LatLng(latitud, longitud);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
  }

  startNavigating(datos: Geoposition){
 
        let directionsService = new google.maps.DirectionsService;
        let directionsDisplay = new google.maps.DirectionsRenderer;
 
        directionsDisplay.setMap(this.map);
        //directionsDisplay.setPanel(this.directionsPanel.nativeElement);
 
        directionsService.route({
            //origin: {lat: datos.coords.latitude, lng: datos.coords.longitude},
            origin: new google.maps.LatLng(datos.coords.latitude, datos.coords.longitude),
            destination: this.destino.toString (),
            //destination: 'Mieres',
            travelMode: google.maps.TravelMode['WALKING']
        }, (res, status) => {
 
            if(status == google.maps.DirectionsStatus.OK){
                directionsDisplay.setDirections(res);
                let toast = this.toastCtrl.create({
                  message: 'Distancia: ' + res.routes[0].legs[0].distance.text,
                  duration: 3000,
                  position: 'bottom'
                });
                toast.present();
                console.log (res);
            } else {
                console.warn(status);
            }
 
        });
 
    }

}
