Meteor.publish('playlists', function(playlistId) {
	return Playlists.find({_id: playlistId});
})

Meteor.publish('songs', function(playlistId) {
	return Songs.find({playlistId: playlistId});
})

Meteor.methods({
	searchMusic: function(music, playlistId, start) {
		var future = new Future();

		start = start || 0;

		Meteor.http.get('https://ex.fm/api/v3/song/search/' + encodeURIComponent(music) + '?results=30&start=' + start, {}, function(error, data) {
			console.log(data);

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