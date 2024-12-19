const socket = io();

// import * as url from"file!./../image/facebook.png";
if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position) =>{
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", {latitude, longitude});
        },
        (error) =>{
            console.log(error)
        },
        {
            enableHighAccuracy: true,
            maximumAge:0,
            timeout:500,
        }
    );
}

const map = L.map("map").setView([0,0],26)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const markers = {}

socket.on("receive-location", (data)=>{
    const {id, latitude, longitude} = data;
    let myPopup = `
    <h4>Hi Rajesh Saha </h4> <hr/><br/>
    <a href="https://www.facebook.com/" title="facebook icons"> <img src='https://scontent.fccu11-1.fna.fbcdn.net/v/t39.30808-6/380700650_10162533193146729_2379134611963304810_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=naEUfKPu9CIQ7kNvgFnrpip&_nc_zt=23&_nc_ht=scontent.fccu11-1.fna&_nc_gid=Aq8duOlOhClxvjQSBhWNlPy&oh=00_AYDBNbClQ_EE6qaLettp1pJIyubovMZtA5Maq2mY_swwfg&oe=6769DB7E' alt='maptime logo gif' height='30px' width='30px'/></a>

     <a href="https://www.instagram.com/" title="facebook icons"> <img src='https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg' alt='maptime logo gif' height='30px' width='30px'/></a>

     <a href="/chat" title="facebook icons"> <img src='https://d29fhpw069ctt2.cloudfront.net/icon/image/37750/preview.svg' alt='maptime logo gif' height='30px' width='30px'/></a>

      <a href="/aankhmaro" title="facebook icons"> <img src='https://i.pinimg.com/originals/9f/d7/b0/9fd7b0c0bd4927a39e66c4e43b40b8e6.gif' alt='maptime logo gif' height='40px' width='40px'/></a>
    `;
    var customPopup = "<b>My office</b><br/><img src='http://netdna.webdesignerdepot.com/uploads/2014/05/workspace_06_previo.jpg' alt='maptime logo gif' width='150px'/>";
  
    map.setView([latitude, longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }else{
        markers[id]= L.marker([latitude,longitude]).addTo(map).bindPopup(myPopup).openPopup()
    }
})

socket.io("user-disconnected", (id) =>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})