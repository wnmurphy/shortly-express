Shortly.createLoginView = Backbone.View.extend({
  className: 'creator',

  template: Templates['login'],

  events: {
  },

  render: function () {
    this.$el.html( this.template() );
    return this;
  }

});
