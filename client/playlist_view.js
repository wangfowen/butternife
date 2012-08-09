var pl = Template.playlist;

pl.queued_songs = function() {
  var songs = Songs.find({playlistId: Session.get("playlistId")}, {sort: {order: 1}}).fetch();
	return songs[0] && songs.slice(1);
}

pl.current = function() {
	var songs = Songs.find({playlistId: Session.get("playlistId")}, {sort: {order: 1}}).fetch();
  return [songs[0]];
}


pl.events = {
  'click #add_songs' : function() {
    $('#add_view').show();
    $('#playlist_view').hide();
  }
};