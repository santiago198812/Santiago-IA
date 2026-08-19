function generarExplicacionIA(noticia, tipo, porcentaje, fuerza, contexto) {
  if (tipo === "ALCISTA") {
    return `Esta noticia se considera ALCISTA porque ${contexto}. La señal calculada es de ${porcentaje}% y su fuerza es ${fuerza}. Esto puede favorecer la presión compradora y una posible subida del precio.`;
  }

  if (tipo === "BAJISTA") {
    return `Esta noticia se considera BAJISTA porque ${contexto}. La señal calculada es de ${porcentaje}% y su fuerza es ${fuerza}. Esto puede aumentar la presión vendedora y favorecer una posible caída del precio.`;
  }

  return `Esta noticia se considera NEUTRAL porque ${contexto}. Las señales son mixtas y no existe suficiente fuerza compradora ni vendedora para definir una dirección clara del precio.`;
}

function generarExplicacionIAEn(noticia, tipo, porcentaje, fuerza, contexto) {
    if (tipo === "ALCISTA") {
        return `This news is considered BULLISH because ${contexto}. The signal has ${porcentaje}% confidence and its strength is ${fuerza}. This could favor buying pressure and a possible rise in price.`;
    }

    if (tipo === "BAJISTA") {
        return `This news is considered BEARISH because ${contexto}. The signal has ${porcentaje}% confidence and its strength is ${fuerza}. This could favor selling pressure and a possible decline in price.`;
    }

    return `This news is considered NEUTRAL because ${contexto}. The signals are mixed and do not show a clear market direction.`;
}












    











async function cargarNoticias() {
  try {
    const respuesta = await fetch("http://localhost:3001/api/news-ai");



    

const datos = await respuesta.json();


mostrarNoticias(datos);

  } catch (error) {
    console.error("Error al cargar noticias:", error);
  }
}

// cargarNoticias();
function mostrarNoticias(datos) {
  const noticias = datos.data || [];

  const texto = "Aquí aparecerán las noticias del mercado.";
  let contenedor = [...document.querySelectorAll("p")]
    .find(el => el.textContent.includes(texto));

  if (!contenedor) {
    contenedor = [...document.querySelectorAll("div")]
      .find(el => el.textContent.trim() === texto);
  }

  if (!contenedor) {
    console.log("Área de noticias todavía no disponible");

    return;
  }

  contenedor.innerHTML = "";

  noticias.forEach(noticia => {
    const articulo = document.createElement("div");
articulo.className = "noticia-card";

    const titulo = document.createElement("h3");
    titulo.textContent = noticia.title || "Noticia";

    const fuente = document.createElement("p");
    fuente.textContent = noticia.source || "";
const entidades = noticia.entities || [];
const sentimientoIA = noticia.sentimiento || "NEUTRAL";



const puntajes = entidades
  .map(entidad => entidad.sentiment_score)
  .filter(puntaje => typeof puntaje === "number");

const promedio = puntajes.length
  ? puntajes.reduce((a, b) => a + b, 0) / puntajes.length
  : 0;
console.log("NOTICIA COMPLETA:", noticia);



const sentimiento = document.createElement("p");
const porcentaje = Math.round(Math.abs(promedio) * 100);

let fuerza = "DÉBIL";

if (porcentaje >= 60) {
    fuerza = "FUERTE";
} else if (porcentaje >= 30) {
    fuerza = "MODERADO";
}




const contextoNoticia = noticia.description || noticia.snippet || noticia.title || "";

if (promedio > 0.05) {
    sentimiento.textContent = `🟢 ALCISTA ${porcentaje}% - ${fuerza}`
noticia.explicacion = generarExplicacionIA(noticia, "ALCISTA", porcentaje, fuerza, contextoNoticia);
noticia.explicacionEn = generarExplicacionIAEn(noticia, "ALCISTA", porcentaje, fuerza, contextoNoticia);





} else if (promedio < -0.05) {
    sentimiento.textContent = `🔴 BAJISTA ${porcentaje}% - ${fuerza}`;
    noticia.explicacion = generarExplicacionIA(noticia, "BAJISTA", porcentaje, fuerza, contextoNoticia);
    noticia.explicacionEn = generarExplicacionIAEn(noticia, "BAJISTA", porcentaje, fuerza, contextoNoticia);





} else {
    sentimiento.textContent = "🟡 NEUTRAL";
    noticia.explicacion = generarExplicacionIA(noticia, "NEUTRAL", porcentaje, fuerza, contextoNoticia);



}








    






  

  

  





    const enlace = document.createElement("a");
    enlace.href = noticia.url;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.textContent = "Leer noticia";

    articulo.appendChild(titulo);
    articulo.appendChild(fuente);
    articulo.appendChild(sentimiento);

const explicacion = document.createElement("p");
explicacion.textContent = noticia.explicacion || "Sin explicación disponible.";

articulo.appendChild(explicacion);
    articulo.appendChild(enlace);

    contenedor.appendChild(articulo);
  });
}
document.addEventListener("click", (evento) => {
  if (evento.target.textContent.includes("Noticias")) {
    // setTimeout(cargarNoticias, 200);
  }
});

