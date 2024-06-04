const title = document.querySelector(".title");
const subTitle = document.querySelector(".sub-title");
const spanTitle = [...title.textContent].map((t) => `<span>${t}</span>`).join("");
const spanSubTitle = [...subTitle.textContent].map((t) => `<span>${t}</span>`).join("");
title.innerHTML = spanTitle;
subTitle.innerHTML = spanSubTitle;

let video = document.getElementById("video");
let canvas = document.body.appendChild(document.createElement("canvas"));
let ctx = canvas.getContext("2d");
let displaySize = { width: 640, height: 480 };

async function startStream() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );
    let selectedDeviceId = videoDevices[0].deviceId;

    // Optionally log available devices
    console.log("Available video devices:", videoDevices);

    // Use the first available video device (or specifically DroidCam if needed)
    for (let device of videoDevices) {
      if (
        device.label.includes("DroidCam Source 2") ||
        device.label.includes("DroidCam Source 3")
      ) {
        selectedDeviceId = device.deviceId;
        break;
      }
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: selectedDeviceId },
      audio: false,
    });

    video.srcObject = stream;
    video.play();

    console.log("----- START STREAM ------");
  } catch (error) {
    console.error("Error accessing the camera: ", error);
  }
}

Promise.all([
  faceapi.nets.ageGenderNet.loadFromUri("models"),
  faceapi.nets.tinyFaceDetector.loadFromUri("models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("models"),
  faceapi.nets.faceExpressionNet.loadFromUri("models"),
]).then(startStream);

// async function detect() {
//   const detections = await faceapi
//     .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//     .withFaceLandmarks()
//     .withFaceExpressions()
//     .withAgeAndGender();

//   ctx.clearRect(0, 0, displaySize.width, displaySize.height);
//   const resizedDetections = faceapi.resizeResults(detections, displaySize);

//   faceapi.draw.drawDetections(canvas, resizedDetections);
//   faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//   faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

//   resizedDetections.forEach((result) => {
//     const { age, gender, genderProbability } = result;
//     new faceapi.draw.DrawTextField(
//       [
//         `${Math.round(age)} Tahun`,
//         `${gender} ${Math.round(genderProbability * 100)}%`,
//       ],
//       result.detection.box.bottomRight
//     ).draw(canvas);
//   });
// }

video.addEventListener("play", () => {
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(detect, 500);
});

// let video = document.getElementById("video");
// let canvas = document.body.appendChild(document.createElement("canvas"));
// let ctx = canvas.getContext("2d");
// let displaySize;

// let width = 1280;
// let height = 720;

// const startSteam = () => {
//     console.log("----- START STEAM ------");
//     navigator.mediaDevices.getUserMedia({
//         video: {width, height},
//         audio : false
//     }).then((steam) => {video.srcObject = steam; video.play();});
// }

// console.log(faceapi.nets);

// console.log("----- START LOAD MODEL ------");
// Promise.all([
//     faceapi.nets.ageGenderNet.loadFromUri('models'),
//     faceapi.nets.ssdMobilenetv1.loadFromUri('models'),
//     faceapi.nets.tinyFaceDetector.loadFromUri('models'),
//     faceapi.nets.faceLandmark68Net.loadFromUri('models'),
//     faceapi.nets.faceRecognitionNet.loadFromUri('models'),
//     faceapi.nets.faceExpressionNet.loadFromUri('models')
// ]).then(startSteam);

// async function detect() {
//     const detections = await faceapi.detectAllFaces(video)
//                                 .withFaceLandmarks()
//                                 .withFaceExpressions()
//                                 .withAgeAndGender();
//     //console.log(detections);

//     ctx.clearRect(0,0, width, height);
//     const resizedDetections = faceapi.resizeResults(detections, displaySize)
//     faceapi.draw.drawDetections(canvas, resizedDetections);
//     faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//     faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

//     console.log(resizedDetections);
//     resizedDetections.forEach(result => {
//         const {age, gender, genderProbability} = result;
//         new faceapi.draw.DrawTextField ([
//             `${Math.round(age,0)} Tahun`,
//             `${gender} ${Math.round(genderProbability)}`
//         ],
//         result.detection.box.bottomRight
//         ).draw(canvas);
//     });
// }

// video.addEventListener('play', ()=> {
//     displaySize = {width, height};
//     faceapi.matchDimensions(canvas, displaySize);

//     setInterval(detect, 100);
// })
