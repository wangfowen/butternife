var pl = Template.playlist;

pl.queued_songs = function() {
  var songs = Songs.find({playlistId: Session.get("playlistId"), current: false}).fetch();
	return songs;
}

pl.current = function() {
	var songs = Songs.find({playlistId: Session.get("playlistId"), current: true}).fetch();
  return songs;
}


pl.events = {
  'click #add_songs' : function() {
    $('#add_view').show();
    $('#playlist_view').hide();
  },
  'click #next' : function() {
  	var currentSong = Songs.findOne({playlistId: Session.get("playlistId"), current: true});

  	Songs.update({_id: currentSong._id}, {$set : {current: false}});
  	Songs.update({_id: currentSong.next}, {$set : {current: true}});
  },
  'click #prev' : function() {
  	var currentSong = Songs.findOne({playlistId: Session.get("playlistId"), current: true});

  	Songs.update({_id: currentSong._id}, {$set : {current: false}});
  	Songs.update({_id: currentSong.prev}, {$set : {current: true}});
  }
};