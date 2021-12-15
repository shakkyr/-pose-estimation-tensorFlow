// 1. Install dependencies DONE
// 2. Import dependencies DONE
// 3. Setup webcam and canvas DONE
// 4. Define references to those DONE
// 5. Load posenet DONE
// 6. Detect function DONE
// 7. Drawing utilities from tensorflow DONE
// 8. Draw functions DONE

import React, { useRef } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  //  Load posenet
  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });
    //

      setInterval(() => {
        detect(net);
      }, 2000);
    
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Make Detections
      const pose = await net.estimateSinglePose(video);
      
     const left =[];
     const right =[];

      left.push(pose.keypoints[11].position,pose.keypoints[13].position,pose.keypoints[15].position)
      right.push(pose.keypoints[12].position,pose.keypoints[14].position,pose.keypoints[16].position)
      console.log('left',left);
      console.log('right',right);
// !============================= left knee =================
      let A = {x:left[0].x, y:left[0].y}, B = {x:left[1].x, y:left[1].y}, C = {x:left[2].x, y:left[2].y}
        let AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
        let BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
        let AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
        console.log('Left Knee radians',Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB))); 
        console.log('Left Knee degrees',(Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB))*180)/ Math.PI); 

// !======================== right knee ====================
let D = {x:left[0].x, y:left[0].y}, E = {x:left[1].x, y:left[1].y}, F = {x:left[2].x, y:left[2].y}
let DE = Math.sqrt(Math.pow(E.x-D.x,2)+ Math.pow(E.y-D.y,2));    
let EF = Math.sqrt(Math.pow(E.x-F.x,2)+ Math.pow(E.y-F.y,2)); 
let DF = Math.sqrt(Math.pow(F.x-D.x,2)+ Math.pow(F.y-D.y,2));
console.log('Right Knee radians',Math.acos((EF*EF+DE*DE-DF*DF)/(2*EF*DE))); 
console.log('Right Knee degrees',(Math.acos((EF*EF+DE*DE-DF*DF)/(2*EF*DE))*180)/ Math.PI); 

      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    }
  };

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawKeypoints(pose["keypoints"], 0.5, ctx);
    drawSkeleton(pose["keypoints"], 0.5, ctx);
  };

  runPosenet();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;