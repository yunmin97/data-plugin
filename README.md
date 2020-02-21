data-plugin

Config data plugin for applications developed with [nodejs](https://nodejs.org/en/).

data-plugin is a config data(.csv&.json) plugin for applications developed with nodejs. data-plugin can watch all config files in the given dir and reload the file automatically and asynchronous when it is modified. 

##Installation

```
npm install data-plugin
```

##Usage

```
... ...
... ...
var plugin = require('data-plugin')({
    dir: './config/data',
    // must set for csv
    idx: 'id',
    // interval: 3000,
    // a file loaded callback
    // onLoaded: function(name){}
    // all files loaded down callback
    // onAllLoaded: function(){}
});
... ...
... ...
// check if the config exists 
if (!plugin.hasJson('card')) {
    return;
}
// get a json object by name
var card = plugin.getJson('card');
... ...
... ...
// check if the config exists 
if (!plugin.hasCSV('item')) {
    return;
}
// get a csv table by name
var item = plugin.getJson('item');
// check if the value exists by id
if (item.has(0)) {
    return;
}
// get a value from csv table by id
var value = item.get(0);
... ...
... ...
```
