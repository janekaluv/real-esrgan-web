const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let tfliteModel = null;

async function loadModel() {
  const tflite = await tfliteWebAPI.loadTFLiteModel('Real-ESRGAN-x4plus.tflite');
  tfliteModel = tflite;
  console.log("Model loaded!");
}

upload.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file || !tfliteModel) {
    alert("Please wait for model to load and then upload an image.");
    return;
  }

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = async () => {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    tempCtx.drawImage(img, 0, 0);

    const inputImageData = tempCtx.getImageData(0, 0, img.width, img.height);

    // Run inference
    const output = tfliteModel.predict(inputImageData);
    const outputImageData = new ImageData(output.data, output.width, output.height);

    // Show on main canvas
    canvas.width = output.width;
    canvas.height = output.height;
    ctx.putImageData(outputImageData, 0, 0);
  };
});

loadModel();
