$.videos = new Array();

$.formatTime = function(seconds){
	seconds = parseInt(seconds);
	var minutes = Math.floor(seconds/60);
	seconds = seconds - (minutes*60);
	var hours = Math.floor(minutes/60);
	minutes = minutes - (hours*60);
	return hours + ':' + minutes + ':' + seconds;
}

$.changeVideo = function(url, id, title){
	var code = '<div id=\"movie_' + id + '\" class=\"activemovie\"><h3>'+ title +'</h3><object width=\"745\" height=\"448\"><param name=\"wmode\" value=\"opaque\" /><param name=\"movie\" value=' + url + ' /><param name=\"allowFullScreen\" value=\"true\" /><param name=\"allowscriptaccess\" value=\"always\" /><embed src=' + url + ' type=\"application/x-shockwave-flash\" allowscriptaccess=\"always\" allowfullscreen=\"true\" width=\"745\" height=\"448\" wmode=\"opaque\"></embed></object></div>';
		$('#video').html(code);
		$('html, body').animate({
			scrollTop: $('#video').offset().top
		}, 'slow')
	
}

function showVideos(data) {
  var feed = data.feed;
  var entries = feed.entry || [];
  var list_elements = '';
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
	var id = entry.id.$t;
	
	var playerUrl = entries[i].media$group.media$content[0].url;
	var id_clear = id.split('http://gdata.youtube.com/feeds/videos/')[1];
	$.videos['#movie_'+id_clear] = entry;
    var title = entry.title.$t;
	
	
	
	var code = '<div id="movie_' + id_clear + '" class="activemovie"><h3>'+ entries[i].title.$t +'</h3><object width="745" height="448"><param name="wmode" value="opaque" /><param name="movie" value=' + playerUrl + ' /><param name="allowFullScreen" value="true" /><param name="allowscriptaccess" value="always" /><embed src=' + playerUrl + ' type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="745" height="448" wmode="opaque"></embed></object></div>';
	
	var uploader = entry.author.name;
	var time = entries[i].media$group.yt$duration.seconds;
    var thumbnailUrl = entries[i].media$group.media$thumbnail[0].url;
	var thumb = '<span class="thumbnail_wrapper"><img src="'+ thumbnailUrl +'" alt="'+ title +'" title="'+ title +'" /><time>'+ $.formatTime(time) +'</time></span>';	
	var stat = entry.yt$statistics.viewCount;
	
	var uploader = entry.author[0].name.$t;
	var date = new Date(entry.published.$t);
	var item_date = date.toLocaleDateString();
	var item_link = '<a href="#movie_'+ id_clear +'" class="clearfix" title="'+ title +'">'+ thumb +'<span class="wrap"><strong>'+ title +'</strong><span class="author">'+ uploader +'</span><span class="date">'+ item_date +'</span><span class="viewCount">'+ stat +' просмотров</span></span></a>'
	list_elements += '<li>'+ item_link +'</li>';
  }
  	var list = '<ul>'+ list_elements +'</ul>';
  $('#video_list').html(list);
  
  if (entries.length > 0) {
	var video_entry = entries[0];
	if(window.location.hash != '' && $.videos[window.location.hash] != undefined){
		video_entry = $.videos[window.location.hash];
	}
	var code = '<div id=\"movie_' + video_entry.id.$t.split('http://gdata.youtube.com/feeds/videos/')[1] + '\" class=\"activemovie\"><h3>'+ video_entry.title.$t +'</h3><object width=\"745\" height=\"448\"><param name=\"wmode\" value=\"opaque\" /><param name=\"movie\" value=' + video_entry.media$group.media$content[0].url + ' /><param name=\"allowFullScreen\" value=\"true\" /><param name=\"allowscriptaccess\" value=\"always\" /><embed src=' + video_entry.media$group.media$content[0].url + ' type=\"application/x-shockwave-flash\" allowscriptaccess=\"always\" allowfullscreen=\"true\" width=\"745\" height=\"448\" wmode=\"opaque\"></embed></object></div>';
		$('#video').html(code);
  }
  
  $(window).bind('hashchange', function(){
	var id = window.location.hash.split('#movie_')[1];	
  })
  
}

$(document).ready(function() {	
$('#preloader').hide();
$('#video_list li a').each(function(){
		$(this).click(function(){
			
			var title = $(this).find('strong').text();
			var movie_id = $(this).attr('href').split('#movie_')[1];
			var url = 'http://www.youtube.com/v/'+movie_id;
			$.changeVideo(url, movie_id, title);
		})
	})
});
