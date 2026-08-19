let simboloActual = "NASDAQ:AAPL";

function crearGrafico() {
    const contenedor = document.getElementById("tradingview_chart");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    new TradingView.widget({
        container_id: "tradingview_chart",
        width: "100%",
        height: 500,
        symbol: simboloActual,
        interval: "15",
        timezone: "America/New_York",
        theme: "dark",
        style: "1",
        locale: "es",
        toolbar_bg: "#1f2937",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_side_toolbar: false,
withdateranges: true,
save_image: true,
studies: [],



        allow_symbol_change: true
    });
}

function iniciarTradingView() {
    if (window.TradingView) {
        crearGrafico();
        return;
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.onload = crearGrafico;

    document.body.appendChild(script);
}


