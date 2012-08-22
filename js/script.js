$.formatTime = function(seconds){
	seconds = parseInt(seconds);
	var minutes = Math.floor(seconds/60);
	seconds = seconds - (minutes*60);
	var hours = Math.floor(minutes/60);
	minutes = minutes - (hours*60);
	return hours + ':' + minutes + ':' + seconds;
}
$.parseYouTubeData = function(result){
	var items = result.data.items;
	var list_elements = '';
	for (var i in items){
		var item = items[i];
		if (i == 0){
			$.changeVideo(item.id);
		}
		var date = new Date(item.uploaded);
		//var item_date = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
		var item_date = date.toLocaleDateString();
		var thumb = '<span class="thumbnail_wrapper"><img src="'+ item.thumbnail.hqDefault +'" alt="'+ item.title +'" title="'+ item.title +'" /><time>'+ $.formatTime(item.duration) +'</time></span>';
		var item_link = '<a href="#movie_'+ item.id +'" class="clearfix" title="'+ item.title +'">'+ thumb +'<span class="wrap"><strong>'+ item.title +'</strong><span class="author">'+ item.uploader +'</span><span class="date">'+ item_date +'</span><span class="viewCount">'+ item.viewCount +' просмотров</span></span></a>'
		list_elements += '<li>'+ item_link +'</li>';
	}
	var list = '<ul>'+ list_elements +'</ul>';
	return list;
}
$.changeVideo = function(id){
	$.get('http://gdata.youtube.com/feeds/api/videos/'+ id +'?v=2&alt=jsonc', {}, function(result){
		var video = result.data;
		var code = '<div id=\"movie_' + video.id + '\" class=\"activemovie\"><h3>'+ video.title +'</h3><object width=\"745\" height=\"448\"><param name=\"wmode\" value=\"opaque\" /><param name=\"movie\" value=' + video.content[5] + ' /><param name=\"allowFullScreen\" value=\"true\" /><param name=\"allowscriptaccess\" value=\"always\" /><embed src=' + video.content[5] + ' type=\"application/x-shockwave-flash\" allowscriptaccess=\"always\" allowfullscreen=\"true\" width=\"745\" height=\"448\" wmode=\"opaque\"></embed></object></div>';
		$('#video').html(code);
		$('html, body').animate({
			scrollTop: $('#video').offset().top
		}, 'slow')
		//document.location = document.location
	}, 'json');
	
}
$(document).ready(function() {
	$.get('https://gdata.youtube.com/feeds/api/users/regruvideo/uploads?v=2&alt=jsonc',{},function(data){
		var list = $.parseYouTubeData(data);
		$('#video_list').html(list);
	},'json');
});

$(window).bind('hashchange', function(){
	var id = window.location.hash.split('#movie_')[1];
	$.changeVideo(id);
})