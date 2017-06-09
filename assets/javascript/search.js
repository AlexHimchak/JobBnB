$("#user-search-button").click(function(event) {
    event.preventDefault();
    var zip = $('#user-zip-code').val();
    var search = $('#user-job-title').val();

    jobSearch(zip, search, 0, 10);
    $('.jbnb-results').show();
});

// http://api.indeed.com/ads/apisearch?publisher=4604260559721605&v=2&q=java&format=json
function jobSearch(myLocation, searchTerm, start, end) {
    $.ajax({
        cache: false,
        data: $.extend({
            publisher: '4604260559721605',
            v: '2',
            format: 'json',
            q: searchTerm,
            l: myLocation,
            radius: 25,
            sort: 'date',
            limit: 10,
            highlight: 1,
            filter: 1,
            pageNumber: 2,
            latlong: 1,
        }, {
            start: start,
            end: end
        }),
        dataType: 'jsonp',
        type: 'GET',
        timeout: 5000,
        url: 'https://cors.now.sh/http://api.indeed.com/ads/apisearch'
    })
    .done(function(searchTerm) {
    	console.log(searchTerm);
    	jobs = [];
    	$('.jbnb-results__number').text(searchTerm.totalResults);
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
                // latitude: item.latitude, 
                // longitude: item.longitude, 
                snippet: item.snippet,
                url: "<a href=" + item.url + " target='_blank'>Visit Job</a>",
                age: item.formattedRelativeTime
            }

            jobs.push(job);


        });

        initMap();
        console.log('done!')
        makeTable();
        makePagination(searchTerm.totalResults);
    });
}

function makeTable() {
	//console.log('maketable')
	$("tbody").empty();
	//console.log(jobs);
    for (var i = 0; i < jobs.length; i++) {
        var row = $("<tr>");
        for (var propt in jobs[i]) {
        	if(propt !='snippet'){
        		row.append("<td>" + jobs[i][propt] + "</td>")
        	}
        }
        //console.log('row', row);
        $("tbody").append(row);
        $("td").addClass("mdl-data-table__cell--non-numeric");
    };
};

var paginationLength;
var currentPagination = 0;
var nextJobShow = true;
var previousJobShow = false;

function makePagination(totalResults){
	console.log('make pagination!');
	$('.jbnb-pagination__next-jobs').css('visibility', 'visible');
	paginationLength = Math.ceil(totalResults/10);
}

$('.jbnb-pagination__previous-jobs').on('click', function(event){
	event.preventDefault();
	currentPagination--;
	jobSearch($('#user-zip-code').val(), $('#user-job-title').val(), currentPagination*10, currentPagination*10+10);
	

	if(currentPagination === 0){
		$(this).css('visibility', 'hidden');
		previousJobShow = false;
	}
	if(nextJobShow){
		$('.jbnb-pagination__next-jobs').css('visibility', 'visible');
	}
})
$('.jbnb-pagination__next-jobs').on('click', function(event){
	event.preventDefault();
	currentPagination++;
	jobSearch($('#user-zip-code').val(), $('#user-job-title').val(), currentPagination*10, currentPagination*10+10);
	
	if(!previousJobShow ){
		$('.jbnb-pagination__previous-jobs').css('visibility', 'visible');
		previousJobShow = true;
	}
	if(currentPagination === paginationLength){
		$(this).css('visibility', 'hidden');
		nextJobShow = false;

	}
})
