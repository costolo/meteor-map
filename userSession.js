_userSession = new Mongo.Collection('userSession');

userSession = {
  isActive: false,

  getUserSession: function() {
    return this.isActive;
  },

  setUserSession: function() {
    this.isActive = true;
  },

  removeUserSession: function() {
    this.isActive = false;
  }
};