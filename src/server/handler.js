const getHistories = require("../services/getHistories");
const predictClassification = require("../services/inferenceService");
const storeData = require("../services/storeData");

async function postPredictHandler(request, h) {
  const { gender, age, weight, height, headCircumference } = request.payload;
  const { model } = request.server.app;

  const { label } = await predictClassification(
    model,
    gender,
    age,
    weight,
    height,
    headCircumference
  );

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  // Menyesuaikan pesan saran berdasarkan label prediksi
  let suggestion = "";
  switch (label) {
    case "Kurus":
      suggestion = "Pertimbangkan konsultasi dengan ahli gizi.";
      break;
    case "Normal":
      suggestion = "Lanjutkan pola makan dan gaya hidup sehat.";
      break;
    case "Obesitas":
      suggestion = "Segera hubungi dokter untuk penanganan lebih lanjut.";
      break;
  }

  const data = {
    id: id,
    result: label,
    suggestion: suggestion,
    createdAt: createdAt,
  };

  await storeData(id, data);

  const response = h.response({
    status: "success",
    message: "Model is predicted successfully",
    data,
  });
  response.code(201);
  return response;
}

async function getHistoriesHandler(_request, h) {
  const histories = await getHistories();
  const response = h.response({
    status: "success",
    data: histories,
  });
  return response;
}

module.exports = { postPredictHandler, getHistoriesHandler };
