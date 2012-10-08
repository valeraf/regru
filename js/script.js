var videos = new Array();

function formatTime(seconds){
	var minutes, seconds, hours;
	seconds = parseInt(seconds);
	minutes = Math.floor(seconds/60);
	seconds = seconds - (minutes*60);
	hours = Math.floor(minutes/60);
	minutes = minutes - (hours*60);
	if(minutes < 10){
	    minutes = '0'+minutes;
	}
	if(seconds < 10){
		seconds = '0'+seconds;
	}
	return hours + ':' + minutes + ':' + seconds;
}
function getYouTubeVideo(url, id, title){
	return '<div id=\"movie_' + id + '\" class=\"activemovie\"><h3>'+ title +'</h3><object width=\"745\" height=\"448\"><param name=\"wmode\" value=\"opaque\" /><param name=\"movie\" value=' + url + ' /><param name=\"allowFullScreen\" value=\"true\" /><param name=\"allowscriptaccess\" value=\"always\" /><embed src=' + url + ' type=\"application/x-shockwave-flash\" allowscriptaccess=\"always\" allowfullscreen=\"true\" width=\"745\" height=\"448\" wmode=\"opaque\"></embed></object></div>';
}
function changeVideo(url, id, title){
	var code = getYouTubeVideo(url, id, title);
	$('#video').html(code);
	$('html, body').animate({
		scrollTop: $('#video').offset().top
	}, 'slow');	
}
function showVideos(data) {
	var feed, entries, list_elements, i, code;
	feed = data.feed;
	entries = feed.entry || [];
	list_elements = '';
    for (i = 0; i < entries.length; i++) {
		var entry, id, playerUrl, id_clear, title, uploader, time, thumbnailUrl, thumb, stat, uploader, date, item_date, item_link, list, text, last_digit;
		text = '';
    	entry = entries[i];
		id = entry.id.$t;
		playerUrl = entries[i].media$group.media$content[0].url;
		id_clear = id.split('http://gdata.youtube.com/feeds/videos/')[1];
		videos['#movie_'+id_clear] = entry;
    	title = entry.title.$t;
		uploader = entry.author.name;
		time = entries[i].media$group.yt$duration.seconds;
    	thumbnailUrl = entries[i].media$group.media$thumbnail[0].url;
		thumb = '<span class="thumbnail_wrapper"><img src="'+ thumbnailUrl +'" alt="'+ title +'" title="'+ title +'" /><time>'+ formatTime(time) +'</time></span>';	
		stat = entry.yt$statistics.viewCount;
		last_digit = stat.substring( stat.length-2 , stat.length );
		if (last_digit >= 11 && last_digit <= 20){
			text = 'просмотров'
		}
		else{
			last_digit = stat.substring( stat.length-1 , stat.length );
			if(last_digit >= 5 || last_digit == 0){text = 'просмотров'}
			if(last_digit == 1){text = 'просмотр'}
			if(last_digit >= 2 && last_digit < 5){text = 'просмотра'}
		}		
		uploader = entry.author[0].name.$t;
		moment.lang('ru');
		item_date = moment(entry.published.$t).format('LL');
		item_link = '<a href="#movie_'+ id_clear +'" class="clearfix" title="'+ title +'">'+ thumb +'<span class="wrap"><strong>'+ title +'</strong><span class="author">'+ uploader +'</span><span class="date">'+ item_date +'</span><span class="viewCount">'+ stat +' '+ text  +'</span></span></a>'
		list_elements += '<li>'+ item_link +'</li>';
	}
  	list = '<ul>'+ list_elements +'</ul>';
	$('#video_list').html(list);
  
	if (entries.length > 0) {
		var video_entry = entries[0];
		if(window.location.hash != '' && videos[window.location.hash] != undefined){
			video_entry = videos[window.location.hash];
		}
		code = getYouTubeVideo(video_entry.media$group.media$content[0].url, video_entry.id.$t.split('http://gdata.youtube.com/feeds/videos/')[1], video_entry.title.$t);
		$('#video').html(code);
  	}
  
}

$(document).ready(function() {	
	$('#preloader').hide();
		$('#video_list li a').click(function(){	
		var title, movie_id, url;	
		title = $(this).find('strong').text();
		movie_id = $(this).attr('href').split('#movie_')[1];
		url = 'http://www.youtube.com/v/'+movie_id;
		changeVideo(url, movie_id, title);
	});
});
