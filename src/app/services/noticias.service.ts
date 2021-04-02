import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RespuestaTopHeadlines } from '../interfaces/interfaces';
import { environment } from '../../environments/environment.prod';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;

const headers = new HttpHeaders ({
  'X-Api-Key': apiKey,
});

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  headlinesPage:number = 0;

  categoriaActual:string = '';
  categoriaPage:number=0;

  constructor( private http:HttpClient) { }


  private ejecutarQuery<T>( query:string ) {
    query =  apiUrl + query;
    return this.http.get<T>( query, {headers});
  }

  getTopHeadlines() {
    this.headlinesPage++;
    return this.ejecutarQuery<RespuestaTopHeadlines>(`/top-headlines?country=us&page=${this.headlinesPage}`);
  }

  getTopHeadlinesCategoria ( categoria:string ) {
    if ( this.categoriaActual == categoria ) {
      this.categoriaPage++;
    } else {
      this.categoriaPage = 1;
      this.categoriaActual = categoria;
    }

    return this.ejecutarQuery<RespuestaTopHeadlines>(`/top-headlines?country=us&category=${categoria}&page=${this.categoriaPage}`);
  }
}
