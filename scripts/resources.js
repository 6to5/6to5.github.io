function Search(resources) {
  this.resources = resources;

  this.index = lunr(function() {
    this.field('title', { boost: 10 });
    this.field('creator');
    this.field('description');
    this.field('tags', { boost: 5 });
    this.ref('id');
  });

  _.each(this.resources, this.index.add, this.index);

  this.$search = document.getElementById('babel-resource-search');
  this.$resources = document.getElementsByClassName('babel-resource-list-item');

  this.$search.addEventListener('keyup', _.bind(this.onChange, this));
}

Search.prototype.onChange = _.debounce(function() {
  this.searchText = this.$search.value;
  this.currentMatches = this.index.search(this.searchText);
  this.update();
}, 30);

Search.prototype.update = function() {
  _.each(this.$resources, this.updateResource, this);
};

Search.prototype.updateResource = function(el, index) {
  if (!this.searchText) {
    el.style.display = 'block';
    el.style.order = null;
    return;
  }

  var matchIndex = _.findIndex(this.currentMatches, function(obj) {
    return obj.ref === '' + index;
  });

  if (matchIndex < 0) {
    el.style.display = 'none';
    el.style.order = null;
  } else {
    el.style.display = 'block';
    el.style.order = matchIndex;
  }
};

var search = new Search(window.RESOURCES);
