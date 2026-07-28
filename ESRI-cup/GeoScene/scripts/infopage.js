// infopage.js
//信息页面操作代码
//cy 2025-04-10 ~ 2025-05-28
const gaishu=document.getElementById("infoText1");
const tixijiegou=document.getElementById("infoText2");
const shujufabuzhinan=document.getElementById("infoText3");
const buzuyujihua=document.getElementById("infoText4")

const infobox1=document.getElementById("info1");
const infobox2=document.getElementById("info2");
const infobox3=document.getElementById("info3");
const infobox4=document.getElementById("info4");

gaishu.addEventListener("click",()=>{
    infobox1.style.display="flex";
    infobox2.style.display="none";
    infobox3.style.display="none";
    infobox4.style.display="none";
});

tixijiegou.addEventListener("click",()=>{
    infobox2.style.display="flex";
    infobox1.style.display="none";
    infobox3.style.display="none";
    infobox4.style.display="none";
});

shujufabuzhinan.addEventListener("click",()=>{
    infobox3.style.display="flex";
    infobox1.style.display="none";
    infobox2.style.display="none";
    infobox4.style.display="none";
});

buzuyujihua.addEventListener("click",()=>{
    infobox4.style.display="flex";
    infobox1.style.display="none";
    infobox2.style.display="none";
    infobox3.style.display="none";
});

const info=document.getElementById("info");

info.addEventListener("click",()=>{
    document.getElementById('overLay').style.display = 'block';
    document.getElementById('infoPage').style.display = 'flex';
});

const shanchu2=document.getElementById("shanchu2");

shanchu2.addEventListener("click",()=>{
    document.getElementById('overLay').style.display = 'none';
    document.getElementById('infoPage').style.display = 'none';
})