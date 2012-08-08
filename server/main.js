Meteor.publish('playlists', function(playlistId) {
	return Playlists.find({_id: playlistId});
})

Meteor.publish('songs', function(playlistId) {
	return Songs.find({playlistId: playlistId});
})

Meteor.methods({
	searchMusic: function(music, playlistId) {
		var future = new Future();

		Meteor.http.get('https://ex.fm/api/v3/song/search/' + music + '?username=supernuber&password=password', {}, function(error, data) {
			for (song in data.data.songs) {
				var s = data.data.songs[song];

				Songs.insert({song: s.title, 
					artist: s.artist, 
					album: s.album,
					url: s.url,
					playlistId: playlistId
				})
			};

			future.resolver()();
		});

		Future.wait(future);
	}
});