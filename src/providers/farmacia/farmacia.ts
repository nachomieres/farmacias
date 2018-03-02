import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class FarmaciaProvider {

  constructor(public http: Http) {    
  }
  
  getFarmacia (fecha: Date, codigo: number) {
    let dia = fecha.getDate().toString ();
    let mes = (fecha.getMonth() + 1).toString ();
    let anno = fecha.getFullYear().toString ();
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded' );
    let options = new RequestOptions({ headers: headers });
    let cadena: string = `busqueda=1&Fecha=${dia}%2F${mes}%2F${anno}&txtMunicipio=&txtLocalidad=${codigo}&btnBuscar=Buscar`;
    //console.log (cadena);
    let postParams = cadena;
    
    return this.http.post ('http://www.farmasturias.org/GESCOF/cms/Guardias/FarmaciaBuscar.asp?IdMenu=355&intPagina=1', postParams, options)
      .map (res => {
        //console.log (res.text ())
        let array= [];
        let i;
        let parser = new DOMParser ();
        let municipio = parser.parseFromString (res.text (), "text/html").getElementsByClassName ('ListadoResultados');
        //console.log (municipio[0].innerHTML);
        let fecha = parser.parseFromString (res.text (), "text/html").getElementsByClassName ('FechaGuardias')[0].textContent;
        for (i in municipio) {
          if (i < municipio.length) {
            //console.log (municipio[i].innerHTML);
            let nombre =  parser.parseFromString (municipio[i].innerHTML, "text/html").getElementsByClassName ('TituloResultado')[0].textContent;
            let direccion = parser.parseFromString (municipio[i].innerHTML, "text/html").getElementsByClassName ('ico-localizacion');
            let telefono = parser.parseFromString (municipio[i].innerHTML, "text/html").getElementsByClassName ('ico-telefono')[0].textContent;
            if (direccion[0].textContent) {
              array.push ({
                fecha: fecha,
                nombre: nombre,
                direccion: direccion[0].textContent.slice (11),
                telefono: telefono
              });
            }
          }
        }
        return array; 
      });
  }
}
