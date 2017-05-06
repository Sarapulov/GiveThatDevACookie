var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var favoriteSchema = new Schema({
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    apps: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'App'
    }]
}, {
    timestamps: true
});

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;
