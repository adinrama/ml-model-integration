// const tf = require("@tensorflow/tfjs-node");
// const InputError = require("../exceptions/InputError");

// async function predictClassification(model, image) {
//   try {
//     const tensor = tf.node
//       .decodeJpeg(image)
//       .resizeNearestNeighbor([224, 224])
//       .expandDims()
//       .toFloat();

//     const prediction = model.predict(tensor);
//     const probabilities = await prediction.data();
//     const classes = ["Cancer", "Non-cancer"];

//     const predictedClassIndex = probabilities[0] > 0.5 ? 0 : 1;
//     const label = classes[predictedClassIndex];

//     return { label };
//   } catch (error) {
//     throw new InputError(`Terjadi kesalahan input: ${error.message}`);
//   }
// }

// module.exports = predictClassification;

const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

const predictClassification = async (
  model,
  gender,
  age,
  weight,
  height,
  headCircumference
) => {
  try {
    // Validasi apakah semua input adalah angka
    if (
      typeof gender !== "number" ||
      typeof age !== "number" ||
      typeof weight !== "number" ||
      typeof height !== "number" ||
      typeof headCircumference !== "number"
    ) {
      throw new InputError("Semua input harus berupa angka.");
    }

    // Menyiapkan input tensor dari data input
    const inputTensor = tf.tensor2d([
      [gender, age, weight, height, headCircumference],
    ]);

    // Melakukan prediksi menggunakan model
    const prediction = model.predict(inputTensor);
    const predictionData = await prediction.data();

    // Mengonversi hasil prediksi ke kelas tertentu
    const classes = ["Kurus", "Normal", "Obesitas"];
    const predictedClassIndex = predictionData.indexOf(
      Math.max(...predictionData)
    );
    const label = classes[predictedClassIndex];

    return { label };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
};

module.exports = predictClassification;
