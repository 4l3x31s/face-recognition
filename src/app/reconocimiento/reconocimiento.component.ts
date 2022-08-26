import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-reconocimiento',
  templateUrl: './reconocimiento.component.html',
  styleUrls: ['./reconocimiento.component.scss']
})
export class ReconocimientoComponent implements OnInit {

  WIDTH = 880;
  HEIGHT = 560;
  @ViewChild('video', { static: true })
  public video!: ElementRef;
  @ViewChild('canvas',{ static: true })
  public canvasRef!: ElementRef;
  constructor(private elRef: ElementRef) {}
  stream: any;
  detection: any;
  resizedDetections: any;
  canvas: any;
  canvasEl: any;
  displaySize: any;
  videoInput: any;
  labels = ['alex','roca'];
  faceMatcher: any;
  mens = ''

  async ngOnInit() {
    await Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/models'),
    await faceapi.nets.faceLandmark68Net.loadFromUri('../../assets/models'),
    await faceapi.nets.faceRecognitionNet.loadFromUri('../../assets/models'),
    await faceapi.nets.ssdMobilenetv1.loadFromUri('../../assets/models'),
    //await faceapi.loadSsdMobilenetv1Model('../../assets/models'),
    await faceapi.nets.faceExpressionNet.loadFromUri('../../assets/models'),]).then(() => this.startVideo());


  }

  startVideo() {
    this.videoInput = this.video.nativeElement;
    let newVariable: any;

    newVariable = window.navigator;
    newVariable.getUserMedia(
      { video: {}, audio: false },
      (stream: any) => (this.videoInput.srcObject = stream),
      (err :any ) => console.log(err)
    );
    console.log('test')
    this.detect_Faces();
  }

  async detect_Faces() {


    this.elRef.nativeElement.querySelector('video').addEventListener('play', async () => {
        console.log('inicia camara');

        const labeledFaceDescriptors = await Promise.all(
          this.labels.map(async label => {
            // fetch image data from urls and convert blob to HTMLImage element

            const imgUrl = `http://localhost:4200/assets/data/${label}.jpeg`;//`../../assets/data/${label}.jpeg`
            console.log(imgUrl)
            const img = await faceapi.fetchImage(imgUrl)

            // detect the face with the highest score in the image and compute it's landmarks and face descriptor
            const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

            if (!fullFaceDescription) {
              throw new Error(`no faces detected for ${label}`)
            }

            const faceDescriptors = [fullFaceDescription.descriptor]
            return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
          })
        )
        this.faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);



       this.canvas = await faceapi.createCanvasFromMedia(this.videoInput);
       this.canvasEl = this.canvasRef.nativeElement;
       this.canvasEl.appendChild(this.canvas);
       this.canvas.setAttribute('id', 'canvas');
       this.canvas.setAttribute(
          'style',
          `position: fixed;
          top: 0;
          left: 0;`
       );
       this.displaySize = {
          width: this.videoInput.width,
          height: this.videoInput.height,
       };
       faceapi.matchDimensions(this.canvas, this.displaySize);
       console.log('antes')
       setInterval(async () => {


         //this.detection = await faceapi.detectAllFaces(this.videoInput,  new  faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
         this.detection = await faceapi.detectAllFaces(this.videoInput,  new  faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();

         this.resizedDetections = faceapi.resizeResults(this.detection, this.displaySize)
         const results = this.resizedDetections.map((d: any )=> this.faceMatcher.findBestMatch(d.descriptor))
         this.canvas.getContext('2d').clearRect(0, 0,      this.canvas.width,this.canvas.height);

         results.forEach((result:any, i:any) => {


           const box = this.resizedDetections[i].detection.box
           const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })

           if(result.toString().split(' ')[0] == 'alex') this.mens = 'Felicidades eres Alex'
           drawBox.draw(this.canvas)


         })

         //faceapi.draw.drawDetections(this.canvas, this.resizedDetections);



         //faceapi.draw.drawFaceLandmarks(this.canvas, this.resizedDetections);
         //faceapi.draw.drawFaceExpressions(this.canvas, this.resizedDetections);


         /*console.log(this.detection);
         this.resizedDetections = faceapi.resizeResults(
            this.detection,
            this.displaySize
          );


         this.canvas.getContext('2d').clearRect(0, 0,      this.canvas.width,this.canvas.height);
         faceapi.draw.drawDetections(this.canvas, this.resizedDetections);
         faceapi.draw.drawFaceLandmarks(this.canvas, this.resizedDetections);
         faceapi.draw.drawFaceExpressions(this.canvas, this.resizedDetections);*/
      }, 100);
      });
  }


}
