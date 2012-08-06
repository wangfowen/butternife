var playlist = function() {
	return Songs.find().fetch();
}

Template.playlist.queued_songs = function() {
	return playlist()[0] && playlist().slice(1);
}

Template.playlist.current_song = function() {
	return playlist()[0] && playlist()[0].song;
}

Template.playlist.current_artist = function() {
	return playlist()[0] && playlist()[0].artist;
}


Template.playlist.events = {
  'click #add' : function () {
    $('#add_song').show();
    $('#playlist').hide();
  }
};

Template.addSong.events = {
  'click #back': function () {
    $('#add_song').hide();
    $('#playlist').show();
  },

  'click #search': function() {
  	Meteor.apply('searchMusic', [$('#search-box').val()]);
  }
};

Meteor.startup(function() {
	var user_id = Users.insert({dj:false});
	Session.set('user_id', user_id);

	Meteor.autosubscribe(function() {
		Meteor.subscribe('songs');
	});
});