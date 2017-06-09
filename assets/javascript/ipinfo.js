// grabs the ip address from user and prefills the zip code field for better ux
var zipCode = 92129;
$.getJSON('https://ipinfo.io', function(data) {
    console.log(data);
    zipCode = data.postal;
    $('#user-zip-code').val(data.postal);
});

function getPostalCode(){
	return zipCode;
}