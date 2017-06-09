var zip = $("#zip-input");
var searchTerm = $("#search-term");
var map;
var latitude = [];
var long = [];
var initialMapP = 0;
var jobs = [];
var job;
var marker = [];
var preNum = 12;
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var index2 = 0;

initMap();

function initMap() {
    marker = [];


    if (initialMapP === 0) {
        var myLatLng = { lat: 32.7157, lng: -117.1611 };
        initialMapP++;
    } else {

        var myLatLng = { lat: latitude[0], lng: long[0] };

    }
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: myLatLng
    });

    for (var i = 0; i < latitude.length; i++) {
        myLatLng = { lat: latitude[i], lng: long[i] };
        marker[i] = new google.maps.Marker({
            position: myLatLng,
            map: map,
            animation: google.maps.Animation.DROP,
            title: jobs[i].company,
            //label: labels[labelIndex++ % labels.length],
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'



        });

        marker[i].index = i;
        var infowindow = null;

        google.maps.event.addListener(marker[i], 'click', function() {
        
          //console.log('marker click, this is...', this);
          map.panTo(marker[this.index].getPosition());
            
            if (infowindow) {
              infowindow.close();
            }
            
           
            map.setZoom(10);
            map.setCenter(this.getPosition());

           
            infowindow = new google.maps.InfoWindow({
              content: "<strong>" + jobs[this.index].jobtitle + "<br><i>" + jobs[this.index].company + "</i></strong><br>" + jobs[this.index].snippet + "<br>" + jobs[this.index].url,
              maxWidth: 200
            });
            
            infowindow.open(this.get('map'), this);
            marker[this.index].setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
            
               
        });

    }
    latitude = [];
    long = [];
}