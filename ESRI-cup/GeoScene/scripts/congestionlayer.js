// congestionlayer.js
//用于区域拥堵指数显示
//cy 2025-04-10 ~ 2025-05-28
define([
    "esri/Graphic",
    "esri/layers/FeatureLayer",
    "esri/views/MapView",
    "esri/layers/GraphicsLayer"
], function (Graphic, FeatureLayer, MapView,GraphicsLayer) {
    let isLayerVisible = false;
    let pointerMoveHandler = null;
    const highlightLayer = new GraphicsLayer();
    let infobox = null;

    return {
        initialize: function (view, congestionLayer) {
            // 初始化图层和组件
            view.map.add(highlightLayer);
            infobox = document.getElementById("infobox");

            // 绑定点击事件
            document.getElementById("congestion").addEventListener("click", () => {
                isLayerVisible = !isLayerVisible;
                congestionLayer.visible = isLayerVisible;

                if (isLayerVisible) {
                    this.enableInteraction(view);
                } else {
                    this.disableInteraction();
                }
            });
        },

        enableInteraction: function (view) {
            pointerMoveHandler = view.on("pointer-move", (event) => {
                highlightLayer.removeAll();
                infobox.style.display = "none";

                view.hitTest(event).then((response) => {
                    const filteredResults = response.results.filter(result =>
                        result.graphic?.layer?.id === "congestionLayer"
                    );
                    if (filteredResults.length > 0) {
                        const graphic = filteredResults[0].graphic;
                        this.showHighlight(graphic);
                        this.updateInfobox(graphic);
                    }
                });
            });
        },

        disableInteraction: function () {
            if (pointerMoveHandler) {
                pointerMoveHandler.remove();
                pointerMoveHandler = null;
            }
            highlightLayer.removeAll();
            infobox.style.display = "none";
        },

        showHighlight: function (graphic) {
            highlightLayer.add(new Graphic({
                geometry: graphic.geometry,
                symbol: {
                    type: "simple-fill",
                    color: [32, 150, 250, 0.5],
                    outline: { color: "white", width: 2 }
                }
            }));
        },

        updateInfobox: function (graphic) {
            const { 地名, Congestion, ConDes } = graphic.attributes;
            infobox.innerHTML = `
        <div class="title">${地名}</div>
        <div class="value">${parseFloat(Congestion).toFixed(3)}</div>
        <div class="description">${ConDes}</div>
      `;
            infobox.style.display = "block";
        }
    };
});