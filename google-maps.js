var supportedTypes = ['Map', 'StreetViewPanorama'];

GoogleMaps = {
  load: _.once(function(options) {
    options = _.extend({ v: '3.exp' }, options);
    var params = _.map(options, function(value, key) { return key + '=' + value; }).join('&');
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?' + params +
      '&callback=GoogleMaps.initialize';

    document.body.appendChild(script);
  }),
  _loaded: new ReactiveVar(false),
  loaded: function() {
    return this._loaded.get();
  },
  maps: {},
  _callbacks: {},
  initialize: function() {
    this._loaded.set(true);
  },
  _ready: function(name, map) {
    _.each(this._callbacks[name], function(cb) {
      if (_.isFunction(cb))
        cb(map);
    });
  },
  ready: function(name, cb) {
    if (! this._callbacks[name])
      this._callbacks[name] = [];
    // make sure we run the callback only once
    // as the tilesloaded event will also run after initial load
    this._callbacks[name].push(_.once(cb));
  },
  // options: function(options) {
  //   var self = this;
  //   return function() {
  //     if (self.loaded())
  //       return options();
  //   };
  // },
  get: function(name) {
    return this.maps[name];
  },
  _create: function(name, options) {
    var self = this;
    self.maps[name] = {
      instance: options.instance,
      options: options.options,
      addListener : function(instanceObject , eventName, callback){

        if(typeof instanceObject == 'string'){
            callback = eventName;
            eventName = instanceObject;
            instanceObject = options.instance;
        } 

        google.maps.event.addListener(instanceObject, eventName, callback);
      },
      clearListeners: function(instanceObject, eventName){

        if(typeof instanceObject == 'string'){
            eventName = instanceObject;
            instanceObject = options.instance;
        } 

        google.maps.event.clearListeners(instanceObject, eventName);
      }
    };

    if (options.type === 'StreetViewPanorama') {
      options.instance.setVisible(true);
      self._ready(name, self.maps[name]);
    } else {
      google.maps.event.addListener(options.instance, 'tilesloaded', function() {
        self._ready(name, self.maps[name]);
      });
    }
  }
};

Template.googleMap.rendered = function() {
  var self = this;
  self.autorun(function() {
    // if the api has loaded
    if (GoogleMaps.loaded()) {
      var data = Template.currentData();
      
      if (! data.name)
        throw new Meteor.Error("GoogleMaps - Missing argument: name");
      if ($.isEmptyObject(data.options))
        throw new Meteor.Error("GoogleMaps - Missing argument: options");
      if (!(data.options instanceof Object))
        throw new Meteor.Error("GoogleMaps - options argument is not an object");
      
      var canvas = self.$('.map-canvas').get(0);

      // default to Map
      var type = data.type ? data.type : 'Map';
      if (! _.include(supportedTypes, type))
        throw new Meteor.Error("GoogleMaps - Invalid type argument: " + type);

      GoogleMaps._create(data.name, {
        type: type,
        instance: new google.maps[type](canvas, data.options),
        options: data.options
      });
    }
  });
};
