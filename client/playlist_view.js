var pl = Template.playlist,
    s = Template.song;

pl.queued_songs = function() {
  var songs = Songs.find({playlistId: Session.get("playlistId"), current: false}).fetch();
	return songs;
}

pl.current = function() {
	var songs = Songs.find({playlistId: Session.get("playlistId"), current: true}).fetch();
  return songs;
}

s.isCurrentAndDJ = function() {
  // var user = Users.findOne({_id: Session.get("userId"), playlistId: Session.get("playlistId")});

  return (this.current === true) /*&& user.dj*/;
}

pl.events = {
  'click #add_songs': function() {
    $('#add_view').show();
    $('#playlist_view').hide();
  },
  'click #next': function() {
  	changeSong("next");
  },
  'click #prev': function() {
  	changeSong("prev");
  },
  'click .delete': function(e) {
    var id = $(e.target).parent().parent().children('.id').html().trim(), 
        currentSong = Songs.findOne({_id: id}),
        isCurrent = currentSong.current;

    Songs.update({_id: currentSong.prev}, {$set: {next: currentSong.next}});
    Songs.update({_id: currentSong.next}, {$set: {prev: currentSong.prev}});
    if (isCurrent) {
      changeSong("next");
    }

    Songs.remove({_id: id});
  }
};