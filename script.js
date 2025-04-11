const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let tfliteModel;

async function loadModel() {
  tfliteModel = await tfliteWebAPI.loadTFLiteModel('Real-ESRGAN-x4plus.tflite');
  console.log("Model loaded!");
}

upload.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file || !tfliteModel) {
    alert("Please upload an image and make sure model is loaded.");
    return;
  }

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = async () => {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  if (!tfliteModel) {
    alert("Model not loaded yet!");
    return;
  }

  // Convert image to tensor
  const inputTensor = tf.browser.fromPixels(img).toFloat().div(255.0).expandDims(0);
  console.log("Image shape:", inputTensor.shape);

  try {
    const outputTensor = tfliteModel.predict(inputTensor);
    console.log("Prediction done:", outputTensor);
  } catch (err) {
    console.error("Model prediction failed:", err);
    alert("Model prediction failed. Likely due to unsupported ops.");
  }
};
});

loadModel();
