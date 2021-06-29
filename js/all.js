//本篇重點//
/*

1.預設地點在台北市大安區,載入系統時會顯示在此區域,藥局資訊也是

2.嘗試製作整頁滾動

3.口罩的數量若為0,背景色將改成紅色


*/



/*

bootstrap的jQuery


*/

(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();

$(function () {
  $('[data-toggle="tooltip"]').tooltip('enable');
})


//讓左邊選單藥局資訊欄部分的高度隨螢幕高度變化

const cont = document.querySelector('.content');


document.querySelector('.l_menu').style.height=window.innerHeight-118+"px";

window.onresize=function(){
  document.querySelector('.l_menu').style.height=window.innerHeight-118+"px";
}

cont.style.height=window.innerHeight-378+"px";

window.onresize=function(){
  cont.style.height=window.innerHeight-378+"px";
}


//判斷時間,日期以及購買資格


//let canbuy = document.querySelector('.ml-3');

function startTime(){
      let twnum = ["日","一","二","三","四","五","六"];
      let today = new Date();
      let mon = today.getMonth()+1;
      let date = today.getDate();
      let week = today.getDay();
      let hh = today.getHours();
      let mm = today.getMinutes();
      mm = checkTime(mm);
      hh = checkTime(hh);
      mon = checkTime(mon);
      date = checkTime(date); 
      document.querySelector('.jsdate').innerHTML = mon + "&nbsp/&nbsp" + date;
      document.querySelector('.jsweek').innerHTML = "星&nbsp期&nbsp" + twnum[week];
      document.querySelector('.jstime').innerHTML = hh + ":" + mm;
      let timeoutId = setTimeout(startTime, 500);
      
      /*
      switch (week) {
        case 1:
          document.querySelector('.whocanbuy').innerHTML = "奇數號購買日";
          canbuy.setAttribute('title', '身分證尾數1,3,5,7,9的朋友');
          break;
        case 3:
          document.querySelector('.whocanbuy').innerHTML = "奇數號購買日";
          canbuy.setAttribute('title', '身分證尾數1,3,5,7,9的朋友');
          break;
        case 5:
          document.querySelector('.whocanbuy').innerHTML = "奇數號購買日";
          canbuy.setAttribute('title', '身分證尾數1,3,5,7,9的朋友');
          break;
        case 0:
          document.querySelector('.whocanbuy').innerHTML = "大家都能買";
          canbuy.setAttribute('title', '大家都可以買喔');
          break;
        default:
          document.querySelector('.whocanbuy').innerHTML = "偶數號購買日";
          canbuy.setAttribute('title', '身分證尾數0,2,4,6,8的朋友');
          break;
      }
      */
      
    }


function checkTime(i){

  if(i < 10) {
    i = "0" + i;
  }

  return i;
}


let load = document.querySelector('.load');

let load_cont = document.querySelector('.load-cont');


//抓取口罩資料


let zonedata=[];        //儲存藥局資訊
let zonelocaltion=[];   //儲存藥局座標

(function maskdata(){
  xhr=new XMLHttpRequest();
  xhr.open('get','https://iplay.sa.gov.tw/api/GymSearchAllList?$format=application/json;odata.metadata=none&Keyword=*&City=*&GymType=*&Latitude=22.6239746&Longitude=120.305267');
  xhr.onreadystatechange = function() {//利用onreadystatechange來監測readyState及status是否為正常(若讀取成功readyState會=4,status會=200)''本段用來擷取features資料''
      if (xhr.readyState === 4 && xhr.status === 200) {

        load.setAttribute('style', ' background-color: transparent');

        load_cont.setAttribute('style', ' opacity: 0');


        setTimeout(function(){ load.setAttribute('style', 'display: none'); },3200);
        

        L.control.zoom({

          position: 'topright'

        }).addTo(map);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        

        const data = JSON.parse(xhr.responseText);
        const dataLen = data.length;        

        for (let i = 0; dataLen > i; i++) {
          zonedata.push(data[i]);


          var LatLngStr = data[i].LatLng;
          var LatLng = LatLngStr.split(',');
          


          zonelocaltion.push(LatLng);

        }


          // console.log(zonedata[0])
          // console.log(zonelocaltion[0])
          // console.log(zonelocaltion[0][0])
          // console.log(zonelocaltion[0][1])
          
          // console.log(zonedata[1])
          // console.log(zonelocaltion[1])
          // console.log(zonelocaltion[1][0])
          // console.log(zonelocaltion[1][1])

          


          
          // console.log(zonedata[2])
          // console.log(zonelocaltion[2])
          // console.log(zonelocaltion[2][0])
          // console.log(zonelocaltion[2][1])


          pointinfo(zonedata,'臺北市','信義區');       
          addMarker(zonedata);             

      }
          
    };
    xhr.send(null);


})(goto);




//製作點擊卡片之後的快速導覽功能

pointinfo.onload = cont.addEventListener('click',goto, true);


function goto(e){

  let cardnum = e.target.dataset.cards; 
  const maskAdult = 1000;//zonedata[cardnum].mask_adult;
  const maskChild = 2000;//zonedata[cardnum].mask_child;

  

  let DE = zonedata[cardnum].Declaration
  if(DE==null){DD = "暫無公告"}

  let GFL = zonedata[cardnum].GymFuncList

  let RT = zonedata[cardnum].RentState

  let localx = zonelocaltion[cardnum][0];
  let localy = zonelocaltion[cardnum][1];
  // const adultalarm = (() => {
  //                  if (maskAdult > 500) {
  //                    return '#4ecdc4';
  //                  }
  //                  else if (maskAdult >= 500 && maskAdult > 100) {
  //                    return '#ffe66d';
  //                  }
  //                  else {
  //                    return '#ff6b6b';
  //                  }
  //                })();

  // const childalarm = (() => {
  //                  if (maskChild > 500) {
  //                    return '#4ecdc4';
  //                  }
  //                  else if (maskChild >= 500 && maskChild > 100) {
  //                    return '#ffe66d';
  //                  }
  //                  else {
  //                    return '#ff6b6b';
  //                  }
  //                })();

  let icd = `
             <div class="card mb-3 infocards" style="max-width: 338px">

             <h5 class="title m-4 h3">${zonedata[cardnum].Name}</h5>

             <ul class="list-group">
               <li class="list-group-item list-group-item-action">電話:${zonedata[cardnum].OperationTel}</li>
               <li class="list-group-item list-group-item-action">地址:${zonedata[cardnum].Address}</li>
               <li class="list-group-item list-group-item-action">${DD}</li>
             </ul>

             <section class="d-flex justify-content-between flex-direction-row">

             <div class="px-2 py-1 m-3 text-left text-white masks w-50 texts" style="background-color: ${'#4ecdc4'};">
             全部場地:
             <div class="font-weight-bold text-center">${GFL}</div>
             <div class="text-right"></div>
             </div>

             <div class="px-2 py-1 m-3 text-left text-white masks w-50 texts" style="background-color: ${'#4ecdc4'};">
             收費模式:
             <div class="font-weight-bold text-center">${RT}</div>
             <div class="text-right"></div>
             </div>

             </section>
             </div>
             `;

  map.setView([localx, localy],30);
  L.marker([localx, localy]).addTo(map).bindPopup(icd).openPopup();  

}



//口罩地圖的json縣市地區有缺漏,所以額外尋找鄉鎮市區資料來抓取


const allcitys=[];

let loc;

(function addressdata(){
  loc=new XMLHttpRequest();
  loc.open('get','https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/AllData.json');
  loc.send(null);

  loc.onreadystatechange = function() {//利用onreadystatechange來監測readyState及status是否為正常(若讀取成功readyState會=4,status會=200)''本段用來擷取features資料''
      if (loc.readyState === 4 && loc.status === 200) {

        const datas = JSON.parse(loc.responseText);
        const dataL = datas.length;             

        for (let i = 0; dataL > i; i++) {

          allcitys.push(datas[i].CityName);                

        }

        removeByValue(allcitys, '南海島');
        removeByValue(allcitys, '釣魚臺');
        selection_county(allcitys);        

      }
          
    };

})();

//把空資料的南海島跟釣魚台從列表中刪除
function removeByValue(array, value) {
  return array.forEach((item, index) => {
    if(item === value) {
      array.splice(index, 1);
    }
  })
}


//載入地圖資料


//let map = L.map('map').setView([25.033976, 121.5623502], 13, (zoomControl false);

let map = L.map('map', {
  center: [25.033976, 121.5623502], // 台北市區的經緯度（地圖中心）
  zoom: 13, // 地圖預設尺度
  zoomControl: false // 是否顯示預設的縮放按鈕（左上角）
}) 


//<!-- 1.定義 marker 顏色，把這一段放在 getData() 前面 -->
let mask;
//<!-- 2.我們取出綠、橘、紅三個顏色來代表口罩數量的不同狀態 -->
const greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    //<!-- 3.只要更改上面這一段的 green.png 成專案裡提供的顏色如：red.png，就可以更改 marker 的顏色-->
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const orangeIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


const redIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});




function addMarker(){

  const markers = new L.MarkerClusterGroup({ disableClusteringAtZoom: 18 }).addTo(map);

  // console.log('選擇的活動',chooseActi)
  
  for(let i = 0;i<zonedata.length;i++){

  //> <!-- 1.由於我們已能存取 zonedata 裡的資料，所以我們就按照 API 的使用說明來取用資料 -->

  const maskAdult = 3000//zonedata[i].mask_adult;
  const maskChild = 4000//zonedata[i].mask_child;
  const lat = zonelocaltion[i][0];
  const lng = zonelocaltion[i][1];

  let  Dd = zonedata[i].Declaration
  if(Dd==null){De = "暫無公告"}

  let GFL = zonedata[i].GymFuncList
  
  
  let RT = zonedata[i].RentState
  // let GG=""
  // if( GFL.match("棒球")=="棒球"){
  //   GG = "棒球"}
  // if (GFL.match("籃球")=="籃球"){
  //   GG = "籃球"}
  // if (GFL.match("田徑")=="田徑"){
  //   GG = "田徑"}
  // if (GFL.match("排球")=="排球"){
  //     GG = "排球"}


  // const adultalarm = (() => {
  //                  if (maskAdult > 500) {
  //                    return '#4ecdc4';
  //                  }
  //                  else if (maskAdult >= 500 && maskAdult > 100) {
  //                    return '#ffe66d';
  //                  }
  //                  else {
  //                    return '#ff6b6b';
  //                  }
  //                })();

  // const childalarm = (() => {
  //                  if (maskChild > 500) {
  //                    return '#4ecdc4';
  //                  }
  //                  else if (maskChild >= 500 && maskChild > 100) {
  //                    return '#ffe66d';
  //                  }
  //                  else {
  //                    return '#ff6b6b';
  //                  }
  //                })();

  const ic = `
             <div class="card mb-3 infocards" style="max-width: 338px">

             <h5 class="title m-4 h3">${zonedata[i].Name}</h5>

             <ul class="list-group">
               <li class="list-group-item list-group-item-action">電話:${zonedata[i].OperationTel}</li>
               <li class="list-group-item list-group-item-action">地址:${zonedata[i].Address}</li>
               <li class="list-group-item list-group-item-action">${De}</li>
             </ul>

             <section class="d-flex justify-content-between flex-direction-row">

             <div class="px-2 py-1 m-3 text-left text-white masks w-50 texts" style="background-color: ${'#4ecdc4'};">
             全部場地:
             <div class="font-weight-bold text-center">${GFL}</div>
             <div class="text-right"></div>
             </div>

             <div class="px-2 py-1 m-3 text-left text-white masks w-50 texts" style="background-color: ${'#4ecdc4'};">
             收費模式:
             <div class="font-weight-bold text-center">${RT}</div>
             <div class="text-right"></div>
             </div>

             </section>
             </div>
             `;

             let masks = document.querySelectorAll('.masks');             
             

             //<!-- 2.下判斷式，依據不同的口罩數量，來顯示不同的 marker 顏色 -->

             if(maskAdult > 500 || maskChild > 500){

              mask = greenIcon;              

            }

            else if (maskAdult <= 500 && maskAdult > 100 || maskChild <= 500 && maskChild > 100){

              mask = orangeIcon;
             
            }

            else{

              mask = redIcon;

            }

            //>  <!-- 3.最後，將 marker 標至地圖上 -->

            markers.addLayer(L.marker([lat,lng], {icon: mask}).bindPopup(ic));

          }

          map.addLayer(markers);

        }





//初始資料,開啟地圖時的預設顯示資料


function pointinfo(parameter,city,townss,Actiss,Rentss){

  let str = "";
  
  // console.log("pointinfo執行")
  // console.log('活動',Actiss)
  // console.log('收費狀態',Rentss)
  // console.log("-----------------------------------------")
  // console.log('選擇的活動',chooseActi)
  


  for (let i = 0; i < parameter.length; i++) {
          
    
      let Agfl =parameter[i].GymFuncList
      let Bgfl =parameter[i].GymFuncList

      if(chooseActi!==undefined){
          Bgfl = Agfl.match(chooseActi)
      }

      let cct = parameter[i].Address.match(city)
      let tss = parameter[i].Address.match(townss)


      let Act = parameter[i].GymFuncList.match(Actiss)
      
      let Rnt = parameter[i].RentState.match(Rentss)


       //console.log(cct)
      // console.log(tss)
     // console.log(Act)

     let Pd = parameter[i].Declaration
    
     if(Pd==null) Pd = "暫無公告" ;

     let a = 0

     if(Act!==undefined && Rent == undefined){
      if(cct == city && tss== townss && Act == Actiss){          
        str += `
          <div class="card mb-3 infocards" data-cards="${i}">

          <h5 class="title m-4 h1">${parameter[i].Name}</h5> 

          <section class="d-flex justify-content-between flex-direction-row"> 

          <div class="px-2 py-1 m-3 text-left text-white mask-a w-50" data-adult="${i}">
            運動場類型
            <div class="font-weight-bold text-center textm">${Bgfl}</div>
            <div class="text-right"></div>  
          </div>  

          
          <div class="px-2 py-1 m-3 text-left text-white mask-c w-50" data-child="${i}">
            收費類型
            <div class="font-weight-bold text-center textm">${parameter[i].RentState}</div>
            <div class="text-right"></div>  
          </div>
        

          </section>

    
                
            <ul class="list-group">
              <li class="list-group-item list-group-item-action">${parameter[i].OperationTel}</li>
              <li class="list-group-item list-group-item-action">${parameter[i].Address}</li>
              <li class="list-group-item list-group-item-action">${Pd}</li>
            </ul>



        </div>

        `;
          let localx = zonelocaltion[i][0];
          let localy = zonelocaltion[i][1];        
          map.setView(new L.LatLng(localx, localy),15);
        }
     }else if(Act==undefined && Rent==undefined){

      if(cct == city ){          
        str += `
          <div class="card mb-3 infocards" data-cards="${i}">

          <h5 class="title m-4 h1">${parameter[i].Name}</h5> 

          <section class="d-flex justify-content-between flex-direction-row"> 

          <div class="px-2 py-1 m-3 text-left text-white mask-a w-50" data-adult="${i}">
            運動場類型
            <div class="font-weight-bold text-center textm">${Bgfl}</div>
            <div class="text-right"></div>  
          </div>  

          
          <div class="px-2 py-1 m-3 text-left text-white mask-c w-50" data-child="${i}">
            收費類型
            <div class="font-weight-bold text-center textm">${parameter[i].RentState}</div>
            <div class="text-right"></div>  
          </div>
        

          </section>

    
                
            <ul class="list-group">
              <li class="list-group-item list-group-item-action">${parameter[i].OperationTel}</li>
              <li class="list-group-item list-group-item-action">${parameter[i].Address}</li>
              <li class="list-group-item list-group-item-action">${Pd}</li>
            </ul>



        </div>

        `;
          let localx = zonelocaltion[i][0];
          let localy = zonelocaltion[i][1];        
          map.setView(new L.LatLng(localx, localy),15);
        }

     }else if(Act!==undefined && Rent!==undefined){

                if(cct == city && tss== townss && Act == Actiss && Rnt == Rentss ){          
                  str += `
                    <div class="card mb-3 infocards" data-cards="${i}">

                    <h5 class="title m-4 h1">${parameter[i].Name}</h5> 

                    <section class="d-flex justify-content-between flex-direction-row"> 

                    <div class="px-2 py-1 m-3 text-left text-white mask-a w-50" data-adult="${i}">
                      運動場類型
                      <div class="font-weight-bold text-center textm">${Bgfl}</div>
                      <div class="text-right"></div>  
                    </div>  

                    
                    <div class="px-2 py-1 m-3 text-left text-white mask-c w-50" data-child="${i}">
                      收費類型
                      <div class="font-weight-bold text-center textm">${parameter[i].RentState}</div>
                      <div class="text-right"></div>  
                    </div>
                  

                    </section>

              
                          
                      <ul class="list-group">
                        <li class="list-group-item list-group-item-action">${parameter[i].OperationTel}</li>
                        <li class="list-group-item list-group-item-action">${parameter[i].Address}</li>
                        <li class="list-group-item list-group-item-action">${Pd}</li>
                      </ul>



                  </div>

                  `;
                    let localx = zonelocaltion[i][0];
                    let localy = zonelocaltion[i][1];        
                    map.setView(new L.LatLng(localx, localy),15);
                  
                  } 
                  // else if( Act == "" || Rnt == "" ){
                  //       str += `
                  //         <div class="card mb-3 infocards" data-cards="${i}">

                  //         <h5 class="title m-4 h1">${parameter[i].Name}</h5> 

                  //         <section class="d-flex justify-content-between flex-direction-row"> 

                  //         <div class="px-2 py-1 m-3 text-left text-white mask-a w-50" data-adult="${i}">
                  //           查無結果
                  //           <div class="font-weight-bold text-center textm">${parameter[i].GymFuncList}</div>
                  //           <div class="text-right"></div>  
                  //         </div>  

                          
                  //         <div class="px-2 py-1 m-3 text-left text-white mask-c w-50" data-child="${i}">
                  //           查無結果
                  //           <div class="font-weight-bold text-center textm">${parameter[i].RentState}</div>
                  //           <div class="text-right"></div>  
                  //         </div>
                        

                  //         </section>

                    
                                
                  //           <ul class="list-group">
                  //             <li class="list-group-item list-group-item-action">${parameter[i].OperationTel}</li>
                  //             <li class="list-group-item list-group-item-action">${parameter[i].Address}</li>
                  //             <li class="list-group-item list-group-item-action">${Pd}</li>
                  //           </ul>



                  //       </div>

                  //       `;
                  //     let localx = zonelocaltion[i][0];
                  //     let localy = zonelocaltion[i][1];        
                  //     map.setView(new L.LatLng(localx, localy),15);
                
                  // }

     }else if(Act == undefined && Rent !== undefined){

      if(cct == city && tss== townss && Act == Actiss){          
        str += `
          <div class="card mb-3 infocards" data-cards="${i}">

          <h5 class="title m-4 h1">${parameter[i].Name}</h5> 

          <section class="d-flex justify-content-between flex-direction-row"> 

          <div class="px-2 py-1 m-3 text-left text-white mask-a w-50" data-adult="${i}">
            運動場類型
            <div class="font-weight-bold text-center textm">${Bgfl}</div>
            <div class="text-right"></div>  
          </div>  

          
          <div class="px-2 py-1 m-3 text-left text-white mask-c w-50" data-child="${i}">
            收費類型
            <div class="font-weight-bold text-center textm">${parameter[i].RentState}</div>
            <div class="text-right"></div>  
          </div>
        

          </section>

    
                
            <ul class="list-group">
              <li class="list-group-item list-group-item-action">${parameter[i].OperationTel}</li>
              <li class="list-group-item list-group-item-action">${parameter[i].Address}</li>
              <li class="list-group-item list-group-item-action">${Pd}</li>
            </ul>



        </div>

        `;
          let localx = zonelocaltion[i][0];
          let localy = zonelocaltion[i][1];        
          map.setView(new L.LatLng(localx, localy),15);
        }
     }
//-----------------------------------------------------------------------------------------------------------------------------------------
      // if(Act!==undefined){

      //     if(cct == city && tss== townss && Act == Actiss){          
      //     str += `
      //       <div class="card mb-3 infocards" data-cards="${i}">

      //       <h5 class="title m-4 h1">${parameter[i].Name}</h5> 

      //       <section class="d-flex justify-content-between flex-direction-row"> 

      //       <div class="px-2 py-1 m-3 text-left text-white mask-a w-50" data-adult="${i}">
      //         運動場類型
      //         <div class="font-weight-bold text-center textm">${parameter[i].GymFuncList}</div>
      //         <div class="text-right"></div>  
      //       </div>  

            
      //       <div class="px-2 py-1 m-3 text-left text-white mask-c w-50" data-child="${i}">
      //         收費類型
      //         <div class="font-weight-bold text-center textm">${parameter[i].RentState}</div>
      //         <div class="text-right"></div>  
      //       </div>
          

      //       </section>

      
                  
      //         <ul class="list-group">
      //           <li class="list-group-item list-group-item-action">${parameter[i].OperationTel}</li>
      //           <li class="list-group-item list-group-item-action">${parameter[i].Address}</li>
      //           <li class="list-group-item list-group-item-action">${Pd}</li>
      //         </ul>



      //     </div>

      //     `;
      //       let localx = zonelocaltion[i][0];
      //       let localy = zonelocaltion[i][1];        
      //       map.setView(new L.LatLng(localx, localy),15);
      //     }
      //  }
      //  else{
      //   if(cct == city && tss== townss){        
      //     str += `
      //       <div class="card mb-3 infocards" data-cards="${i}">

      //       <h5 class="title m-4 h1">${parameter[i].Name}</h5> 

      //       <section class="d-flex justify-content-between flex-direction-row"> 

      //       <div class="px-2 py-1 m-3 text-left text-white mask-a w-50" data-adult="${i}">
      //         運動場類型
      //         <div class="font-weight-bold text-center textm">${parameter[i].GymFuncList}</div>
      //         <div class="text-right"></div>  
      //       </div>  

            
      //       <div class="px-2 py-1 m-3 text-left text-white mask-c w-50" data-child="${i}">
      //         收費類型
      //         <div class="font-weight-bold text-center textm">${parameter[i].RentState}</div>
      //         <div class="text-right"></div>  
      //       </div>
          

      //       </section>

      
                  
      //         <ul class="list-group">
      //           <li class="list-group-item list-group-item-action">${parameter[i].OperationTel}</li>
      //           <li class="list-group-item list-group-item-action">${parameter[i].Address}</li>
      //           <li class="list-group-item list-group-item-action">${Pd}</li>
      //         </ul>



      //     </div>

      //     `;
      //       let localx = zonelocaltion[i][0];
      //       let localy = zonelocaltion[i][1];  
      //       map.setView(new L.LatLng(localx, localy),15);
      //     }
      //  }
    //----------------------------------------------------------



  //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  }

  // if(str==""){
  //   str=`
  //   <div class="px-2 py-1 m-3 text-left text-white mask-a w-50" data-adult="${i}">
  //   查無結果
  //   `;
  // }

 // console.log(str)


  if(str==""){
   let nostr =`
      查無結果
    `;
    cont.innerHTML = nostr;
  }else{
    cont.innerHTML = str;
  }


//製作庫存狀態燈號

  let mask_a = document.querySelectorAll('.mask-a');  
  

  for(var i=0; i<mask_a.length; i++) {

    let adu=mask_a[i].dataset.adult;//用來捕捉資訊卡內的資料編號data-adult
    

      if(parameter[adu].mask_adult > 500)
      {
          mask_a[i].setAttribute('style', 'background-color: #4ecdc4');

      }
      else if (parameter[adu].mask_adult <= 500 && parameter[adu].mask_adult > 100)
      {
          mask_a[i].setAttribute('style', 'background-color: #ffe66d');
      }      
      else
      {
          mask_a[i].setAttribute('style', 'background-color: #ff6b6b');
      }
     
      
  }

  let mask_c = document.querySelectorAll('.mask-c');

  

  for(var i=0; i<mask_c.length; i++) {

     let chi=mask_c[i].dataset.child;

      if(parameter[chi].mask_child > 500)
      {
          mask_c[i].setAttribute('style', 'background-color: #4ecdc4');
      }
      else if (parameter[chi].mask_child <= 500 && parameter[chi].mask_child > 100)
      {
          mask_c[i].setAttribute('style', 'background-color: #ffe66d');
      }      
      else
      {
          mask_c[i].setAttribute('style', 'background-color: #ff6b6b');          
      }
     
      
  } 
 

}

//-------------------------------------------------------------------------------------------



//製作下拉式選單選項(縣市部分)

let Acti =document.querySelector('.jsActi');

selection_Acti();

let Rent =document.querySelector('.jsRent');

selection_Rent();






let area =document.querySelector('.jscounty');

function selection_county(parameter){

  // view
  for (let i = 0; i < parameter.length; i++) {


    const addoption = document.createElement('Option');
    addoption.textContent = parameter[i];
    addoption.setAttribute('value', parameter[i]);
    area.appendChild(addoption);

  }

}

area.addEventListener('change',gotocounty);

let parttown = [];

let cities = [];

let choosecounty;

function gotocounty(e){

  choosecounty = e.target.value;
  

  const datas = JSON.parse(loc.responseText);

  const dataL = datas.length;

  for(let i = 0; i < dataL;i++){

    if(choosecounty == datas[i].CityName){

      parttown.length=0;

      alladdress.length=0;

      cities.length=0;
      
      parttown.push(datas[i]);

      townlen = datas[i].AreaList;

      cities.push(townlen[0].AreaName);
   
    }  


  }

  pointinfo(zonedata,choosecounty,choosetown,chooseActi,chooseRent);

  selection_town(parttown);

  //callback(AciData,choosecounty,choosetown,chooseActi,chooseRent)
  changeqwer(AciData,choosecounty,choosetown,chooseActi,chooseRent,englishMounth)

  allClen(AciData,cktime,englishMounth,choosecounty)
}



//製作下拉式選單選項(鄉鎮區部分)

let alladdress = [];

let townlen;


let towns =document.querySelector('.jstown');


function selection_town(part){

  let str = `<option selected>鄉鎮區</option>`; 

  for(let i = 0; i < townlen.length; i++){


    alladdress.push(part[0].AreaList[i].AreaName);

    if(choosecounty!=='縣市'){    

    str+=`<option>${alladdress[i]}</option>`;

    }

  }

  towns.innerHTML = str;



}


towns.addEventListener('click', gototown);

let choosetown;

function gototown(e){

  choosetown = e.target.value;

  if(choosetown!=='鄉鎮區'){

  pointinfo(zonedata,choosecounty,choosetown,chooseActi,chooseRent);

  }

 

}

//----------------------------------------



function selection_Acti(part){
  let str = `<option selected>活動</option>`; 
  let allActi =["籃球","棒球","田徑","網球","躲避球","排球","羽球","足球"]
  // console.log(allActi[0])
  // console.log("selectActi正確執行")

  for(let i = 0 ; i<allActi.length;i++){
   
   
    // if(choosetown!=='鄉鎮區'){    

    // str+=`<option>${allActi[i]}</option>`;

    // }


    str+=`<option>${allActi[i]}</option>`;


  }

  Acti.innerHTML = str

}

Acti.addEventListener('click', gotoActi);

let chooseActi;

function gotoActi(e){
  // console.log("gotoacti響應")
  chooseActi = e.target.value;

  if(chooseActi=='活動'){
      // console.log("只是活動")
    }
    else{
      // console.log("gotoActi執行")
      pointinfo(zonedata,choosecounty,choosetown,chooseActi,chooseRent);
  //pointinfo(zonedata,choosecounty,choosetown);

  }

 
 

}
//Acti.addEventListener('click', gotoActi);


function selection_Rent(part){
  let str = `<option selected>收費模式</option>`; 
  let allRent =["付費","免費","不開放"]
  // console.log(allRent[0])
  // console.log("selectRent正確執行")

  for(let i = 0 ; i<allRent.length;i++){
   
   
    // if(choosetown!=='鄉鎮區'){    

    // str+=`<option>${allActi[i]}</option>`;

    // }


    str+=`<option>${allRent[i]}</option>`;


  }

  Rent.innerHTML = str

}

Rent.addEventListener('click', gotoRent);

let chooseRent;

function gotoRent(e){
//  console.log("gotoacti響應")
  chooseRent = e.target.value;

  if(chooseRent=='收費模式'){
      // console.log("只是收費")
    }
    else{
     // console.log("gotoRent執行")
      pointinfo(zonedata,choosecounty,choosetown,chooseActi,chooseRent);
  //pointinfo(zonedata,choosecounty,choosetown);

  }

 

}


//-------------------加入活動資訊-----------------------------

var AciData

var ahr

function Donl(params) {

 // console.log("啟動DONL，載入JSON資料至dd")

  ahr=new XMLHttpRequest();
//  xhr.open('get' ,"https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6");
  ahr.open('get' ,"../js/response_all.json");
  ahr.send(null)
  ahr.onload = function(){
     AciData = JSON.parse(this.responseText);
  }
}

Donl();




















//*---------------------------------新增toggle功能 抓取toggle值並加入日歷Clen-----



let jstoggle =document.querySelector('.switch-input');



var leftbottom=document.querySelector('.content')

var leftTop1=document.querySelector('.toggleA')
var leftTop2=document.querySelector('.toggleB')
var leftTop3=document.querySelector('.toggleC')
var leftTop4=document.querySelector('.toggleD')




var aa =document.querySelector('.asdf');


var bb =document.querySelector('.qwer');


var toggle = document.querySelector('.tog');

jstoggle.addEventListener('change',function(){callback(AciData,choosecounty,choosetown,chooseActi,chooseRent)})

var jsmap = document.querySelector('.jsmap')


var togglechange =0 


function callback(data,city,townss,Actiss,Rentss){
  togglechange ++
  if(togglechange%2==0){
    //console.log('Toggle關閉中')
    var intt = ``;
    aa.innerHTML = intt
    bb.innerHTML = intt
    
    
    jsmap.style.display='block';

    toggle.style.display='none'

    leftbottom.style.display='block'

    leftTop1.style.display='block'
    leftTop2.style.display='block'
    leftTop3.style.display='block'

    leftTop4.style.display='none'

 
  }else{
   // console.log('Toggle開啟中')
    
    toggle.style.display='block';
    toggle.style.display='flex';

    leftbottom.style.display='none'

    leftTop1.style.display='none'
    leftTop2.style.display='none'
    leftTop3.style.display='none'
    leftTop4.style.display='block'

    jsmap.style.display='none';

    changeqwer(data,city,townss,Actiss,Rentss);
    
    var str1 =`
    
            <div style="display:flex">
                <div id="container">
                <div id="header">
                  <div id="monthDisplay"></div>
                  <div>
                    <button id="backButton">Back</button>
                    <button id="nextButton">Next</button>
                  </div>
                </div>

                <div id="weekdays">
                  <div>Sunday</div>
                  <div>Monday</div>
                  <div>Tuesday</div>
                  <div>Wednesday</div>
                  <div>Thursday</div>
                  <div>Friday</div>
                  <div>Saturday</div>
                </div>

                <div id="calendar"></div>
                </div>

                <div id="newEventModal">
                <h2>New Event</h2>

                <input id="eventTitleInput" placeholder="Event Title" />

                <button id="saveButton">Save</button>
                <button id="cancelButton">Cancel</button>
                </div>

                <div id="deleteEventModal">
                <h2>Event</h2>

                <p id="eventText"></p>

                <button id="deleteButton">Delete</button>
                <button id="closeButton">Close</button>
                </div>

                <div id="modalBackDrop"></div>







                
                




              </div>
                `;

    aa.innerHTML = str1



  
    allClen(AciData,cktime,chooseMounth,choosecounty);
    

  }
   //console.log(togglechange)
}



changeqwer.load = bb.addEventListener('click',gotoright,true)

var cktime

function gotoright(e){
   let cardnum = e.target.dataset.cards;
   let texttext =AciData.data[cardnum].activityDateBegin
   
    let ckdate = texttext.split('/')

    var ckYear = parseInt(ckdate[0],10)+1911;
    var ckMouth = parseInt(ckdate[1])
    var ckday = parseInt(ckdate[2])
    
     cktime = ckMouth +"/" + ckday + "/" +ckYear

  //  console.log('gotoright的日期資料',cktime)
  //   console.log(cardnum)
  
   allClen(AciData,cktime,englishMounth,choosecounty);

}












let str2 ="";

function changeqwer(parameter,city,townss,Actiss,Rentss,Mounth){


  // console.log(Mounth)
  let str ="";

 // console.log('changeqwer的所選城市',city)

  let Pd = 1 
  let Bgfl ="Bgfl"
    
//----------

  for (let i = 0; i < parameter.data.length; i++) {

 

    let cct = parameter.data[i].activityCounty.match(city)
    
    let QwerActiDate = parameter.data[i].activityDateBegin.split('/');
    
    let QwerMounth = QwerActiDate[1]
    let QwerMounthInt = parseInt(QwerMounth)

    // let tss = parameter[i].Address.match(townss)
    // let Act = parameter[i].GymFuncList.match(Actiss)
    // let Rnt = parameter[i].RentState.match(Rentss)

    if(Mounth == undefined){

                            if(cct == city){       
                            str += `
                            <div class="card mb-3 bg-info infocards" data-cards="${i}">

                            <h5 class="title m-4 h1" style=" word-wrap & word-break" >${parameter.data[i].activityName}</h5> 

                            <section class="d-flex justify-content-between flex-direction-row"> 


                          

                            </section>


                                  
                              <ul class="list-group">
                                <li class="list-group-item list-group-item-action">電話：${parameter.data[i].activityContactTelNo}</li>
                                <li class="list-group-item list-group-item-action">舉辦方：${parameter.data[i].activityOrganizer}</li>
                                <li class="list-group-item list-group-item-action">舉辦日期：${parameter.data[i].activityDateBegin}</li>
                              </ul>



                            </div>
                            `;
                            }
    }else{
                          if(cct == city && QwerMounthInt == Mounth){       
                            str += `
                            <div class="card mb-3 bg-info infocards" data-cards="${i}">

                            <h5 class="title m-4 h1" style=" word-wrap & word-break" >${parameter.data[i].activityName}</h5> 

                            <section class="d-flex justify-content-between flex-direction-row"> 


                          

                            </section>


                                  
                              <ul class="list-group">
                                <li class="list-group-item list-group-item-action">電話：${parameter.data[i].activityContactTelNo}</li>
                                <li class="list-group-item list-group-item-action">舉辦方：${parameter.data[i].activityOrganizer}</li>
                                <li class="list-group-item list-group-item-action">舉辦日期：${parameter.data[i].activityDateBegin}</li>
                              </ul>



                            </div>
                            `;
                            }




    }


  }

  
  
  
  str2 = `
  <section class="content bg-w overflow-auto w-100 px-3 pt-3 mx-2" style="height:819px">
    ${str}
  </section>
  `;

  //console.log(str2)

  bb.innerHTML = str2


}







function changeBB(data,city,chosedate){
  
  let str=""
  
//------------------------日期轉換測試用-+---------------------------

              //將生日欄位從date型態轉成string, 以便針對/進行分割
            var birthday = data.data[0].activityDateBegin.split('/'); 
            // console.log(data.data[0].activityDateBegin)
            //取得民國年
            var year = parseInt(birthday[0],10)+1911;

            //取得月份
            var month = birthday[1];

            //取得日期
            var date = birthday[2];

            //將民國年月日的值指定給"生日"欄位
            var dd=year+"/"+month+"/"+date;
        
            

            var NDD = moment(dd).format("YYYY MM DD")
            
            
            
      //------------------------------------------------------------
           
            var NChoseD = moment(chosedate).format("YYYY MM DD")
  
            let CC = NDD.match(NChoseD)




// //-------------將日歷的格式MM-DD-YYYY更改為 YYYY-MM-DD------------

  var NChoseD = moment(chosedate).format("YYYY MM DD")


   for (let i = 0; i < data.data.length; i++) {

      //------------------將民國換成西元---------------------
            //將生日欄位從date型態轉成string, 以便針對/進行分割
            var birthday = data.data[i].activityDateBegin.split('/'); 
          
            //取得民國年
            var year = parseInt(birthday[0],10)+1911;

            //取得月份
            var month = birthday[1];

            //取得日期
            var date = birthday[2];

            //將民國年月日的值指定給"生日"欄位
            var dd=year+"/"+month+"/"+date;
        

            var NDD = moment(dd).format("YYYY MM DD")
      //------------------------------------------------------------
            let CC = NDD.match(NChoseD)

            if(CC==NDD && data.data[i].activityCounty==city ){

              str += `
              <div class="card mb-3 bg-info infocards" data-cards="${i}">
         
              <h5 class="title m-4 h1" style=" word-wrap & word-break" >${data.data[i].activityName}</h5> 
         
              <section class="d-flex justify-content-between flex-direction-row"> 
         
         
            
         
              </section>
         
         
                    
                <ul class="list-group">
                  <li class="list-group-item list-group-item-action">電話：${data.data[i].activityContactTelNo}</li>
                  <li class="list-group-item list-group-item-action">舉辦方：${data.data[i].activityOrganizer}</li>
                  <li class="list-group-item list-group-item-action">舉辦日期：${data.data[i].activityDateBegin}</li>
                </ul>
         
         
         
              </div>
              `;

            }

     
   } 
        if(str==""){
          str=`<div style="back-ground=blue">查無結果</div>`
        }

         str2 = `
              <section class="content bg-w overflow-auto w-100 px-3 pt-3 mx-2" style="height:819px;width 100px">
                ${str}
              </section>
        `;
        bb.innerHTML = str2


  

}




//---製作選擇月份後分類活動資訊的效果--//

//-選擇器選擇 HTML  class jsMounth
var SelectorjsMounth = document.querySelector('.jsMounth')

SelectorjsMounth.addEventListener('change',gotoMounth)

var englishMounth;


function gotoMounth(e){

 

  var chooseMounth = e.target.value;
  



  if(chooseMounth == '月份'){
        //--Do nothing
  }else{

    //--中文月份轉換
          switch (chooseMounth) {
              case '一月':
                englishMounth = 1;
                break;
              case '二月':
                englishMounth = 2;
                break;
              case '三月':
                englishMounth = 3;
                break;
              case '四月':
                englishMounth = 4;
                break;
              case '五月':
                englishMounth = 5;
                break;
              case '六月':
                englishMounth = 6;
                break;
              case '七月':
                englishMounth = 7;
                break;
              case '八月':
                englishMounth = 8;
                break;
                case '九月':
                  englishMounth = 9;
                  break;
                case '十月':
                  englishMounth = 10;
                  break;
                case '十一月':
                  englishMounth = 11;
                  break;
                case '十二月':
                  englishMounth = 12;
                  break;
            default:
              console.log(`Sorry, 月份出問題啦!!!!!!`);
          }
        console.log('月份',englishMounth)

      changeqwer(AciData,choosecounty,choosetown,chooseActi,chooseRent,englishMounth)

      allClen(AciData,cktime,englishMounth,choosecounty)
  }

}










































































/*----------------------------------------------行事曆製作-------------------------------------------------*/

function allClen(data,cktime,chooseMouth,choosecounty){

      // var birthday = data.data[3].activityDateBegin.split('/'); 
     
      // //取得民國年
      // var year = parseInt(birthday[0],10)+1911;

      // //取得月份
      // var month = birthday[1];

      // //取得日期
      // var date0 = birthday[2];

      // //將民國年月日的值指定給"生日"欄位
      // var dd=year+"/"+month+"/"+date0;

      // console.log('allClen的轉換過的西元日期值',dd)  
      
      // var NDD = moment(date0).format("DD")

      
      // console.log('allClen NDD的值',NDD)
//-----------------------------------------------------------------------

      let nav = 0;
      let clicked = null;
      let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

      const calendar = document.getElementById('calendar');
      const newEventModal = document.getElementById('newEventModal');
      const deleteEventModal = document.getElementById('deleteEventModal');
      const backDrop = document.getElementById('modalBackDrop');
      const eventTitleInput = document.getElementById('eventTitleInput');
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      function openModal(date) {
        clicked = date;
        
        changeBB(AciData,choosecounty,clicked)




        const eventForDay = events.find(e => e.date === clicked);


        // if (eventForDay) {
        //   document.getElementById('eventText').innerText = eventForDay.title;
        //   deleteEventModal.style.display = 'block';
        // } else {
        //   newEventModal.style.display = 'block';
        // }

        // backDrop.style.display = 'block';
      }



      function Clenload() {
        const dt = new Date();

        if (nav !== 0) {
          dt.setMonth(new Date().getMonth() + nav);
         }


        

        if(chooseMouth !== undefined){

          var x = new Date().getMonth();
          var xtype = typeof(x)
          var mtype = typeof(chooseMouth)
          console.log('allclen裡面的getMounth :',x)
          console.log('x的type :',xtype)

          console.log('allclen裡面的:chooseMonth',chooseMouth)
          console.log('m的type :',mtype)

          if(x < chooseMouth){ 
            
            console.log('x<ch')

              var xxx = Math.abs(chooseMouth - x) -1         
              dt.setMonth(new Date().getMonth() + xxx);
          }
  
          else if(chooseMouth < x )
          {

              console.log('x>choose',x,'>',chooseMouth)
              var xxx = Math.abs(x-chooseMouth)+1
              // console.log('xxx:',xxx) 
              // var mmm =dt.setMonth(new Date().getMonth() - xxx);
              // console.log('setmonth',mmm)
              dt.setMonth(new Date().getMonth() - xxx);
          }       
           else if(x = chooseMouth)
          {
            console.log('x=ch')
            dt.setMonth(new Date().getMonth()-1)
          }

        }


        const day = dt.getDate();
        const month = dt.getMonth();
        const year = dt.getFullYear();

        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
          weekday: 'long',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        });
        const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

        document.getElementById('monthDisplay').innerText = 
          `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

        calendar.innerHTML = '';


        console.log('AllClen 裡面的 cktime',cktime)





        for(let i = 1; i <= paddingDays + daysInMonth; i++) {  
          //let NNN = 
          const daySquare = document.createElement('div');
          daySquare.classList.add('day');

          const dayString = `${month + 1}/${i - paddingDays}/${year}`;


          if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;
         

            if (dayString == cktime){
               daySquare.id = 'currentDay';
            }
              for(let j = 0; j < data.data.length;j++){
                
                var birthday = data.data[j].activityDateBegin.split('/'); 

                //取得民國年
                var DataYear = parseInt(birthday[0],10)+1911;
                //取得月份
                var DataMonth = birthday[1];

                var monthInt =parseInt(DataMonth) 

                //取得日期
                var date0 = birthday[2];

                var date0Int = parseInt(date0)

                var bigD = monthInt+"/"+date0Int+"/"+DataYear

                var jcity = data.data[j].activityCounty

                if (dayString == bigD & choosecounty == jcity) {
                  daySquare.id = 'currentDay';




                  // console.log('dayString==bigD')       
                    
              }


              }
                                                                                        
                                                                                      

                                            //   var birthday = data.data[j].activityDateBegin.split('/'); 




                                            //   //取得民國年
                                            //   var DataYear = parseInt(birthday[0],10)+1911;
                                            //   //取得月份
                                            //   var DataMonth = birthday[1];

                                            //   var monthInt =parseInt(DataMonth) 

                                            //   //取得日期
                                            //   var date0 = birthday[2];

                                            //   var date0Int = parseInt(date0)
                                            

                                            //   var bigD = monthInt+"/"+date0Int+"/"+DataYear

                                            //   // console.log('Daystring:',dayString)
                                             
                                            //    if (dayString == bigD) {
                                            //     daySquare.id = 'currentDay';
                                            //                         // const eventDiv = document.createElement('div');
                                            //                         // eventDiv.classList.add('event');
                                            //                         // eventDiv.innerText = "456";
                                            //                         // daySquare.appendChild(eventDiv);




                                            //      console.log('dayString==bigD')       
                                            //     }
                                            

                                            // }











            const eventForDay = events.find(e => e.date === dayString);


            if (eventForDay) {
              const eventDiv = document.createElement('div');
              eventDiv.classList.add('event');
              eventDiv.innerText = eventForDay.title;
              daySquare.appendChild(eventDiv);
            }

            daySquare.addEventListener('click', () => openModal(dayString));

          } else {
            daySquare.classList.add('padding');
          }

          calendar.appendChild(daySquare);    
        }
      }


      
      function closeModal() {
        eventTitleInput.classList.remove('error');
        newEventModal.style.display = 'none';
        deleteEventModal.style.display = 'none';
        backDrop.style.display = 'none';
        eventTitleInput.value = '';
        clicked = null;
        Clenload();
      }

      function saveEvent() {
        if (eventTitleInput.value) {
          eventTitleInput.classList.remove('error');

          events.push({
            date: clicked,
            title: eventTitleInput.value,
          });

          localStorage.setItem('events', JSON.stringify(events));
          closeModal();
        } else {
          eventTitleInput.classList.add('error');
        }
      }

      function deleteEvent() {
        events = events.filter(e => e.date !== clicked);
        localStorage.setItem('events', JSON.stringify(events));
        closeModal();
      }

      function initButtons() {
        document.getElementById('nextButton').addEventListener('click', () => {
          nav++;
          Clenload();
        });
        
        document.getElementById('backButton').addEventListener('click', () => {
          nav--;
          Clenload();
        });

        document.getElementById('nextButton').style.display = 'none';
        document.getElementById('backButton').style.display = 'none';


        document.getElementById('saveButton').addEventListener('click', saveEvent);
        document.getElementById('cancelButton').addEventListener('click', closeModal);
        document.getElementById('deleteButton').addEventListener('click', deleteEvent);
        document.getElementById('closeButton').addEventListener('click', closeModal);
      }

      initButtons();
      Clenload();
  
 }
  
//------------------------------行事曆---------------------------------------------------------