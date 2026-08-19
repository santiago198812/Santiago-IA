function conectarWatchlist() {

    const tickers = document.querySelectorAll(".ticker");

    tickers.forEach(function (ticker) {

        ticker.addEventListener("click", function () {

            simboloActual = ticker.getAttribute("data-symbol");

            crearGrafico();
            if (typeof actualizarAnalisisIA === "function") {
    actualizarAnalisisIA(simboloActual.split(":")[1]);
}
        
async function actualizarAnalisisIA(simbolo) {
    document.getElementById("ai-symbol").textContent = simbolo;

    document.getElementById("ai-trend").textContent = "⚪ Analizando...";
    document.getElementById("ai-ema20").textContent = "⚪ Esperando datos";
    document.getElementById("ai-ema50").textContent = "⚪ Esperando datos";
    document.getElementById("ai-ema200").textContent = "⚪ Esperando datos";
    document.getElementById("ai-volume").textContent = "⚪ Esperando datos";
    document.getElementById("ai-signal").textContent = "⚪ Analizando...";

    try {
        const response = await fetch(
            `http://localhost:3001/api/analysis/${simbolo}`
        );

        const data = await response.json();

        document.getElementById("ai-trend").textContent =
            data.tendencia === "Alcista"
                ? "🟢 Alcista"
                : data.tendencia === "Bajista"
                ? "🔴 Bajista"
                : "🟡 Neutral";

        document.getElementById("ai-ema20").textContent =
            ` ${data.ema20 ?? "N/D"}`;

        document.getElementById("ai-ema50").textContent =
            ` ${data.ema50 ?? "N/D"}`;

        document.getElementById("ai-ema200").textContent =
            ` ${data.ema200 ?? "N/D"}`;

        document.getElementById("ai-volume").textContent =
            `${data.estadoVolumen || "N/D"} | ${data.volumenActual ?? "N/D"}`;

        document.getElementById("ai-signal").textContent =
            data.señal === "Posible Compra"
                ? "✅ Posible Compra"
                : data.señal === "Posible Venta"
                ? "🔻 Posible Venta"
                : "⏳ Esperar";

    } catch (error) {
        console.error("Error actualizando análisis IA:", error);
        document.getElementById("ai-signal").textContent =
            "❌ Error obteniendo análisis";
    }
}




    

    
    

    

        

    

        

        

        

        

        
    





            const nombreActivo = document.getElementById("ai-symbol");

            if (nombreActivo) {
                nombreActivo.textContent =
                    simboloActual.split(":")[1];
            }

        });

    });

}

