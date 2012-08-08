var as = Template.addSong;

as.events = {
  'click #back': function() {
    clearTemp();
    
    $('#add_view').hide();
    $('#playlist_view').show();
  },

  'click #search': function(e) {
  	e.preventDefault();
  	e.stopPropagation();

  	clearTemp();
  	newTemp();

  	Meteor.apply('searchMusic', [$('#search_box').val(), Session.get('addId')]);
  },

  'click .add': function(e) {
  	e.preventDefault();
  	e.stopPropagation();

  	var $tr = $(e.target).parents('tr');

  	Songs.insert({song: $tr.children('.song').html(),
  		artist: $tr.children('.artist').html(),
  		url: $tr.children('.url').html(),
  		playlistId: Session.get('playlistId')
  	});
  }
};

as.list_songs = function() {
	return Songs.find({playlistId: Session.get("addId")}, {sort: {order: 1}}).fetch();
};
