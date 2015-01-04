Meteor Google Maps
==================

Latest version of the Google Maps Javascript API with an interface designed for Meteor.

- Supports multiple map instances
- Provides callbacks for individual maps when they render
- API key + libraries

## Note

The maps API is *client-side only*. Server side support may be added soon.

## Installation

```sh
$ meteor add dburles:google-maps
```

## Usage Overview

Call the `load` method to load the maps API. If required you can pass in an API key: `GoogleMaps.load('xxx');`.

```js
if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load();
  });
}
```

Wrap the map template to set the width and height.

```html
<body>
  <div class="map-container">
    {{> googleMap name="exampleMap" options=exampleMapOptions}}
  </div>
</body>
```

```css
.map-container {
  width: 800px;
  height: 500px;
}
```

Pass through the map initialization options by creating a template helper.

```js
Template.body.helpers({
  exampleMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // We can use the `ready` callback to interact with the map API once the map is ready.
      GoogleMaps.ready('exampleMap', function(map) {
        // Add a marker to the map once it's ready
        var marker = new google.maps.Marker({
          position: map.options.center,
          map: map.instance
        });
      });
    
      // Map initialization options
      return {
        center: new google.maps.LatLng(-37.8136, 144.9631),
        zoom: 8
      };
    }
  }
});
```

Access a map instance any time by using the `maps` object.

```js
GoogleMaps.maps.exampleMap.instance
```

## API

TODO

### License

MIT
