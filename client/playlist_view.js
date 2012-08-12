var pl = Template.playlist,
    p = Template.player;

pl.queued_songs = function() {
  var songs = Songs.find({playlistId: Session.get("playlistId"), current: false}).fetch();
	return songs;
}

pl.current = function() {
	var songs = Songs.find({playlistId: Session.get("playlistId"), current: true}).fetch();
  return songs;
}

p.isDJ = function() {
  // var user = Users.findOne({_id: Session.get("userId"), playlistId: Session.get("playlistId")});

  return true /*&& user.dj*/;
}

pl.events = {
  'click #add_songs': function() {
    $('#add_view').show();
    $('#playlist_view').hide();
  },
  'click .delete': function(e) {
    var id = $(e.target).parent().parent().children('.id').html().trim(), 
        currentSong = Songs.findOne({_id: id});

    deleteSong(currentSong);
  }
};

p.events = {
  'click #next': function() {
    changeSong("next");
  },
  'click #prev': function() {
    changeSong("prev");
  }
}