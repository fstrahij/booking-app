import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
  standalone: false
})
export class ImagePickerComponent  implements OnInit {
  @Output() imagePick = new EventEmitter<string>();
  
  selectedImage: string;

  constructor(private platform: Platform) { }

  ngOnInit() {}

  onPickImage(){
    if(!Capacitor.isPluginAvailable('Camera')) return;

    console.log('nova', Capacitor.isPluginAvailable('Camera'));

    /*this.platform.ready().then(() => {
      const available = Capacitor.isPluginAvailable('Camera');
      console.log('Camera plugin available:', available);
    });*/
    
    Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      source: CameraSource.Prompt,
      correctOrientation: true,
      resultType: CameraResultType.Uri,
      width: 200
    }).then(image => {
      console.info('image webpath',image.webPath);
      this.selectedImage = image.webPath;
      this.imagePick.emit(image.webPath);
    }).catch(error=>{
      console.log(error);
      return false;
    })
  }

}
