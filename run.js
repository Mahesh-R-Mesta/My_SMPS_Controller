var http = new XMLHttpRequest();
const url = "https://api.thingspeak.com/talkbacks/43095/commands/25182793.json";
const msgUrl = "http://api.thingspeak.com/talkbacks/43095/commands/25369986.json";
const key = "C94O4KU69G4SXK7H";

async function getRequest(requestUrl,callback){
    http.onreadystatechange = ()=>{
    if(http.status == 200) {
        console.log(http.responseText);
        if(callback!=undefined) callback(http.responseText);
        }
    }
    http.open("GET",requestUrl);
    http.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
    http.send();
}

function putRequest(requestUrl,callback){
    http.onreadystatechange = ()=>{
       if(http.status==200){
           console.log(http.responseText);
        if(callback!=undefined) callback(JSON.parse(http.statusText))
       }
    }
    http.open("PUT",requestUrl);
    http.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
    http.send()
}

function extractMyData(data){
    let jsonData = JSON.parse(data);
    if(jsonData["command_string"] != undefined){
        let extractedData = jsonData["command_string"].split('\\').join();
        console.log(extractMyData);
        let finalData = JSON.parse(extractedData); 
        return finalData;
    }   
}

var mapData = { 
    state:"0",
    Br:"255",
    L1:"1",
    L2:"0",
    L3:"0",
    L4:"Happy Coding"
}
function doVisibleChange(button ,condition){
    if(condition){
        button.value = "OFF";
        button.style.color = "red"
    }
    else{
        button.value = "ON";
        button.style.color = "blue"
    }
}

function setButtonStyle(button12,title,state){
button12.value = title;
if(state){
    button12.style.backgroundColor = "blue";
    button12.style.color = "white"
} else {
    button12.style.backgroundColor = "white";
    button12.style.color = "black"
}
}


function initCommandConfig(command){
    const command1 = document.getElementById('config1');
    const command2 = document.getElementById('config2');
    const command3 = document.getElementById('config3');
    const command4 = document.getElementById('config4');
    setButtonStyle(command1,"Small-font",false);
    setButtonStyle(command2 ,"showMSG",false);
    setButtonStyle(command3,"showTime",false);
    setButtonStyle(command4,"netScan",false);
    switch(command){
        case "<T1>": {
            setButtonStyle(command1,"Large-font",true);
        }
        break;
        case "<T2>":{
            setButtonStyle(command1,"Small-font",true);
        }
        break;
        case "<show>":{
            setButtonStyle(command2,"hideMSG",true);
        }
        break;
        case "<Time>":{
            setButtonStyle(command3,"hideTime",true);
        }
        break;
        case "<nets>":{
            setButtonStyle(command4,"stopScan",true);
        }
        break;
    }
}



window.onload =()=>{
    getRequest(url+"?api_key="+key, function(myData){
        let data = extractMyData(myData);
        const button = document.getElementById('button1');
        const button2 = document.getElementById('button2');
        const button3 = document.getElementById('button3');
        const button4 = document.getElementById('button4');
        const slider = document.getElementById('slide');
        const textField = document.getElementById('textField');
        doVisibleChange(button,data["state"]=="0");
        doVisibleChange(button2,data["L1"]=="0");
        doVisibleChange(button3,data["L2"]=="0");
        doVisibleChange(button4,data["L3"]=="0");
        slider.value = data["Br"];
        mapData = data;
        const command = data["L4"];
        initCommandConfig(command);
    });
}


function settingButtons(){
    const command1 = document.getElementById('config1');
    const command2 = document.getElementById('config2');
    const command3 = document.getElementById('config3');
    const command4 = document.getElementById('config4');
    command1.addEventListener('click',()=>{
        let lastCommand = mapData.L4;
        mapData.L4 = command1.value == "Small-font" ? "<T2>" : "<T1>";
        setButtonStyle(command1,command1.value == "Small-font" ? "Large-font":"Small-font", command1.value == "Small-font" ? true:false);
        putRequest(url+"?api_key="+key+"&command_string="+JSON.stringify(mapData) +"&position="+"2");
        setTimeout(()=>{
            mapData.L4 = lastCommand;
            putRequest(url+"?api_key="+key+"&command_string="+JSON.stringify(mapData) +"&position="+"2");
        },3000);
    });

    command2.addEventListener('click',()=>{
        mapData.L4 = command2.value == "showMSG" ? "<show>":"nup";
        putRequest(url+"?api_key="+key+"&command_string="+JSON.stringify(mapData) +"&position="+"2");
        setButtonStyle(command2,command2.value == "hideMSG" ? "showMSG" : "hideMSG",command2.value == "hideMSG" ? false:true);
    });

    command3.addEventListener('click',()=>{
        mapData.L4 = command3.value == "showTime" ? "<Time>":"nup";
        putRequest(url+"?api_key="+key+"&command_string="+JSON.stringify(mapData) +"&position="+"2");
        setButtonStyle(command3,command3.value == "hideTime" ? "showTime" : "hideTime", command3.value == "hideTime" ? false:true);
    });

    command4.addEventListener('click',()=>{
        mapData.L4 = command4.value == "netScan" ? "<nets>":"nup";
        putRequest(url+"?api_key="+key+"&command_string="+JSON.stringify(mapData) +"&position="+"2");
        setButtonStyle(command4,command4.value == "stopScan" ? "netScan" : "stopScan", command4.value == "stopScan" ? false:true);
    });
}





document.addEventListener('DOMContentLoaded', function() {
    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');
    const button3 = document.getElementById('button3');
    const button4 = document.getElementById('button4');
    const slider = document.getElementById('slide');
    const input = document.getElementById('textField');
    const sendCommand = document.getElementById('send');
    button1.addEventListener('click', function() {
        getRequest(url+"?api_key="+key, function(myData){
            let data = extractMyData(myData.toString().trim());
            mapData = data;
            mapData.state = data["state"]=="0" ? "1" : "0";
            putRequest(url+"?api_key="+key+"&command_string="+JSON.stringify(mapData) +"&position="+"2");
            doVisibleChange(button1,mapData.state=="0")
        }); },false);

    button2.addEventListener('click',function(){
        getRequest(url+"?api_key="+ key,function(myData){
            let data = extractMyData(myData);
            mapData = data;
            mapData.L1 = data["L1"] == "0" ? "1" : "0";
            putRequest(url+"?api_key="+key+"&command_string="+JSON.stringify(mapData) +"&position="+"2");
            doVisibleChange(button2,mapData.L1=="0")
        }); },false);
    
    button3.addEventListener('click',function(){
        getRequest(url+"?api_key="+ key, function(myData){
            let data = extractMyData(myData);
            mapData = data;
            mapData.L2 = data["L2"] == "0" ? "1" : "0";
            putRequest(url+"?api_key="+key+"&command_string="+JSON.stringify(mapData) +"&position="+"2");
            doVisibleChange(button3,mapData.L2=="0")
        }); },false);

    slider.addEventListener('click',function(){
        getRequest(url+"?api_key="+ key, function(myData){
            let data = extractMyData(myData);
            if(slider.value!= data["Br"])
            {
                mapData = data;
                mapData.Br = slider.value;
                putRequest(url+"?api_key="+key+"&command_string="+JSON.stringify(mapData) +"&position="+"2");
            }
        }); },false);

    button4.addEventListener('click',function(){
        getRequest(url+"?api_key="+ key, function(myData){
            let data = extractMyData(myData);
            mapData = data;
            mapData.L3 = data["L3"]=="0" ? "1" : "0";
            putRequest(url+"?api_key="+key+"&command_string="+JSON.stringify(mapData) +"&position="+"2");
            doVisibleChange(button4,mapData.L3=="0");
        });
    })
    
    sendCommand.addEventListener('click',()=>{
        putRequest(msgUrl+"?api_key="+key+"&command_string="+input.value+"&position="+"3");
    });
    settingButtons();
  }, false);