const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let tfliteModel;

async function loadModel() {
  tfliteModel = await tfliteWebAPI.loadTFLiteModel("Real-ESRGAN-x4plus.tflite");
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
    // Draw original image
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Convert image to tensor
    const imageTensor = tf.browser.fromPixels(canvas)
      .toFloat()
      .div(255.0)
      .expandDims(0);

    // Run inference
    const output = tfliteModel.predict(imageTensor);

    // Post-process output
    const upscaled = output.squeeze().mul(255).clipByValue(0, 255).cast("int32");
    await tf.browser.toPixels(upscaled, canvas);

    imageTensor.dispose();
    output.dispose();
    upscaled.dispose();
  };
});

loadModel();
