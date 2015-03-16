Meteor Google Maps
==================

[![Join the chat at https://gitter.im/dburles/meteor-google-maps](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dburles/meteor-google-maps?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Latest version of the Google Maps Javascript API with an interface designed for Meteor.

- Supports multiple map instances
- Provides callbacks for individual maps when they render
- API key + libraries
- StreetViewPanorama support

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

Pass through the map initialization options by creating a template helper.

```js
Template.body.helpers({
  exampleMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(-37.8136, 144.9631),
        zoom: 8
      };
    }
  }
});
```

Place the `ready` callback within the template `created` callback.

```js
Template.body.created = function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('exampleMap', function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
};
```

Access a map instance any time by using the `maps` object.

```js
GoogleMaps.maps.exampleMap.instance
```

## Demo Project

This is a simple demo project that makes use of the examples above:

https://github.com/dburles/meteor-google-maps-demo

## API

#### {{> googleMap [type=String] name=String options=Object}}

- type (Optional)
  - Currently supported types: Map, StreetViewPanorama (defaults to 'Map')
- name
  - Provide a name to reference this map
- options
  - Map initialization options

#### GoogleMaps.load([options])

Loads the map API. Options passed in are automatically appended to the maps url. 
By default `v3.exp` will be loaded. For full documentation on these options see https://developers.google.com/maps/documentation/javascript/tutorial#Loading_the_Maps_API

Example:

```js
GoogleMaps.load({ v: '3', key: '12345', libraries: 'geometry,places' });
```

#### GoogleMaps.loaded()

Reactive method which returns `true` once the maps API has loaded, or after manually calling `GoogleMaps.initialize()` (See further down).

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

#### GoogleMaps.initialize()

This function is passed into the Google maps URL as the callback parameter when calling `GoogleMaps.load()`.
In the case where the maps library has already been loaded by some other means, calling `GoogleMaps.initialize()` will set `GoogleMaps.loaded()` to `true`.

### License

MIT
