
var zip = $("#zip-input");
var searchTerm = $("#search-term");
var map;
var latitude = [];
var long = [];
var initialMapP = 0;
var jobs = [];
var job;
var marker=[];
var preNum = 12;
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

$("#user-search-button").click(function(event) {
  event.preventDefault();
  var zip = $('#user-zip-code').val();
  var search = $('#user-job-title').val();

  jobSearch(zip, search);
});
function jobSearch(myLocation, searchTerm) {
  $.ajax({
      cache: false,
      data: $.extend({
        publisher: '4604260559721605',
        v: '2',
        format: 'json',
        q: searchTerm,
        l: myLocation,
        radius: 25,
        limit: 10,
        sort: 'date',
        highlight: 1,
        filter: 1,
        latlong: 1,
      }, {
        start: 0,
        end: 10
      }),
      dataType: 'jsonp',
      type: 'GET',
      timeout: 5000,
      url: 'https://cors.now.sh/http://api.indeed.com/ads/apisearch'
    })
    .done(function(searchTerm) {
      $.each(searchTerm.results, function(i, item) {
          // console.log(item);
          // console.log(item.jobtitle);
          // console.log(item.company);
          // console.log(item.longitude);
          // console.log(item.latitude);
          // console.log(item.url);
          // console.log(item.snippet);
          // console.log(item.date);
          // console.log(item.formattedRelativeTime);
          // console.log(item.expired);
          var templat = parseFloat(item.latitude)
          latitude.push(templat);
          // console.log(latitude);
          var templong = parseFloat(item.longitude)
          long.push(templong);
          // console.log(long)
          var job = {
              jobtitle: item.jobtitle, 
              company: item.company, 
              snippet: item.snippet,
              // latitude: item.latitude, 
              // longitude: item.longitude, 
              url: "<a href="+item.url+" target='_blank'>Visit Job</a>",
              age: item.formattedRelativeTime
          }
          jobs.push(job);
      });
      initMap();
      function makeTable(){
        for (var i = 0; i < jobs.length; i++){
          var row = $("<tr>");
          for(var propt in jobs[i]){
            row.append("<td>"
            + jobs[i][propt] + "</td>")
          }
          console.log('row', row);
          $("tbody").append(row);
          $("td").addClass("mdl-data-table__cell--non-numeric");
        }; 
      };
      makeTable();
    });
}


  function initMap() {

    if (initialMapP === 0){
      var myLatLng = {lat: 32.7157, lng: -117.1611};
      initialMapP++;
    }
    else {
  
    var myLatLng = {lat: latitude[0], lng: long[0]};
  }
    var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 9,
          center: myLatLng
      });
    
     for (var i = 0; i < latitude.length; i++) {
      	myLatLng = {lat: latitude[i], lng: long[i]};
         marker[i] = new google.maps.Marker({
           position: myLatLng,
           map: map,
           animation: google.maps.Animation.DROP,
           title: jobs[i].company,
           //label: labels[labelIndex++ % labels.length],
           icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
           


        });
         marker[i].index = i;
        
        google.maps.event.addListener(marker[i], 'click', function() {
          console.log('marker click, this is...', this);
          map.panTo(marker[this.index].getPosition());

            //marker[this.index].setAnimation(google.maps.Animation.BOUNCE);
          

            map.setZoom(10);
            map.setCenter(this.getPosition());


            var infowindow = new google.maps.InfoWindow({
              content: '<div id="infowindow">'+"<strong>"+jobs[this.index].company + "</strong>" + "<br>" + jobs[this.index].jobtitle + "<br>" + jobs[this.index].snippet + "<br>" + jobs[this.index].url + "</div>",
              maxWidth: 200
            });
             
            infowindow.open(this.get('map'), this);

           
       

        });
            

   }

}


   