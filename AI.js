function actualizarAnalisisIA(simbolo) {

    document.getElementById("ai-symbol").textContent = simbolo;

    document.getElementById("ai-trend").textContent =
        "🟢 Analizando...";

    document.getElementById("ai-ema20").textContent =
        "⚪ Esperando datos";

    document.getElementById("ai-ema50").textContent =
        "⚪ Esperando datos";

    document.getElementById("ai-ema200").textContent =
        "⚪ Esperando datos";

    document.getElementById("ai-volume").textContent =
        "⚪ Esperando datos";

    document.getElementById("ai-signal").textContent =
        "⚪ Sin señal";
}

