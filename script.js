const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let tfliteModel;

async function loadModel() {
  tfliteModel = await tflite.loadTFLiteModel("Real-ESRGAN-x4plus.tflite");
  console.log("Model loaded!");
}

upload.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = async () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Convert image to tensor
    const input = tf.browser.fromPixels(canvas)
      .toFloat()
      .div(255.0)
      .expandDims();

    // Run the model
    const output = tfliteModel.predict(input);
    const result = output.squeeze();

    // Display result
    await tf.browser.toPixels(result, canvas);
    alert("Upscaling complete!");
  };
});

loadModel();
