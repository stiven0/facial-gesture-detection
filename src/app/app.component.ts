import { AfterViewInit, Component } from '@angular/core';
import { Detections } from './interfaces/detections';

declare var faceapi: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  // private eventsCategoryHappySurprised = [
  //   '62c06389ce24e5001590ccc9',
  //   '62c19208ece37700150cf423'
  // ];

  // private eventsCategoryAngryDisgustedSadFearful = [
  //   '62bb8a26048f090015efa646',
  //   '62c0e28bce24e5001590ed9e'
  // ];

  videoElement!: HTMLElement | null;
  canvas!: HTMLElement | null;
  expression: string = 'neutral';
  MODEL_URL = '../assets/weights';
  isRedirect = false;
  isStarted = false;

  async ngAfterViewInit() {

    this.videoElement = document.getElementById('videoElement');
    this.canvas = document.getElementById('canvasElement');

    try {  
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(this.MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(this.MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(this.MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(this.MODEL_URL),
          ])

          this.setupWebcam();

    } catch (error) {
        console.log(error);
    }


  }

  setupWebcam() {

    if ( navigator.mediaDevices ) {

        navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          (this.videoElement as any).srcObject = stream;
          (this.videoElement as any).onplay = this.drawDetections();
          (this.videoElement as any).play();
        })
        .catch(err => console.log(err))

    }

  }

  drawDetections() {

    const displaySize = faceapi.matchDimensions(this.canvas, this.videoElement, false);

    setInterval(async () => {

      const detections = await faceapi
                                .detectAllFaces(this.videoElement, new faceapi.TinyFaceDetectorOptions())
                                .withFaceLandmarks()
                                .withFaceExpressions();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      (this.canvas as any).getContext('2d').clearRect(0, 0, (this.canvas as any).width, (this.canvas as any).height);

      faceapi.draw.drawFaceExpressions(this.canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(this.canvas, detections);
      faceapi.draw.drawDetections(this.canvas, detections);

      if ( detections[0]?.expressions ) this.getFaceGesture( detections[0].expressions );

    }, 100);

  }

  
  getFaceGesture( detections: Detections ) {

    let score = 0;
  
    for ( let [key, value] of Object.entries( detections ) ) {
        if ( value > score ) {
            score = value;
            this.expression = key;
        }
    }

    // if ( this.isStarted ) {

    //     setTimeout(() => {
        
    //         if ( this.isStarted && this.expression !== 'neutral' ) {

    //           if ( this.expression === 'happy' || this.expression === 'surprised' ) {
    //                   const numberRandom = Math.round( Math.random() * 1 );
    //                   window.open( `url${ this.eventsCategoryHappySurprised[ numberRandom ] }` );
    //               } else {
    //                   const numberRandom = Math.round( Math.random() * 1 );
    //                   window.open( `url${ this.eventsCategoryAngryDisgustedSadFearful[ numberRandom ] }` );
    //               }
    //               this.isStarted = false;   

    //         } 
        
    //     }, 2000)
    
    // }
  
  }

}
