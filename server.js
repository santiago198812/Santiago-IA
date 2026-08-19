require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

function calcularEMA(precios, periodo) {
    if (precios.length < periodo) return null;

    const multiplicador = 2 / (periodo + 1);

    let ema =
        precios
            .slice(0, periodo)
            .reduce((suma, precio) => suma + precio, 0) / periodo;

    for (let i = periodo; i < precios.length; i++) {
        ema = (precios[i] - ema) * multiplicador + ema;
    }

    return ema;
}


// PRECIO ACTUAL
app.get("/api/price/:symbol", async (req, res) => {
    try {
        const symbol = req.params.symbol.toUpperCase();

        const url =
            `https://api.twelvedata.com/price?symbol=${encodeURIComponent(symbol)}` +
            `&apikey=${process.env.TWELVE_DATA_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        res.json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error obteniendo precio"
        });
    }
});


// ANÁLISIS TÉCNICO REAL

   app.get("/api/news-ai", async (req, res) => {
    try {
        const symbol = (req.query.symbol || "AAPL").toUpperCase();
        const lang = req.query.lang === "en" ? "en" : "es";

        if (!process.env.MARKETAUX_API_KEY) {
            return res.status(500).json({
                error: "Falta MARKETAUX_API_KEY en el archivo .env"
            });
        }

        const url =
            `https://api.marketaux.com/v1/news/all` +
            `?symbols=${encodeURIComponent(symbol)}` +
            `&filter_entities=true` +
            `&language=en` +
            `&limit=3` +
            `&api_token=${process.env.MARKETAUX_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        console.log("MarketAux status:", response.status);
        console.log("MarketAux meta:", data.meta);

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.error?.message || "Error obteniendo noticias"
            });
        }

        const noticias = data.data || [];

        const noticiasConAnalisis = noticias.map((noticia) => {
            console.log("NOTICIA COMPLETA:", noticia);


            const titulo = (noticia.title || "").toLowerCase();
const descripcion = (noticia.description || "").toLowerCase();
const textoNoticia = `${titulo} ${descripcion}`;

            let sentimiento = "NEUTRAL";

            let explicacion =
                "La noticia no muestra una señal claramente alcista ni bajista.";

            let explicacionEn =
                "The news does not show a clearly bullish or bearish signal.";
let activoAfectado = "MERCADO";

if (textoNoticia.includes("apple") || textoNoticia.includes("aapl")) {


  activoAfectado = "AAPL";
} else if (textoNoticia.includes("nvidia") || textoNoticia.includes("nvda")) {



  activoAfectado = "NVDA";
} else if (textoNoticia.includes("tesla") || textoNoticia.includes("tsla")) {

  activoAfectado = "TSLA";
} else if (textoNoticia.includes("amazon") || textoNoticia.includes("amzn")) {

  activoAfectado = "AMZN";
} else if (textoNoticia.includes("microsoft") || textoNoticia.includes("msft")) {

  activoAfectado = "MSFT";
} else if (textoNoticia.includes("meta") || textoNoticia.includes("facebook")) {


  activoAfectado = "META";
} else if (textoNoticia.includes("amd")) {


  activoAfectado = "AMD";
} else if (textoNoticia.includes("qqq") || textoNoticia.includes("nasdaq")) {

  activoAfectado = "QQQ";
} else if (textoNoticia.includes("spy") || textoNoticia.includes("s&p")) {

  activoAfectado = "SPY";
}


            const palabrasAlcistas = [
                "rise",
                "gain",
                "growth",
                "surge",
                "beat",
                "record",
                "strong",
                "upgrade",
                "profit",
                "buy",
                "price target",
                "bullish",
                "outperform",
                "raised price target",
                "recommend",
                "positive",
                "rally",
                "rally",
"higher",
"boost",
"strong demand",
"revenue growth",
"earnings beat",
"beats estimates",
"above expectations",
"record high",
"raises guidance",
"raised guidance",
"upside",








                
                
            ];

            const palabrasBajistas = [
                "fall",
                "drop",
                "decline",
                "loss",
                "miss",
                "weak",
                "downgrade",
                "lawsuit",
                "cut",
                "bearish"
            ];

            const palabrasAlcistasEncontradas = palabrasAlcistas.filter((palabra) =>
  textoNoticia.includes(palabra)

);

const palabrasBajistasEncontradas = palabrasBajistas.filter((palabra) =>
  textoNoticia.includes(palabra)

);

const coincidenciasAlcistas = palabrasAlcistasEncontradas.length;
const coincidenciasBajistas = palabrasBajistasEncontradas.length;

if (coincidenciasAlcistas > coincidenciasBajistas) {
  sentimiento = "ALCISTA";

  const motivos = palabrasAlcistasEncontradas.join(", ");

  explicacion =
  `La noticia se considera alcista porque detecta estos elementos positivos: ${motivos}. Estos factores pueden aumentar el optimismo de los inversionistas sobre ${activoAfectado}.`;

    
    

  explicacionEn =
  `The news is considered bullish because it detects these positive elements: ${motivos}. These factors may increase investor optimism about ${activoAfectado}.`;


} else if (coincidenciasBajistas > coincidenciasAlcistas) {
  sentimiento = "BAJISTA";

  const motivos = palabrasBajistasEncontradas.join(", ");

  explicacion =
  `La noticia se considera bajista porque detecta estos elementos negativos: ${motivos}. Estos factores pueden generar preocupación entre los inversionistas y aumentar la presión vendedora sobre ${activoAfectado}.`;


  explicacionEn =
  `The news is considered bearish because it detects these negative elements: ${motivos}. These factors may increase investor concern and selling pressure on ${activoAfectado}.`;

}


            
            else {
  sentimiento = "NEUTRAL";

  const motivosAlcistas = palabrasAlcistasEncontradas.join(", ");
  const motivosBajistas = palabrasBajistasEncontradas.join(", ");

  if (coincidenciasAlcistas > 0 && coincidenciasBajistas > 0) {
    explicacion =
  `La noticia muestra señales mixtas. Se detectaron elementos positivos: ${motivosAlcistas}; y elementos negativos: ${motivosBajistas}. Por eso no hay una dirección clara para ${activoAfectado}.`;


    explicacionEn =
  `The news shows mixed signals. Positive elements detected: ${motivosAlcistas}; and negative elements: ${motivosBajistas}. Therefore, there is no clear direction for ${activoAfectado}.`;


  } else {
  const contextoIAAlcista =
    textoNoticia.includes("ai") &&
    (
      textoNoticia.includes("demand") ||
      textoNoticia.includes("needs") ||
      textoNoticia.includes("investment") ||
      textoNoticia.includes("power for ai") ||
      textoNoticia.includes("data center")
    );

  if (contextoIAAlcista) {
    sentimiento = "ALCISTA";

    explicacion =
      "La noticia muestra una posible señal alcista por el crecimiento de la demanda e infraestructura relacionada con inteligencia artificial. Esto puede favorecer a empresas vinculadas al desarrollo de IA.";

    explicacionEn =
      "The news shows a possible bullish signal due to growing demand and infrastructure related to artificial intelligence. This may benefit companies involved in AI development.";
  } else {
    sentimiento = "NEUTRAL";

    explicacion =
      "La noticia no contiene suficientes elementos alcistas o bajistas para definir una dirección clara.";

    explicacionEn =
      "The news does not contain enough bullish or bearish elements to define a clear direction.";
  }
}
}


      


            let confianza = 50;

if (sentimiento === "ALCISTA") {
  confianza = Math.min(
    95,
    60 + coincidenciasAlcistas * 10
  );

} else if (sentimiento === "BAJISTA") {
  confianza = Math.min(
    95,
    60 + coincidenciasBajistas * 10
  );

} else {
  if (coincidenciasAlcistas > 0 && coincidenciasBajistas > 0) {
    const diferencia = Math.abs(
      coincidenciasAlcistas - coincidenciasBajistas
    );

    confianza = Math.max(
      40,
      55 - diferencia * 5
    );

  } else {
    confianza = 40;
  }
}


            
            
                    
                    
            
            
            
            
            
        
            
let importancia = "MEDIA";

if (confianza >= 80) {
  importancia = "ALTA";
} else if (confianza < 50) {
  importancia = "BAJA";
}
            return {
                ...noticia,
                sentimiento,
                activoAfectado,

                confianza,
                palabrasAlcistasEncontradas,
palabrasBajistasEncontradas,


                importancia,

             explicacion,
                explicacionEn
            };
        });

        return res.json({
            data: noticiasConAnalisis
        });

    } catch (error) {
        console.error("Error en /api/news-ai:", error);

        return res.status(500).json({
            error: "No se pudieron obtener las noticias"
        });
    }
});

// ANALISIS TECNICO IA
app.get("/api/analysis/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const url =
      `https://api.twelvedata.com/time_series` +
      `?symbol=${encodeURIComponent(symbol)}` +
      `&interval=15min` +
      `&outputsize=220` +
      `&apikey=${process.env.TWELVE_DATA_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !data.values) {
      console.log("Error Twelve Data analysis:", data);

      return res.status(500).json({
        error: data.message || "No se pudieron obtener datos del mercado",
      });
    }

    const velas = [...data.values].reverse();

    const precios = velas
      .map((vela) => Number(vela.close))
      .filter((precio) => Number.isFinite(precio));

    if (precios.length < 200) {
      return res.status(500).json({
        error: "No hay suficientes datos para calcular EMA 200",
      });
    }

    const ema20 = calcularEMA(precios, 20);
    const ema50 = calcularEMA(precios, 50);
    const ema200 = calcularEMA(precios, 200);

    const ultimoPrecio = precios[precios.length - 1];

    const ultimoVolumen = Number(
      velas[velas.length - 1]?.volume || 0
    );

    const volumenes = velas
      .slice(-20)
      .map((vela) => Number(vela.volume || 0))
      .filter((volumen) => Number.isFinite(volumen));

    const promedioVolumen =
      volumenes.length > 0
        ? volumenes.reduce((suma, volumen) => suma + volumen, 0) /
          volumenes.length
        : 0;

        // VWAP reciente
let sumaPrecioVolumen = 0;
let sumaVolumenVWAP = 0;

velas.slice(-20).forEach((vela) => {
  const high = Number(vela.high || 0);
  const low = Number(vela.low || 0);
  const close = Number(vela.close || 0);
  const volumen = Number(vela.volume || 0);

  const precioTipico = (high + low + close) / 3;

  sumaPrecioVolumen += precioTipico * volumen;
  sumaVolumenVWAP += volumen;
});

const vwap =
  sumaVolumenVWAP > 0
    ? sumaPrecioVolumen / sumaVolumenVWAP
    : ultimoPrecio;


// RSI 14
let ganancias = 0;
let perdidas = 0;

const cierresRSI = velas
  .slice(-15)
  .map((vela) => Number(vela.close || 0));

for (let i = 1; i < cierresRSI.length; i++) {
  const cambio = cierresRSI[i] - cierresRSI[i - 1];

  if (cambio > 0) {
    ganancias += cambio;
  } else {
    perdidas += Math.abs(cambio);
  }
}

const promedioGanancia = ganancias / 14;
const promedioPerdida = perdidas / 14;

let rsi14 = 50;

if (promedioPerdida === 0 && promedioGanancia > 0) {
  rsi14 = 100;
} else if (promedioPerdida > 0) {
  const rs = promedioGanancia / promedioPerdida;
  rsi14 = 100 - 100 / (1 + rs);
}

// ATR 14
const velasATR = velas.slice(-15);
let sumaTR = 0;

for (let i = 1; i < velasATR.length; i++) {
  const high = Number(velasATR[i].high || 0);
  const low = Number(velasATR[i].low || 0);
  const cierreAnterior = Number(velasATR[i - 1].close || 0);

  const rango1 = high - low;
  const rango2 = Math.abs(high - cierreAnterior);
  const rango3 = Math.abs(low - cierreAnterior);

  const trueRange = Math.max(rango1, rango2, rango3);

  sumaTR += trueRange;
}

const atr14 = sumaTR / 14;



    let tendencia = "Neutral";

if (
  ultimoPrecio > ema20 &&
  ema20 > ema50 &&
  ema50 > ema200
) {
  tendencia = "Alcista";
} else if (
  ultimoPrecio < ema20 &&
  ema20 < ema50 &&
  ema50 < ema200
) {
  tendencia = "Bajista";
}

let senal = "Esperar";
let razon = "";
let score = 50;

const volumenFuerte =
  promedioVolumen > 0 && ultimoVolumen >= promedioVolumen;

const relacionVolumen =
  promedioVolumen > 0
    ? ((ultimoVolumen / promedioVolumen) * 100).toFixed(0)
    : "N/D";
    // PUNTAJE DE FUERZA DE LA SEÑAL
if (tendencia === "Alcista") {
  score += 20;
} else if (tendencia === "Bajista") {
  score += 20;
}

if (volumenFuerte) {
  score += 15;
}

if (ultimoPrecio > ema20) {
  score += 5;
}

if (
  tendencia === "Alcista" &&
  ultimoPrecio > ema20 &&
  ema20 > ema50 &&
  ema50 > ema200
) {
  score += 10;
}

if (
  tendencia === "Bajista" &&
  ultimoPrecio < ema20 &&
  ema20 < ema50 &&
  ema50 < ema200
) {
  score += 10;
}

if (!volumenFuerte && score > 85) {
  score = 85;
}
score = Math.min(100, Math.max(0, score));





if (tendencia === "Alcista") {
  if (volumenFuerte) {
    senal = "Posible Compra";

    razon =
      `Tendencia alcista confirmada. ` +
      `El precio actual (${ultimoPrecio.toFixed(2)}) está por encima de la EMA 20 (${ema20.toFixed(2)}). ` +
      `La EMA 20 está por encima de la EMA 50 (${ema50.toFixed(2)}), y la EMA 50 está por encima de la EMA 200 (${ema200.toFixed(2)}). ` +
      `Esto muestra que el precio y las medias móviles están alineados al alza. ` +
      `La EMA 200 confirma que la tendencia principal también favorece el movimiento alcista. ` +
      `El volumen actual está aproximadamente en ${relacionVolumen}% del volumen promedio, mostrando participación suficiente para apoyar el movimiento. ` +
      `Por estas razones, Santiago IA detecta una Posible Compra.`;
  } else {
    senal = "Esperar";

    razon =
      `La estructura técnica es alcista: el precio está por encima de la EMA 20, la EMA 20 está sobre la EMA 50 y la EMA 50 está sobre la EMA 200. ` +
      `Sin embargo, el volumen actual está aproximadamente en ${relacionVolumen}% del volumen promedio y todavía no confirma suficiente participación. ` +
      `La tendencia es Alcista, pero Santiago IA recomienda Esperar una confirmación de volumen antes de considerar una Posible Compra.`;
  }
} else if (tendencia === "Bajista") {
  if (volumenFuerte) {
    senal = "Posible Venta";

    razon =
      `Tendencia bajista confirmada. ` +
      `El precio actual (${ultimoPrecio.toFixed(2)}) está por debajo de la EMA 20 (${ema20.toFixed(2)}). ` +
      `La EMA 20 está por debajo de la EMA 50 (${ema50.toFixed(2)}), y la EMA 50 está por debajo de la EMA 200 (${ema200.toFixed(2)}). ` +
      `Esto muestra que el precio y las medias móviles están alineados a la baja. ` +
      `La EMA 200 confirma que la tendencia principal también favorece el movimiento bajista. ` +
      `El volumen actual está aproximadamente en ${relacionVolumen}% del volumen promedio, mostrando participación suficiente para apoyar el movimiento. ` +
      `Por estas razones, Santiago IA detecta una Posible Venta.`;
  } else {
    senal = "Esperar";

    razon =
      `La estructura técnica es bajista: el precio está por debajo de la EMA 20, la EMA 20 está debajo de la EMA 50 y la EMA 50 está debajo de la EMA 200. ` +
      `Sin embargo, el volumen actual está aproximadamente en ${relacionVolumen}% del volumen promedio y todavía no confirma suficiente participación. ` +
      `La tendencia es Bajista, pero Santiago IA recomienda Esperar una confirmación de volumen antes de considerar una Posible Venta.`;
  }
} else {
  senal = "Esperar";

  const condicionesAlcistas = [];
  const condicionesBajistas = [];

  if (ultimoPrecio <= ema20) {
    condicionesAlcistas.push("el precio debe subir por encima de la EMA 20");
  }

  if (ema20 <= ema50) {
    condicionesAlcistas.push("la EMA 20 debe colocarse por encima de la EMA 50");
  }

  if (ema50 <= ema200) {
    condicionesAlcistas.push("la EMA 50 debe colocarse por encima de la EMA 200");
  }

  if (ultimoPrecio >= ema20) {
    condicionesBajistas.push("el precio debe caer por debajo de la EMA 20");
  }

  if (ema20 >= ema50) {
    condicionesBajistas.push("la EMA 20 debe colocarse por debajo de la EMA 50");
  }

  if (ema50 >= ema200) {
    condicionesBajistas.push("la EMA 50 debe colocarse por debajo de la EMA 200");
  }

  razon =
  `La tendencia está Neutral porque todavía no existe una alineación completa entre el precio, EMA 20, EMA 50 y EMA 200. ` +
  `Precio actual: ${ultimoPrecio.toFixed(2)} | EMA 20: ${ema20.toFixed(2)} | EMA 50: ${ema50.toFixed(2)} | EMA 200: ${ema200.toFixed(2)}. ` +
  `Para pasar a ALCISTA falta: ${condicionesAlcistas.length > 0 ? condicionesAlcistas.join(", ") : "mantener la estructura alcista actual"}. ` +
  `Para pasar a BAJISTA falta: ${condicionesBajistas.length > 0 ? condicionesBajistas.join(", ") : "mantener la estructura bajista actual"}. ` +
  `La EMA 200 confirma la dirección principal: para una estructura alcista sólida, EMA 50 debe estar por encima de EMA 200; para una estructura bajista sólida, EMA 50 debe estar por debajo de EMA 200. ` +
  `El volumen actual está en aproximadamente ${relacionVolumen}% del volumen promedio. ` +
  `Conclusión: Santiago IA recomienda ESPERAR hasta que el precio y las medias confirmen una dirección más clara.`;

}





  let lecturaPrecio = "";
  let lecturaEMAs = "";
  let lecturaVolumen = "";

  // Analizar la posición del precio
  if (ultimoPrecio > ema20 && ultimoPrecio > ema50 && ultimoPrecio > ema200) {
    lecturaPrecio =
      "El precio está por encima de las EMA 20, EMA 50 y EMA 200, mostrando presión alcista.";
  } else if (
    ultimoPrecio < ema20 &&
    ultimoPrecio < ema50 &&
    ultimoPrecio < ema200
  ) {
    lecturaPrecio =
      "El precio está por debajo de las EMA 20, EMA 50 y EMA 200, mostrando presión bajista.";
  } else {
    lecturaPrecio =
      "El precio se encuentra entre las medias móviles, por lo que todavía hay señales mixtas.";
  }

  // Analizar la estructura de las EMAs


if (ema20 > ema50 && ema50 > ema200) {
  lecturaEMAs =
    "Las EMA están ordenadas de forma alcista: EMA 20 por encima de EMA 50 y EMA 50 por encima de EMA 200.";
} else if (ema20 < ema50 && ema50 < ema200) {
  lecturaEMAs =
    "Las EMA están ordenadas de forma bajista: EMA 20 por debajo de EMA 50 y EMA 50 por debajo de EMA 200.";
} else {
  lecturaEMAs =
    "Las EMA no están completamente alineadas, lo que indica una estructura mixta o de transición.";
}

// Analizar la posición del precio


if (
  ultimoPrecio > ema20 &&
  ultimoPrecio > ema50 &&
  ultimoPrecio > ema200
) {
  lecturaPrecio =
    "El precio está por encima de las EMA 20, EMA 50 y EMA 200, mostrando fortaleza compradora.";
} else if (
  ultimoPrecio < ema20 &&
  ultimoPrecio < ema50 &&
  ultimoPrecio < ema200
) {
  lecturaPrecio =
    "El precio está por debajo de las EMA 20, EMA 50 y EMA 200, mostrando presión vendedora.";
} else {
  lecturaPrecio =
    "El precio se encuentra entre las medias móviles, por lo que todavía hay señales mixtas.";
}

// Analizar el volumen


if (promedioVolumen > 0 && ultimoVolumen >= promedioVolumen) {
  lecturaVolumen =
    `El volumen actual (${Math.round(ultimoVolumen).toLocaleString()}) está por encima o igual al promedio (${Math.round(promedioVolumen).toLocaleString()}), mostrando participación fuerte.`;
} else {
  lecturaVolumen =
    `El volumen actual (${Math.round(ultimoVolumen).toLocaleString()}) está por debajo del promedio (${Math.round(promedioVolumen).toLocaleString()}), por lo que el movimiento tiene menor confirmación.`;
}

// Crear explicación detallada
let confirmacionEsperada = "";

if (senal === "Esperar") {
  if (ultimoPrecio < ema200) {
    confirmacionEsperada =
      "Para una posible compra, Santiago IA esperaría que el precio supere y se mantenga por encima de la EMA 200 con volumen fuerte. " +
      "Para una posible venta, esperaría pérdida de EMA 20 y EMA 50 con presión vendedora y aumento de volumen.";
  } else {
    confirmacionEsperada =
      "Para una posible compra, Santiago IA esperaría que el precio se mantenga sobre EMA 20, EMA 50 y EMA 200 con volumen comprador fuerte. " +
      "Para una posible venta, esperaría que el precio pierda EMA 20 y EMA 50 y que el volumen confirme la caída.";
  }
}


razon =
  `Precio: ${ultimoPrecio.toFixed(2)}. ` +
  `EMA 20: ${ema20.toFixed(2)}, EMA 50: ${ema50.toFixed(2)}, EMA 200: ${ema200.toFixed(2)}. ` +
  `${lecturaPrecio} ` +
  `${lecturaEMAs} ` +
  `${lecturaVolumen} ` +
  `${confirmacionEsperada} ` +
  `Conclusión: la tendencia es ${tendencia} y la señal actual es ${senal}.`;



















      
    
    
    
    
    
      
    
    
    

    res.json({
  symbol,
  precio: Number(ultimoPrecio.toFixed(2)),
  tendencia,
  ema20: Number(ema20.toFixed(2)),
  ema50: Number(ema50.toFixed(2)),
  ema200: Number(ema200.toFixed(2)),
  volumenActual: ultimoVolumen,
  volumenPromedio: Math.round(promedioVolumen),
  vwap: Number(vwap.toFixed(2)),
rsi14: Number(rsi14.toFixed(2)),
atr14: Number(atr14.toFixed(2)),

  senal,
  score,
  razon,
});

} catch (error) {
  console.error("Error en /api/analysis:", error);

  res.status(500).json({
    error: "Error obteniendo análisis técnico",
  });
}
});













 
        

        
        
        
    
            
            

        
        

        

        
        
    

    

        
        
        


        

        
       

   

 
           



    










    

    








    

  


  





const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Santiago AI servidor activo en puerto ${PORT}`);
});
app.get("/api/news-ai", async (req, res) => {
    const lang = req.query.lang || "es";
    console.log("IDIOMA RECIBIDO:", lang);
  try {
    
   const response = await fetch(`https://api.marketaux.com/v1/news/all?api_token=${process.env.MARKETAUX_API_KEY}&symbols=QQQ,SPY,NVDA,AAPL,TSLA&language=en&limit=3`);



    

    const data = await response.json();
   if (data?.error?.code === "usage_limit_reached") {
  console.log("MarketAux sin créditos. Intentando FMP...");
}
  const fmpResponse = await fetch(
    `https://financialmodelingprep.com/stable/news/stock-latest?page=0&limit=10&apikey=${process.env.FMP_API_KEY}`
  );

  const fmpText = await fmpResponse.text();
  console.log("RESPUESTA FMP:", fmpResponse.status, fmpText);


return res.status(429).json({
  error: "Noticias temporalmente no disponibles. Intenta nuevamente más tarde."
});
  

  
} catch (error) {
    console.error("Error en /api/news-ai:", error);

    return res.status(500).json({
        error: "No se pudieron obtener las noticias"
    });
}
});





