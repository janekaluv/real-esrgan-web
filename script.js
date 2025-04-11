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
    // Draw the original image on canvas
    const inputTensor = tf.browser.fromPixels(img).toFloat().div(255).expandDims(0);

    const outputTensor = await tfliteModel.predict(inputTensor);

    const output = outputTensor.squeeze().mul(255).clipByValue(0, 255).cast('int32');

    await tf.browser.toPixels(output, canvas);

    inputTensor.dispose();
    outputTensor.dispose();

    console.log("Upscaling complete!");
  };
});

loadModel();
