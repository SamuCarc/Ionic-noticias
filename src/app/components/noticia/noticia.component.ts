import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../interfaces/interfaces';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss'],
})
export class NoticiaComponent implements OnInit {

  @Input() noticia:Article;
  @Input() indice:number;
  @Input() enFavoritos;

  constructor( private iap:InAppBrowser,
                private actionSheetController:ActionSheetController,
                private socialSharing:SocialSharing,
                private dataLocalService:DataLocalService,
                private platform:Platform) { }

  ngOnInit() {}

  abrirNoticias() {
    const browser = this.iap.create(this.noticia.url, '_system');
    //browser.show();
  }

  async lanzarMenu () {

    let guardarBorrarBtn;

    if (this.enFavoritos) {
      guardarBorrarBtn = {
        text: 'Borrar de Favoritos',
        icon: 'trash',
        handler: () => {
          console.log('Delete favorite clicked');
          this.dataLocalService.borrarNoticia(this.noticia);

        }
      };
    } else {
      guardarBorrarBtn = {
        text: 'Favorito',
        icon: 'star',
        handler: () => {
          console.log('Favorite clicked');
          this.dataLocalService.guardarNoticia(this.noticia);
        }
      };
    }

    const actionSheet = await this.actionSheetController.create({
       buttons: [
      
      {
        text: 'Compartir',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
          this.compartirNoticia();

        }
      },
      guardarBorrarBtn,
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }


  compartirNoticia() {

    if (this.platform.is('cordova')) {
      this.socialSharing.share(
        this.noticia.title,
        this.noticia.source.name,
        '',
        this.noticia.url
      )  
    } else {

      if (navigator.share) {
        navigator.share({
          title: this.noticia.title,
          text: this.noticia.description,
          url: this.noticia.url,
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing: ', error));
      } else {
        console.log("No soporta el SHARE");
      }

    }

  }

}
