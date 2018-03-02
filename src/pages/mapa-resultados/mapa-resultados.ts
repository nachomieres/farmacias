import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { ToastController } from 'ionic-angular';
import { PosicionProvider } from '../../providers/posicion/posicion';
import { HomePage } from '../home/home';

/**
 * Generated class for the MapaResultadosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google;
@IonicPage()
@Component({
  selector: 'page-mapa-resultados',
  templateUrl: 'mapa-resultados.html',
})
export class MapaResultadosPage {
  
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  lista: any[];
  geoOptions: GeolocationOptions;
  marcadores = [];
  limites = new google.maps.LatLngBounds();

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private posicion: PosicionProvider,
              private geolocation: Geolocation) {
    this.lista = this.navParams.get ('lista');
    //console.log (this.lista);
    this.geoOptions = {
      maximumAge: 1000,
      timeout: 20000,
      enableHighAccuracy: true      
    };     
  }

  ionViewDidLoad() {
    this.geolocation.getCurrentPosition (this.geoOptions)
        .then (datos => {
          this.loadMap (datos.coords.latitude, datos.coords.longitude);   
          var marcadores = [];
          var limites = new google.maps.LatLngBounds();
          for(var i in this.lista){
            //console.log(this.lista[i]);//This will print the objects            
            this.posicion.getCoordenadas (this.lista[i].direccion).subscribe (data => {
              if (data.results.length > 0) {
                console.log (data);        
                this.addMarker (data.results[0].geometry.location.lat, 
                                data.results[0].geometry.location.lng,
                                data.results[0].formatted_address);       
              } //if 
            }) // getCoordenadas      
          } // for           
      }) //getCurrentPosition
      .catch (error => {
        console.log (error);
      });            
  }

  loadMap(latitud: number, longitud: number){ 
    let latLng = new google.maps.LatLng(latitud, longitud);
 
    let mapOptions = {
      center: latLng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
    let marker = new google.maps.Marker({
      map: this.map,
      position: latLng
    }); 
    this.marcadores.push (marker);
    this.limites.extend(marker.position);    
    this.map.fitBounds(this.limites);
  }

  addMarker(latitud: number, longitud: number, nombre: string){
    let latLng = new google.maps.LatLng(latitud, longitud);
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,  
      icon: 'https://bioplusrx.com/wp-content/uploads/2016/08/cropped-icon-32x32.png'
    }); 
    let infoWindow = new google.maps.InfoWindow({
      content: `<h4>${nombre}</h4>`
    }); 
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });    
    this.marcadores.push (marker);
    this.limites.extend(marker.position);    
    this.map.fitBounds(this.limites);
  }

  aHome () {
    this.navCtrl.setRoot ('HomePage');
  }
}
