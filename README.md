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

Call the `load` method to load the maps API.

```js
if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load();
  });
}
```

You can also load the API only on specific routes when using [Iron Router](https://atmospherejs.com/iron/router).

```js
Router.onBeforeAction(function() {
  GoogleMaps.load();
  this.next();
}, { only: ['routeOne', 'routeTwo'] });
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

Pass through the map initialization options by creating a template helper. We can also place the `GoogleMaps.ready` method within the helper as a convenience as we may wish to make use of the template data context.

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

#### GoogleMaps.load([options])

Loads the map API.

- options (Object)
  - `key` *String*
    - API key
  - `libraries` *String*
    - Specify [Google Maps Libraries](https://developers.google.com/maps/documentation/javascript/libraries)

Example:

```js
GoogleMaps.load({ key: '12345', libraries: 'geometry,places' }); 
```

#### GoogleMaps.loaded()

Reactive method which returns `true` once the maps API has loaded.

#### GoogleMaps.ready('name', callback)

Runs once the specified map has rendered.

- `name` *String*
- `callback` *Function*

Example:

```js
GoogleMaps.ready('exampleMap', function(map) {
  // map.instance, map.options
});
```

The callback function returns an object containing two properties:

- instance
  - The Google map instance
- options
  - The options passed through from the Template helper (see Usage Overview above)

You can also access this object directly by name:

```js
GoogleMaps.maps.exampleMap
```

### License

MIT
