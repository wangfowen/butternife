Meteor.methods({
	searchMusic: function(music) {
		Meteor.http.get('https://ex.fm/api/v3/song/search/' + music + '?username=supernuber&password=password', {}, function(error, data) {
			console.log("data", data.data.songs);
		});
	}
});