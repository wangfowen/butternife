Meteor.publish('playlists', function(playlist_id) {
	return Playlists.find({_id: playlist_id});
})

Meteor.publish('songs', function(playlist_id) {
	return Songs.find({playlist_id: playlist_id});
})

Meteor.methods({
	searchMusic: function(music) {
		Meteor.http.get('https://ex.fm/api/v3/song/search/' + music + '?username=supernuber&password=password', {}, function(error, data) {
			console.log("data", data.data.songs);
		});
	}
});