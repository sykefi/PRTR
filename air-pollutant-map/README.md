[![Tests & deploy dev status](https://github.com/sykefi/air-pollutant-map/workflows/Tests%20%26%20deploy%20dev/badge.svg)](https://github.com/sykefi/air-pollutant-map/actions)

# air-pollutant-map

Also known as _Hajapäästöt kartalla_


### Project setup

The project requires installation of [vue-cli](https://cli.vuejs.org/):
```
npm install -g @vue/cli
```

To install project dependencies with npm, run:
```
npm install
```

To use dev GeoServer, add file `.env.local` with the following environment variable: 
`VUE_APP_GEOSERVER_URI=http://your-dev-geoserver-address:port/geoserver/paastotkartalla/`


### Compiles and hot-reloads for development

`npm run serve-dev`

### Compiles and minifies for production

`npm run build-prod`

### Tests

Open & run Cypress E2E tests with
`npm run cypress`

### Built with

Vue.js & OpenLayers

See [Configuration Reference](https://cli.vuejs.org/config/).

## Update air-pollutant-map changes to PRTR ui
To update changes that are made in air-pollutant-map to PRTR app, minified build needs to be copied in directory [ui/public/air-pollutant-map](../ui/public/air-pollutant-map/). Build script and copy script are chained for sequential execution. Copy-script requires installation of ncp. To install, run:
```
npm install -g ncp
```

### Compiles and minifies for development and copies minified file to PRTR ui

`npm run build-dev-prtr`

### Compiles and minifies for production and copies minified file to PRTR ui

`npm run build-prod-prtr`