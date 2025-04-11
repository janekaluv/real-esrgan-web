const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let tfliteModel;

async function loadModel() {
  const tflite = await tfliteWebAPI.loadTFLiteModel('Real-ESRGAN-x4plus.tflite');
  tfliteModel = tflite;
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

    // TODO: Add upscaling logic here
    alert("Image loaded, but we haven't added processing yet 😅");
  };
});

loadModel();
