const socket = io();

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
    map.setView([latitude, longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }else{
        markers[id]= L.marker([latitude,longitude]).addTo(map)
    }
})

socket.io("user-disconnected", (id) =>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})