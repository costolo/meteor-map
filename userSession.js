_userSession = new Mongo.Collection('userSession');

userSession = {
  isActive: false,

  getUserSession: function() {
    return this.isActive;
  },

  getUserSessionString: function() {
    return this.isActive.toString();
  },

  setUserSession: function() {
    this.isActive = true;
  },

  removeUserSession: function() {
    this.isActive = false;
  }
};