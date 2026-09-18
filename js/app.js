"use strict";

const temperatureInput = document.querySelector("#temperature");
const fromUnit = document.querySelector("#from-unit");
const toUnit = document.querySelector("#to-unit");
const swapButton = document.querySelector("#swap-button");
const clearButton = document.querySelector("#clear-button");
const resultOutput = document.querySelector("#result");
const errorMessage = document.querySelector("#error-message");
const resultCard = document.querySelector("#result-card");
const moodIcon = document.querySelector("#mood-icon");
const scaleMarker = document.querySelector("#scale-marker");

// Convierte cualquier unidad de origen a Celsius como unidad intermedia.
function toCelsius(value, unit) {
  if (unit === "F") return (value - 32) * 5 / 9;
  if (unit === "K") return value - 273.15;
  return value;
}

// Convierte desde Celsius hacia la unidad de destino.
function fromCelsius(value, unit) {
  if (unit === "F") return value * 9 / 5 + 32;
  if (unit === "K") return value + 273.15;
  return value;
}

function formatNumber(value) {
  return new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 }).format(value);
}

function resetResult() {
  resultOutput.textContent = "—";
  errorMessage.textContent = "";
  resultCard.className = "result-card neutral";
  moodIcon.textContent = "🌡️";
  scaleMarker.hidden = true;
}

function showError(message) {
  errorMessage.textContent = message;
  resultOutput.textContent = "—";
  resultCard.className = "result-card neutral";
  moodIcon.textContent = "⚠️";
  scaleMarker.hidden = true;
}

function updateVisualIndicator(celsius) {
  const mood = celsius < 15 ? "cold" : celsius >= 28 ? "hot" : "neutral";
  resultCard.className = `result-card ${mood}`;
  moodIcon.textContent = mood === "cold" ? "❄️" : mood === "hot" ? "🔥" : "🌡️";
  const percentage = Math.max(0, Math.min(100, ((celsius + 20) / 80) * 100));
  scaleMarker.style.left = `${percentage}%`;
  scaleMarker.hidden = false;
}

function animateResult() {
  resultOutput.classList.remove("animate");
  void resultOutput.offsetWidth;
  resultOutput.classList.add("animate");
}

function convertTemperature() {
  const rawValue = temperatureInput.value.trim();
  if (rawValue === "") {
    resetResult();
    return;
  }

  const value = Number(rawValue);
  if (!Number.isFinite(value)) {
    showError("Introduce un valor numérico válido.");
    return;
  }
  if (fromUnit.value === "K" && value < 0) {
    showError("Kelvin no admite valores inferiores a 0 K.");
    return;
  }

  const celsius = toCelsius(value, fromUnit.value);
  const converted = fromCelsius(celsius, toUnit.value);
  if (toUnit.value === "K" && converted < 0) {
    showError("La temperatura está por debajo del cero absoluto.");
    return;
  }

  const symbol = toUnit.value === "K" ? "K" : `°${toUnit.value}`;
  errorMessage.textContent = "";
  resultOutput.textContent = `${formatNumber(converted)} ${symbol}`;
  updateVisualIndicator(celsius);
  animateResult();
}

function swapUnits() {
  const currentFrom = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = currentFrom;
  convertTemperature();
  temperatureInput.focus();
}

function clearConverter() {
  temperatureInput.value = "";
  fromUnit.value = "C";
  toUnit.value = "F";
  resetResult();
  temperatureInput.focus();
}

[temperatureInput, fromUnit, toUnit].forEach((control) => {
  control.addEventListener("input", convertTemperature);
  control.addEventListener("change", convertTemperature);
});
swapButton.addEventListener("click", swapUnits);
clearButton.addEventListener("click", clearConverter);

resetResult();
