const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let tfliteModel;
let imageData;

async function loadModel() {
  tfliteModel = await tflite.loadTFLiteModel('Real-ESRGAN-x4plus.tflite');
  console.log("Model loaded!");
}

upload.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log("Image loaded!");
  };
});

async function upscaleImage() {
  if (!tfliteModel || !imageData) {
    alert("Please upload an image and make sure model is loaded.");
    return;
  }

  const input = tf.browser.fromPixels(imageData).toFloat().div(255.0).expandDims(0);
  const output = tfliteModel.predict(input);
  const squeezed = output.squeeze().mul(255).cast("int32");

  await tf.browser.toPixels(squeezed, canvas);
  console.log("Upscaling complete!");
}

loadModel().then(() => {
  // Automatically run upscale after image upload
  upload.addEventListener("change", () => {
    setTimeout(() => upscaleImage(), 100); // Slight delay to ensure image is ready
  });
});
