Shortly.createLoginView = Backbone.View.extend({
  className: 'creator', // ? class for Login view?

  template: Templates['login'],

  events: {
    'submit': 'shortenUrl' // ? need login event?
  },

  render: function() {
    this.$el.html( this.template() );
    return this;
  }

});
