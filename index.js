import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';
import {get as getProjection} from 'ol/proj';
import {getCenter} from 'ol/extent';
import MVT from 'ol/format/MVT';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import {Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {applyStyle} from 'ol-mapbox-style';
import stylefunction from 'ol-mapbox-style/dist/stylefunction';
import XYZ from 'ol/source/XYZ';

proj4.defs('EPSG:199999', '+proj=laea +lon_0=-80.86 +lat_0=14.88 +datum=WGS84 +units=m +no_defs');
proj4.defs('ESRI:54009', '+proj=moll +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 ' +
    '+units=m +no_defs');
proj4.defs('EPSG:6350', '+proj=aea +lat_1=29.5 +lat_2=45.5 +lat_0=23 +lon_0=-96 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs');
//proj4.defs('ESRI:54012', '+proj=eck4 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs')
register(proj4);

var proj54009 = getProjection('EPSG:6350');
proj54009.setExtent([-8040784.5135, -2577524.9210, 3668901.4484, 4785105.1096]);

var proj102001 = getProjection('EPSG:199999');
proj102001.setExtent([-9303637, -8338295, 7694955, 7838189]);


var key = 'pk.eyJ1IjoidGhlc2t1YSIsImEiOiJjaXpvdWtoZ3UwMDVmMzJueDl2cWp6NHdnIn0.3T9kAApG2hnV6NCVWxVDbA';

var style = 'https://api.mapbox.com/styles/v1/theskua/ckb9o174m07p61is0tjzhvtsc.html?fresh=true&title=view&access_token=' + key


const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new XYZ({
        url: 'http://{1-4}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
      }),
      opacity: 0.5
    }),
    new VectorTileLayer({
      declutter: true,
      source: new VectorTileSource({
        attributions: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
          '© <a href="https://www.openstreetmap.org/copyright">' +
          'OpenStreetMap contributors</a>',
        format: new MVT(),
        url: 'https://{a-d}.tiles.mapbox.com/v4/theskua.1yvh14re/' +
            '{z}/{x}/{y}.vector.pbf?access_token=' + key
      }),
      opacity: 0.3,
      style: new Style({
          fill: new Fill({
            color: '#E6DFCF'
          })})
    })
  ],
  view: new View({
    projection: 'EPSG:6350', 
    center: [13242.64920946, 1539001.75424774],
    zoom: 3,
    maxZoom: 8
  })
});

var layer = new VectorTileLayer({
  declutter: true,
  source: new VectorTileSource({
    attributions: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
      '© <a href="https://www.openstreetmap.org/copyright">' +
      'OpenStreetMap contributors</a>',
    format: new MVT(),
    url: 'https://{a-d}.tiles.mapbox.com/v4/theskua.2de0ko15/' +
        '{z}/{x}/{y}.vector.pbf?access_token=' + key
  }),
  opacity: 0.9
})

map.addLayer(layer)

let styleUrl = require('./data/style.json');

stylefunction(layer, styleUrl, "ppy-circles-chiswi-breeding-exp1");

var info = $('#info');
info.tooltip({
  animation: false,
  trigger: 'manual'
});

var displayFeatureInfo = function(pixel) {
  info.css({
    left: pixel[0] + 'px',
    top: (pixel[1] - 15) + 'px'
  });
  var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
    return feature;
  });

  if (feature) {
    info.tooltip('hide')
      .attr('data-original-title', 'Change: ' + feature.get('abd_ppy').toFixed(2) + "% per year")
      .tooltip('fixTitle')
      .tooltip('show');
  } else {
    info.tooltip('hide');
  }
};

map.on('pointermove', function(evt) {
  //console.log(evt)

  if (evt.dragging) {
    info.tooltip('hide');
    return;
  }
  displayFeatureInfo(map.getEventPixel(evt.originalEvent));
});

var laybounds = new VectorTileLayer({
  declutter: true,
  source: new VectorTileSource({
    attributions: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
      '© <a href="https://www.openstreetmap.org/copyright">' +
      'OpenStreetMap contributors</a>',
    format: new MVT(),
    url: 'https://{a-d}.tiles.mapbox.com/v4/theskua.49dfmx3y/' +
        '{z}/{x}/{y}.vector.pbf?access_token=' + key
  }),
  opacity: 0.7,
  style: new Style({
  stroke: new Stroke({
    color: 'white',
    width: 1
  })})
})

map.addLayer(laybounds)

console.log(laybounds.getStyle);
