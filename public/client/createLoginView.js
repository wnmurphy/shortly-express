Shortly.createLoginView = Backbone.View.extend({
  className: 'creator', 

  template: Templates['login'],

  events: {
    'submit': 'shortenUrl' 
  },

  render: function() {
    this.$el.html( this.template() );
    return this;
  }

});
