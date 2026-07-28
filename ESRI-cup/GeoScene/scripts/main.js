//study from: ArcGIS Maps SDK for JavaScript
//主要图层管理和空间分析代码，涵盖地图基本控件的引用、图层加载与显示、缓冲区参数设置及分析、路径分析、属性表显示功能
//cy 2025-04-10 ~ 2025-05-28
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/layers/TileLayer",
    "esri/layers/FeatureLayer",
    "esri/rest/closestFacility",
    "esri/rest/support/ClosestFacilityParameters",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/rest/support/FeatureSet",
    "esri/symbols/Symbol",
    "esri/widgets/Directions",
    "esri/layers/RouteLayer",
    "esri/symbols/SimpleLineSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/widgets/Search",
    "esri/widgets/ScaleBar",
    "esri/widgets/Compass",
    "esri/widgets/Fullscreen",
    "esri/widgets/Home",
    "esri/rest/route",
    "esri/rest/support/RouteParameters",
    "esri/geometry/geometryEngine",
    "./scripts/congestionlayer.js",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/widgets/FeatureTable",
    "esri/core/reactiveUtils",
    "esri/widgets/Expand",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Popup",
], function (
    Map,
    MapView,
    SceneView,
    TileLayer,
    FeatureLayer,
    closestFacility,
    ClosestFacilityParameters,
    Graphic,
    GraphicsLayer,
    FeatureSet,
    Symbol,
    Directions,
    RouteLayer,
    SimpleLineSymbol,
    SimpleRenderer,
    Search,
    ScaleBar,
    Compass,
    Fullscreen,
    Home,
    route,
    RouteParameters,
    geometryEngine,
    CongestionModule,
    SketchViewModel,
    FeatureTable,
    reactiveUtils,
    Expand,
    BasemapGallery,
    Popup
) {
    //renderer for routeFeatureLayer
    const renderer = {
        type: "simple",
        symbol: {
            type: "simple-line",
            color: "#3296FA",
            width: 2,
            style: "solid",
        },
    };

    //custom layer
    const roadLayer = new FeatureLayer({
        url: "https://yuji.arcgis.cn/server/rest/services/HospitalToAlarmPoint/Wuhan_Roads_With_Weight2/MapServer",
        id: "roadLayer",
        outFields:["osm_id","name","fclass","bridge","tunnel","length","weight"],
    });

    const congestionLayer = new FeatureLayer({
        url: "https://yuji.arcgis.cn/server/rest/services/HospitalToAlarmPoint/wuhanCongestion/MapServer",
        outFields: ["*"],
        id: "congestionLayer",
    });

    const regionLayer = new FeatureLayer({
        url: "https://yuji.arcgis.cn/server/rest/services/HospitalToAlarmPoint/Wuhan/MapServer",
        id: "regionLayer",
        opacity: 0.4,
    });

    const hospitalsLayer = new FeatureLayer({
        url: "https://yuji.arcgis.cn/server/rest/services/HospitalToAlarmPoint/hospital/MapServer",
        id: "hospitalsLayer",
    });

    //The code to create a map and view instance should be placed after the snippet of creating layers
    const map = new Map({
        basemap: "dark-gray-vector",
    });

    //地图视图
    const view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 10,
        center: [114.304569, 30.593354],
        popup: {
            dockEnabled: true,
            dockOptions: {
                buttonEnabled: false,
                breakpoint: false,
            },
        },
    });

    // using map.layers.add() to add a layer
    map.layers.add(hospitalsLayer);
    map.layers.add(regionLayer);
    map.layers.add(congestionLayer);
    map.layers.add(roadLayer);

    //for congestion highlight
    const highlightLayer = new GraphicsLayer();
    map.add(highlightLayer);

    //infobox for congestion messages
    const infobox = document.getElementById("infobox");

    //Create a variable referencing the  checkbox node
    const hospitalsLayerToggle = document.getElementById("hospitalsLayerBox");
    //Listen to the change event for the checkbox
    hospitalsLayerToggle.addEventListener("change", () => {
        //When the checkbox is checked (true), set the layer's visibility to true
        hospitalsLayer.visible = hospitalsLayerToggle.checked;
    });

    //regionLayer check box
    const regionLayerToggle = document.getElementById("regionLayerBox");
    regionLayerToggle.addEventListener("change", () => {
        regionLayer.visible = regionLayerToggle.checked;
    });

    //roadLayer check box
    const roadLayerToggle = document.getElementById("roadLayerBox");
    roadLayerToggle.addEventListener("change", () => {
        roadLayer.visible = roadLayerToggle.checked;
    });

    //拥堵指数查看模块
    view.when(() => {
        //初始化拥堵图层模块
        CongestionModule.initialize(view, congestionLayer);
    });

    // 地图基本组件
    //search
    const searchWidget = new Search({
        view: view,
        popupEnabled: true,
        popup: new Popup({
            dockEnabled: false,
            dockOptions: {
                position: "auto",
                breakpoint: false,
            },
        }),
    });

    searchWidget.container = "searchWidgetContainer";

    view.ui.add(searchWidget);

    //scale
    const scaleBar = new ScaleBar({
        view: view,
    });

    view.ui.add(scaleBar, {
        position: "bottom-left",
    });

    //compass
    const compass = new Compass({
        view: view,
    });
    compass.container = "compassContainer";
    view.ui.add(compass);

    //Fullscreen
    const fullscreen = new Fullscreen({
        view: view,
    });
    fullscreen.container = "fullscreenContainer";
    view.ui.add(fullscreen);

    //Home
    const home = new Home({
        view: view,
    });
    home.container = "homeContainer";
    view.ui.add(home);

    //Expand and BasemapGallery
    const basemapGallery = new BasemapGallery({
        view: view,
    });

    const bgExpand = new Expand({
        view: view,
        content: basemapGallery,
        expandIconClass: "esri-icon-basemap",
        group: "bottom-right",
    });

    view.ui.add(bgExpand, {
        position: "bottom-right",
        index: 1,
    });

    //缓冲区参数设置部分
    settingPage = document.getElementById("settingPage");
    const submit1 = document.getElementById("submit1");
    const submit2 = document.getElementById("submit2");
    document
        .getElementById("setting")
        .addEventListener("click", settingOption);
    document.getElementById("shanchu").addEventListener("click", shutdown);

    submit1.addEventListener("click", getValue);
    submit2.addEventListener("click", shutdown);
    let currentRadius = 500; //设置初始缓冲半径为1000米
    let radiusStep = 200; //设置每次增加200米

    function settingOption() {
        settingPage.style.display = "flex";
        document.getElementById("overLay").style.display="block";
    }
    function shutdown() {
        settingPage.style.display = "none";
        document.getElementById("overLay").style.display="none";
    }
    function getValue() {
        var radiusInfo = document.getElementById("radiusInfo"); //缓冲区初始距离
        var radiusStepInfo = document.getElementById("radiusStepInfo"); //缓冲区扩增步长
        var radiusInfoValue = radiusInfo.value.trim();
        var radiusStepInfoValue = radiusStepInfo.value.trim();
        console.log(radiusStepInfo);
        //定义两个标志变量，用于判断输入是否有效
        var radiusValid = false;
        var stepValid = false;
        //检查初始距离输入是否有效（非空且为整数）
        if (radiusInfoValue !== "") {
            var newRadius = parseInt(radiusInfoValue, 10);
            if (!isNaN(newRadius) && Number.isInteger(newRadius)) {
                radiusValid = true;
            } else {
                console.error("输入的初始距离无效");
                alert("输入的初始距离无效");
            }
        }
        //检查扩增步长是否有效（非空且为整数）
        if (radiusStepInfoValue !== "") {
            var newStep = parseInt(radiusStepInfoValue, 10);
            if (!isNaN(newStep) && Number.isInteger(newStep)) {
                stepValid = true;
            } else {
                console.error("输入的扩增步长无效");
                alert("输入的扩增步长无效");
            }
        }
        //两者均有效时进行赋值
        if (radiusValid && stepValid) {
            currentRadius = parseInt(radiusInfoValue, 10);
            radiusStep = parseInt(radiusStepInfoValue, 10);
            console.log("新的缓冲半径：", currentRadius);
            console.log("新的扩增步长：", radiusStep);
        } else {
            console.log("当前缓冲半径：", currentRadius);
            console.log("当前扩增步长：", radiusStep);
        }
    }

    //   路径分析参数
    // const routeUrl =
    //   "https://yuji.arcgis.cn/server/rest/services/HospitalToAlarmPoint/Route_Analyse/NAServer/route2";
    const routeUrl =
        "https://yuji.arcgis.cn/server/rest/services/HospitalToAlarmPoint/Route_Analyse2/NAServer/route3";
    const routeLayer = new GraphicsLayer(); //存储路径返回结果
    const routeParams = new RouteParameters({
        stops: new FeatureSet(),
        returnDirections: true,
        directionsLanguage: "zh", // 确保语言支持
        directionsOutputType: "complete",
    });


    //图形图层
    const bufferGraphicsLayer = new GraphicsLayer();
    map.add(bufferGraphicsLayer);
    //缓冲区动态参数
    let clickHandler = null;
    let condition = 0;

    //“点击选取报警点”点击事件
    document.getElementById("findSpot").addEventListener("click", () => {
        if (clickHandler) clickHandler.remove();
        view.focus();
        clickHandler = view.on("click", async (event) => {
            bufferGraphicsLayer.removeAll();
            const userPoint = event.mapPoint;
            await findNearestHospital(userPoint);
        });
    });

    //展示路径导航信息
    function showCustomDirections(result){
        const directions=result.routeResults[0].directions;
        const stats=result.routeResults[0].attributes;
        //更新统计信息
        // document.getElementById("totalDistance").textContent=stats.Total_Kilometers.toFixed(1);
        //生成步骤列表
        const stepsHtml=directions.map((step,index)=>`
        <li>
            <span class="step-number">${index + 1}.</span>
            ${step.text}
            <span class="step-distance">${step.length.toFixed(1)} 公里</span>
        </li>
        `).join("");
        document.getElementById("stepList").innerHTML=stepsHtml;
    }

    //动态缓冲区检测医院
    async function findNearestHospital(userPoint) {
        let radius = currentRadius;
        let hospital = null;

        //循环扩大缓冲区
        while (!hospital || hospital.features.length === 0) {
            const buffer = geometryEngine.buffer(userPoint, radius, "meters");
            //绘制缓冲区
            bufferGraphicsLayer.add(
                new Graphic({
                    geometry: buffer,
                    symbol: { type: "simple-fill", color: [255, 192, 203, 0.2] }, //缓冲区颜色
                })
            );
            //空间查询
            hospital = await hospitalsLayer.queryFeatures({
                geometry: buffer,
                spatialRelationship: "intersects",
                returnGeometry: true,
            });

            if (hospital.features.length > 0) {
                const hospitalPoint = hospital.features[0].geometry;
                //路径分析
                routeParams.stops.features = [
                    new Graphic({ geometry: hospitalPoint }), //起点为医院
                    new Graphic({ geometry: userPoint }), //终点为用户点击点
                ];
                //显示路径
                const result = await route.solve(routeUrl, routeParams);
                if (result.routeResults[0].route.geometry) {
                    bufferGraphicsLayer.add(
                        new Graphic({
                            geometry: result.routeResults[0].route.geometry,
                            symbol: {
                                type: "simple-line",
                                color: "deepskyblue",
                                width: 4,
                            },
                        })
                    );
                    // console.log(result.routeResults[0].directions);
                    // showCustomDirections(result);
                }
                break;
            }
            radius += radiusStep;
        }
    };

    //显示路径信息
    const customDirections = document.getElementById("customDirections");
    const pathInfo=document.getElementById("pathInfo");
    pathInfo.addEventListener("click",pathBrowse);
    function pathBrowse(){
        customDirections.style.display="block";
    };

    //重置路径检索
    document.getElementById("resetNA").addEventListener("click", resetRoute);
    function resetRoute() {
        routeLayer.removeAll(); //清除图形
        routeParams.stops = new FeatureSet(); //重置停靠点参数
        bufferGraphicsLayer.removeAll();

        // 移除地图点击监听器[6,8](@ref)
        if (clickHandler) {
            clickHandler.remove();
            clickHandler = null; // 必须置空防止内存泄漏
        }
        customDirections.style.display="none";
        alert("路径已重置！");
    }

    //查看属性表
    view.when(() => {
        roadLayer.title = "武汉带权路网";
        roadLayer.outFields = ["osm_id","fclass","bridge","tunnel","length","weight"];
    });
    const appContainer = document.getElementById("appContainer");
    const tableContainer = document.getElementById("tableContainer");
    const tableDiv = document.getElementById("tableDiv");
    //创建FeatureTable
    const featureTable = new FeatureTable({
        view: view,
        layer: roadLayer,
        tableTemplates: {
            columnTemplates: [
                {
                    type: "field",
                    fieldName: "osm_id",
                    label: "道路编号",
                    direction: "asc",
                },
                {
                    type: "field",
                    fieldName: "name",
                    label: "名称",
                },
                {
                    type: "field",
                    fieldName: "fclass",
                    label: "道路类别",
                },
                {
                    type: "field",
                    fieldName: "bridge",
                    label: "桥梁判断",
                },
                {
                    type: "field",
                    fieldName: "tunnel",
                    label: "隧道判断",
                },
                {
                    type: "field",
                    fieldName: "length",
                    label: "道路长度",
                },
                {
                    type: "field",
                    fieldName: "weight",
                    label: "道路权重",
                },
            ],
        },
        container: tableDiv,
    });
    //添加滑动条
    view.ui.add(document.getElementById("mainDiv"), "top-right");
    const checkboxEle = document.getElementById("checkboxId");
    const labelText = document.getElementById("labelText");
    checkboxEle.onchange = () => {
        toggleFeatureTable();
    };

    function toggleFeatureTable() {
        if (!checkboxEle.checked) {
            appContainer.removeChild(tableContainer);
            labelText.innerHTML = "显示属性表";
        } else {
            appContainer.appendChild(tableContainer);
            labelText.innerHTML = "隐藏属性表";
        }
    }

    reactiveUtils.watch(
        () => view.popup.viewModel?.active,
        () => {
            selectedFeature = view.popup.selectedFeature;
            if (selectedFeature !== null && view.popup.visible !== false) {
                featureTable.highlightIds.removeAll();
                featureTable.highlightIds.add(
                    view.popup.selectedFeature.attributes.OBJECTID
                );
                id = selectedFeature.getObjectId();
            }
        }
    );
});

