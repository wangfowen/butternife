var pl = Template.playlist;

pl.queued_songs = function() {
  var songs = Songs.find({playlist_id: Session.get("playlist_id")}, {sort: {order: 1}}).fetch();
	return songs[0] && songs.slice(1);
}

pl.current_song = function() {
	var song = Songs.findOne({playlist_id: Session.get("playlist_id")}, {sort: {order: 1}});
  return song && song.song;
}

pl.current_artist = function() {
  var song = Songs.findOne({playlist_id: Session.get("playlist_id")}, {sort: {order: 1}});
  return song && song.artist;
}


pl.events = {
  'click #add' : function () {
    $('#add_song').show();
    $('#playlist').hide();
  }
};