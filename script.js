const upload = document.getElementById("upload");
const processBtn = document.getElementById("process");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let tfliteModel;
let imgElement;

async function loadModel() {
  const tflite = await tfliteWebAPI.loadTFLiteModel('Real-ESRGAN-x4plus.tflite');
  tfliteModel = tflite;
  console.log("Model loaded!");
}

upload.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  imgElement = new Image();
  imgElement.src = URL.createObjectURL(file);

  imgElement.onload = () => {
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    ctx.drawImage(imgElement, 0, 0);
  };
});

processBtn.addEventListener("click", async () => {
  if (!imgElement || !tfliteModel) {
    alert("Please upload an image and make sure model is loaded.");
    return;
  }

  // Draw image to canvas and get its data
  ctx.drawImage(imgElement, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const input = new ImageData(imageData.data, canvas.width, canvas.height);

  // Run inference
  const output = await tfliteModel.infer(input);

  // Resize canvas and show result
  canvas.width = output.width;
  canvas.height = output.height;
  ctx.putImageData(output, 0, 0);
});

