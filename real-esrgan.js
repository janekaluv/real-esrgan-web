async function upscaleImage() {
  const status = document.getElementById("status");
  status.innerText = "Loading model...";

  const model = await tflite.loadTFLiteModel('Real-ESRGAN-x4plus.tflite');
  status.innerText = "Upscaling image...";

  const input = tf.browser.fromPixels(document.getElementById("input-image"))
    .toFloat()
    .div(255.0)
    .expandDims();

  const output = model.predict(input);
  const squeezed = output.squeeze();

  const canvas = document.getElementById("output-canvas");
  await tf.browser.toPixels(squeezed, canvas);

  status.innerText = "Upscaling complete!";
}
