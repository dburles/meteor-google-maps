Meteor Google Maps
==================

[![Join the chat at https://gitter.im/dburles/meteor-google-maps](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dburles/meteor-google-maps?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Latest version of the [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/tutorial) with an interface designed for Meteor.

- Supports multiple map instances
- Ability to only load the API when it's required
- Provides callbacks for individual maps when they render
- API key + libraries
- StreetViewPanorama support

## Table of Contents

- [Installation](https://github.com/dburles/meteor-google-maps#installation)
- [Examples](https://github.com/dburles/meteor-google-maps#examples)
- [Usage Overview](https://github.com/dburles/meteor-google-maps#usage-overview)
- [API](https://github.com/dburles/meteor-google-maps#api)
  - [Blaze Template](https://github.com/dburles/meteor-google-maps#blaze-template)
  - [create](https://github.com/dburles/meteor-google-maps#create)
  - [load](https://github.com/dburles/meteor-google-maps#load)
  - [loadUtilityLibrary](https://github.com/dburles/meteor-google-maps#loadutilitylibrary)
  - [loaded](https://github.com/dburles/meteor-google-maps#loaded)
  - [ready](https://github.com/dburles/meteor-google-maps#ready)
  - [initialize](https://github.com/dburles/meteor-google-maps#initialize)
- [Mobile Platforms](https://github.com/dburles/meteor-google-maps#mobile-platforms)
- [License](https://github.com/dburles/meteor-google-maps#license)

## Note

The maps API is *client-side only*. Server side support may be added soon.

## Installation

```sh
$ meteor add dburles:google-maps
```

Alternatively if you wish to add the package from within another package and have `GoogleMaps` available outside of package scope, use [api.imply](http://docs.meteor.com/#/full/pack_api_imply) in your `package.js`.

## Examples

[Reactive geolocation](http://meteorcapture.com/reactive-geolocation-with-google-maps)

[How to create a reactive Google map](http://meteorcapture.com/how-to-create-a-reactive-google-map)

[React example](https://github.com/dburles/meteor-google-maps-react-example)

[Demo project for the examples below](https://github.com/dburles/meteor-google-maps-demo)

## Usage Overview

Call the `load` method to load the maps API.

```js
if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load();
  });
}
```

If you prefer to load the maps API only once it's required, you may do so from within a Template `onRendered` hook.

```js
Template.contact.onRendered(function() {
  GoogleMaps.load();
});
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
  max-width: 100%;
  height: 500px;
}
```

Pass through the map initialization options by creating a template helper. This will only run once.

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

Place the `ready` callback within the template `onCreated` callback. This is also where you handle map events and reactive updates.

```js
Template.body.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('exampleMap', function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
});
```

Access a map instance any time by using the `maps` object.

```js
GoogleMaps.maps.exampleMap.instance
```

## API

### Blaze Template

`{{> googleMap [type=String] name=String options=Object}}`

- type (Optional)
  - Currently supported types: Map, StreetViewPanorama (defaults to 'Map')
- name
  - Provide a name to reference this map
- options
  - Map initialization options

### create

`GoogleMaps.create({object})`

An alternative to using the `googleMap` Blaze template. Call this function to create a new map instance and attach it to a DOM element.

Options:

- `name` - Name to reference this map.
- `element` - A DOM element to attach the map to.
- `options` - The map options.
- `type` (optional) - Map or StreetViewPanorama. Defaults to Map.

Example:

```js
GoogleMaps.create({
  name: 'exampleMap',
  element: document.getElementById('exampleMap'),
  options: {
    center: new google.maps.LatLng(-37.8136, 144.9631),
    zoom: 8
  }
});
```

### load

`GoogleMaps.load([options])`

Loads the map API. Options passed in are automatically appended to the maps url. 
By default `v3.exp` will be loaded. For full documentation on these options see https://developers.google.com/maps/documentation/javascript/tutorial#Loading_the_Maps_API

Example:

```js
GoogleMaps.load({ v: '3', key: '12345', libraries: 'geometry,places' });
```

### loadUtilityLibrary

`GoogleMaps.loadUtilityLibrary('/path/to/library.js')`

A method to ease loading external [utility libraries](https://code.google.com/p/google-maps-utility-library-v3/wiki/Libraries). These libraries will load once the Google Maps API has initialized.

### loaded

`GoogleMaps.loaded()`

Reactive method which returns `true` once the maps API has loaded, or after manually calling `GoogleMaps.initialize()` (See further down).

### ready

`GoogleMaps.ready('name', callback)`

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

### initialize

`GoogleMaps.initialize()`

This function is passed into the Google maps URL as the callback parameter when calling `GoogleMaps.load()`.
In the case where the maps library has already been loaded by some other means, calling `GoogleMaps.initialize()` will set `GoogleMaps.loaded()` to `true`.

## Mobile platforms

If you're targeting mobile platforms you'll need to configure the following access rules in `mobile-config.js`.

```js
App.accessRule('*.google.com/*');
App.accessRule('*.googleapis.com/*');
App.accessRule('*.gstatic.com/*');
```

For more refer to the [official documentation](http://docs.meteor.com/#/full/mobileconfigjs).

## License

MIT
