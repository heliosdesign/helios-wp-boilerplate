/* global jQuery console */

import module from 'modules/example-module';

(function($, console, module){
  
  console.log('The example script is firing.');
  console.log(module());
})(jQuery, console, module);

