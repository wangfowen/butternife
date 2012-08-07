var as = Template.addSong;

as.events = {
  'click #back': function () {
    $('#add_song').hide();
    $('#playlist').show();
  },

  'click #search': function() {
  	Meteor.apply('searchMusic', [$('#search-box').val()]);
  }
};
