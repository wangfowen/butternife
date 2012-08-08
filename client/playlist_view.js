var pl = Template.playlist;

pl.queued_songs = function() {
  var songs = Songs.find({playlistId: Session.get("playlistId")}, {sort: {order: 1}}).fetch();
	return songs[0] && songs.slice(1);
}

pl.current_song = function() {
	var song = Songs.findOne({playlistId: Session.get("playlistId")}, {sort: {order: 1}});
  return song && song.song;
}

pl.current_artist = function() {
  var song = Songs.findOne({playlistId: Session.get("playlistId")}, {sort: {order: 1}});
  return song && song.artist;
}


pl.events = {
  'click #add_songs' : function() {
    $('#add_view').show();
    $('#playlist_view').hide();
  }
};