var pl = Template.playlist,
    p = Template.player,
    h = Template.header;

pl.queued_songs = function() {
  var songs = Songs.find({playlistId: Session.get("playlistId"), current: false}).fetch(),
      sortedSongs = songs;
      currentSong = Songs.findOne({playlistId: Session.get("playlistId"), current: true});

  if (currentSong) {
    sortedSongs = sortSongs(currentSong.next, songs);
  }

	return sortedSongs;
}

pl.current = function() {
	var songs = Songs.find({playlistId: Session.get("playlistId"), current: true}).fetch();
  return songs;
}

p.isDJ = function() {
  // var user = Users.findOne({_id: Session.get("userId"), playlistId: Session.get("playlistId")});

  return /*user && user.dj*/ true;
}

pl.events = {
  'click .delete': function(e) {
    var id = $(e.target).parents('.row').children('.id').html().trim(), 
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

h.events = {
  'click #back': function() {
    clearTemp();
    
    $('#container').animate({
      left: '0px'
    }, 250);

    $('#add_songs').show();
    $('#back').hide();
  },
  'click #add_songs': function() {
    $('#container').animate({
      left: -window.innerWidth + 'px'
    }, 250);

    $('#add_songs').hide();
    $('#back').show();
  }
}