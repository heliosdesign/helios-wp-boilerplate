/* global jQuery console */

import module from 'modules/example-module';

(function($, console, module){
  
  console.log('The example script is loading a module: %s.', module());

})(jQuery, console, module);

