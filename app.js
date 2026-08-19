const boton = document.getElementById("btn-comenzar") || document.querySelector("button");

boton.addEventListener("click", function () {

    document.body.innerHTML = `
        <div class="app-layout">

            <header class="topbar">
                <div class="brand">Santiago AI Trading</div>
                <div class="market-status">Mercado: Abierto</div>
            </header>

            <aside class="sidebar">
                <button class="menu-btn" id="btn-grafico">📈 Gráfico</button>
                <button class="menu-btn" id="btn-watchlist">⭐ Watchlist</button>
                <button class="menu-btn" id="btn-ia">🤖 IA</button>
                <button class="menu-btn" id="btn-noticias">📰 Noticias</button>
                <button class="menu-btn" id="btn-diario">📒 Diario</button>
            </aside>

            <main class="main-panel">

                <!-- GRÁFICO -->
                <section class="chart-panel" id="vista-grafico">

                    <div class="chart-header">
                        <h2>📈 Gráfico Principal</h2>

                        <div class="chart-tools">
                            <button id="btn-ema20" class="tool-btn">EMA 20</button>
                            <button id="btn-ema50" class="tool-btn">EMA 50</button>
                            <button id="btn-ema200" class="tool-btn">EMA 200</button>

                            
                            
                            <button class="tool-btn">📦 Volumen</button>
                            <button class="tool-btn">🟦 Soporte</button>
                            <button class="tool-btn">🔴 Resistencia</button>
                        </div>
                    </div>

                    <div id="tradingview_chart" style="height:500px;"></div>

                </section>


                <!-- SANTIAGO AI -->
                <section
                    class="ai-panel"
                    id="vista-ia"
                    style="display:none;"
                >

                    <h3>🤖 Santiago AI</h3>

                    <p>
                        <strong>Activo:</strong>
                        <span id="ai-symbol">AAPL</span>
                    </p>

                    <p>
                        <strong>Tendencia:</strong>
                        <span id="ai-trend">⚪ Analizando...</span>
                    </p>

                    <p>
                        <strong>EMA 20:</strong>
                        <span id="ai-ema20">⚪ Esperando datos</span>
                    </p>

                    <p>
                        <strong>EMA 50:</strong>
                        <span id="ai-ema50">⚪ Esperando datos</span>
                    </p>

                    <p>
                        <strong>EMA 200:</strong>
                        <span id="ai-ema200">⚪ Esperando datos</span>
                    </p>

                    <p>
                        <strong>Volumen:</strong>
                        <span id="ai-volume">⚪ Esperando datos</span>
                    </p>

                    <hr>

                    <p>
                        <strong>Señal:</strong>
                        <span id="ai-signal">⚪ Sin señal</span>
                    </p>
                    <p>
  <strong>⭐ Puntaje tecnico:</strong>
  <span id="ai-score">--/100</span>
</p>


<p>
  <strong>Razón:</strong>
  <span id="ai-razon">Esperando análisis</span>
</p>
                </section>


                <!-- NOTICIAS -->
                <section
                    class="news-panel"
                    id="vista-noticias"
                    style="display:none;"
                >
                    <h3>📰 Noticias</h3>
                    <p>Aquí aparecerán las noticias del mercado.</p>
                </section>


                <!-- DIARIO -->
                <section
                    class="news-panel"
                    id="vista-diario"
                    style="display:none;"
                >
                    <h3>📒 Diario de Trading</h3>
                    <p>Aquí podrás registrar tus operaciones.</p>
                </section>

            </main>


            <!-- WATCHLIST -->
            <aside class="right-panel" id="vista-watchlist">

                <h2>⭐ Watchlist</h2>

                <div class="ticker" data-symbol="AMEX:SPY">SPY</div>

                <div class="ticker" data-symbol="NASDAQ:QQQ">QQQ</div>

                <div class="ticker" data-symbol="NASDAQ:NVDA">NVDA</div>

                <div class="ticker" data-symbol="NASDAQ:AAPL">AAPL</div>

                <div class="ticker" data-symbol="NASDAQ:TSLA">TSLA</div>

            </aside>

        </div>
    `;


    // CARGAR GRÁFICO
    if (typeof iniciarTradingView === "function") {
        iniciarTradingView();
    }


    // CONECTAR WATCHLIST
    if (typeof conectarWatchlist === "function") {
        conectarWatchlist();
    }


    // BOTONES DEL MENÚ
    const btnGrafico = document.getElementById("btn-grafico");
    const btnWatchlist = document.getElementById("btn-watchlist");
    const btnIA = document.getElementById("btn-ia");
    const btnNoticias = document.getElementById("btn-noticias");
    const btnDiario = document.getElementById("btn-diario");
const selectorIdioma = document.createElement("select");
selectorIdioma.id = "idioma-noticias";

selectorIdioma.innerHTML = `
  <option value="es">🇪🇸 Español</option>
  <option value="en">🇺🇸 English</option>
`;

btnNoticias.parentElement.appendChild(selectorIdioma);
let idiomaNoticias = "es";

selectorIdioma.addEventListener("change", () => {
  idiomaNoticias = selectorIdioma.value;
  cargarNoticiasIA();

});




    // VISTAS
    const vistaGrafico = document.getElementById("vista-grafico");
    const vistaIA = document.getElementById("vista-ia");
    const vistaNoticias = document.getElementById("vista-noticias");
    const vistaDiario = document.getElementById("vista-diario");
    const vistaWatchlist = document.getElementById("vista-watchlist");


    function ocultarVistasPrincipales() {
        vistaGrafico.style.display = "none";

vistaIA.style.display = "none";
vistaNoticias.style.display = "none";
vistaDiario.style.display = "none";



        }

        async function cargarNoticiasIA() {
  try {
    vistaNoticias.innerHTML = `
      <h3>📰 Noticias</h3>
      <p>🤖 Analizando noticias del mercado...</p>
    `;

const response = await fetch(`/api/news-ai?lang=${selectorIdioma.value}`);


console.log("SELECTOR AHORA:", selectorIdioma.value);




    const data = await response.json();
    if (!response.ok) {
vistaNoticias.innerHTML = `<p>⚠️ ${data.error || "No se pudieron cargar las noticias."}</p>`;





return;
}







    const noticias = Array.isArray(data)
  ? data 
      : data.data || data.news || [];

    vistaNoticias.innerHTML = "<h3>📰 Noticias + Análisis IA</h3>";

    noticias.slice(0, 10).forEach((noticia) => {
      const tarjeta = document.createElement("div");

      tarjeta.innerHTML = `
        <hr>
        <h4>${noticia.title || "Noticia del mercado"}</h4>
        <p><strong>Activo afectado:</strong> ${noticia.activoAfectado || "MERCADO"}</p>
<p>
  <strong>Importancia:</strong>
  <span style="color: ${
    noticia.importancia === "ALTA"
      ? "#ef4444"
      : noticia.importancia === "MEDIA"
      ? "#eab308"
      : "#22c55e"
  };">
    ${noticia.importancia || "MEDIA"}
  </span>
</p>


<p>
  <strong>Confianza IA:</strong>
  <span style="color: ${
    (noticia.confianza ?? 50) >= 70
      ? "#22c55e"
      : (noticia.confianza ?? 50) >= 50
      ? "#eab308"
      : "#ef4444"
  };">
    ${noticia.confianza ?? 50}% - ${
      (noticia.confianza ?? 50) >= 70
        ? "ALTA"
        : (noticia.confianza ?? 50) >= 50
        ? "MEDIA"
        : "BAJA"
    }
  </span>
</p>


<p><strong style="color: #22c55e;">Palabras alcistas:</strong> ${(noticia.palabrasAlcistasEncontradas || []).join(", ") || "Ninguna"}</p>
<p><strong style="color: #ef4444;">Palabras bajistas:</strong> ${(noticia.palabrasBajistasEncontradas || []).join(", ") || "Ninguna"}</p>





        <p>
  <strong>Impacto:</strong>
  <span style="color: ${
    noticia.sentimiento === "ALCISTA"
      ? "#22c55e"
      : noticia.sentimiento === "BAJISTA"
      ? "#ef4444"
      : "#eab308"
  };">
    ${noticia.sentimiento || "NEUTRAL"}
  </span>
</p>


    <p>${noticia.explicacion || "Sin explicación disponible."}</p>




      `;

      vistaNoticias.appendChild(tarjeta);
    });

  } catch (error) {
    console.error(error);

    vistaNoticias.innerHTML = `
      <h3>📰 Noticias</h3>
      <p>❌ No se pudieron cargar las noticias.</p>
    `;
  }
}




        vistaGrafico.style.display = "none";
        vistaIA.style.display = "none";
        vistaNoticias.style.display = "none";
        vistaDiario.style.display = "none";
    


    // GRÁFICO
    btnGrafico.addEventListener("click", function () {

        ocultarVistasPrincipales();

        vistaGrafico.style.display = "block";

    });


    // IA
    

    btnIA.addEventListener("click", async function () {

    ocultarVistasPrincipales();

    vistaIA.style.display = "block";

    const simbolo =
        document.getElementById("ai-symbol").textContent;

    document.getElementById("ai-trend").textContent =
        "⚪ Analizando...";

    document.getElementById("ai-ema20").textContent =
        "⚪ Esperando datos";

    document.getElementById("ai-ema50").textContent =
        "⚪ Esperando datos";

    document.getElementById("ai-ema200").textContent =
        "⚪ Esperando datos";

    document.getElementById("ai-volume").textContent =
        "⚪ Esperando datos";

    document.getElementById("ai-signal").textContent =

        "⚪ Esperando análisis";
        
  


document.getElementById("ai-razon").textContent =
  "Analizando datos del mercado...";


    try {

        const response = await fetch(
            `http://localhost:3001/api/analysis/${simbolo}`
        );

        const data = await response.json();
        console.log("SCORE RECIBIDO:", data.score);

        const score = data.score ?? 0;

let fuerza = "Baja";

if (score >= 90) {
  fuerza = "Muy fuerte";
} else if (score >= 80) {
  fuerza = "Fuerte";
} else if (score >= 70) {
  fuerza = "Moderada";
}

document.getElementById("ai-score").textContent =
  `${score}/100 — ${fuerza}`;

  

        document.getElementById("ai-razon").textContent =
  data.razon || "Análisis técnico completado.";



        document.getElementById("ai-trend").textContent =
            data.tendencia === "Alcista"
                ? "🟢 Alcista"
                : data.tendencia === "Bajista"
                ? "🔴 Bajista"
                : "🟡 Neutral";

        document.getElementById("ai-ema20").textContent =
            ` ${data.ema20}`;

        document.getElementById("ai-ema50").textContent =
  `${data.ema50}`;

            


        document.getElementById("ai-ema200").textContent =
            ` ${data.ema200}`;

        document.getElementById("ai-volume").textContent =
            ` ${data.volumenActual}`;

        document.getElementById("ai-signal").textContent =
            data.senal === "Posible Compra"
                ? "✅ Posible Compra"
                : data.senal === "Posible Venta"
                ? "🔻 Posible Venta"
                : "⏳ Esperar";

const puntaje = Number(data.score ?? 50);


console.log("Puntaje de señal:", puntaje);





console.log("Puntaje de señal:", puntaje);

document.getElementById("ai-score").textContent = `${puntaje}/100`;
    } catch (error) {

        console.error(error);

        document.getElementById("ai-signal").textContent =
            "❌ Error obteniendo análisis";

    }

});




    




    // NOTICIAS
    btnNoticias.addEventListener("click", function () {

        ocultarVistasPrincipales();

        vistaNoticias.style.display = "block";
cargarNoticiasIA();

    });


    // DIARIO
    btnDiario.addEventListener("click", function () {

        ocultarVistasPrincipales();

        vistaDiario.style.display = "block";

    });


    // WATCHLIST
   btnWatchlist.addEventListener("click", function () {
    ocultarVistasPrincipales();
    vistaWatchlist.style.display = "block";
});

 

        
            
                
            
        
        

    



});

// Actualizar IA automáticamente al cambiar de activo
document.addEventListener("click", function (event) {
  const ticker = event.target.closest(".ticker");

  if (!ticker) return;

  const simboloCompleto = ticker.getAttribute("data-symbol");
  if (!simboloCompleto) return;

  const simbolo = simboloCompleto.includes(":")
    ? simboloCompleto.split(":").pop()
    : simboloCompleto;

  const aiSymbol = document.getElementById("ai-symbol");

  if (aiSymbol) {
    aiSymbol.textContent = simbolo;
  }

  // Esperar a que termine el cambio de activo y volver a analizar
  setTimeout(() => {
    const botonIA = document.getElementById("btn-ia");

    if (botonIA) {
      botonIA.click();
    }
  }, 100);
});

