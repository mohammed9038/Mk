var runWidget = function(context)
{
  $('[data-cdzwidget]', context).each(function () {
    var $element = $(this);
    var widgets = $element.data('cdzwidget');
    
    $.each(widgets, function(name, widget) {
      var options = widget;
      var widget = name.split('.');
      if (widget.length > 1) {
        if (typeof $[widget[0]][widget[1]] === 'function') {
          $[widget[0]][widget[1]](options, $element);
        }
      }
    });
    $element.removeAttr('data-cdzwidget');
  });
}
var mHeaderBreakpoint = theme.variables.mediaQueryHeader;
var mBreakpoint = 768;
var tabBreakpoint = 980;
var $window = $(window), winWidth = window.innerWidth;
var deskPrefix = 'desk_', mobiPrefix = 'mobi_';
var mbEvent = 'cdzMobile', dtEvent = 'cdzDesktop', tabEvent = 'cdzTablet';
var mbHeEvent = 'cdzHeMobile', dtHeEvent = 'cdzHeDesktop';
$(document).ready(function() {
  addTriggerScreen(winWidth);
  addTriggerHeScreen(winWidth);
  $window.resize(function() {
    var curWidth = window.innerWidth;
    if ((curWidth >= mBreakpoint && winWidth < mBreakpoint) || (curWidth < mBreakpoint && winWidth >= mBreakpoint)){
      addTriggerScreen(curWidth);
    }
    if ((curWidth >= mHeaderBreakpoint && winWidth < mHeaderBreakpoint) || (curWidth < mHeaderBreakpoint && winWidth >= mHeaderBreakpoint)){
      addTriggerHeScreen(curWidth);
    }
    winWidth = curWidth;
  });
  
  $window.on(dtHeEvent, onDesktop).on(mbHeEvent, onMobile);
  if (isDtHeScreen(winWidth)) {
    onDesktop();
  } else {
    onMobile();
  }
  
});
appendScript(theme.libs.base.js, function() {
   appendScript(theme.libs.megamenu.js, function() {
    moveCdzMegaMenu();
    runWidget('body');
  });
});

$('body').on('contentUpdated', function() {
  runWidget('body');
}); 
var isDtScreen = function(breakpoint) {
  if (typeof breakpoint === 'undefined'){
    breakpoint = mBreakpoint;
  }
  if (breakpoint >= mBreakpoint){
    return true;
  }
  else{
    return false;
  }
}

var addTriggerScreen = function(breakpoint){
  if (typeof breakpoint === 'undefined'){
    breakpoint = mBreakpoint;
  }
  if(isDtScreen(breakpoint)){
    $window.trigger(dtEvent);
  }
  else{
    $window.trigger(mbEvent);
  }
} 
//Move header element when have setting in admin panel    
var isDtHeScreen = function(breakpoint) {
  if (typeof breakpoint === 'undefined'){
    breakpoint = mHeaderBreakpoint;
  }
  if (breakpoint >= mHeaderBreakpoint){
    return true;
  }
  else{
    return false;
  }
}

var addTriggerHeScreen = function(breakpoint){
  if (typeof breakpoint === 'undefined'){
    breakpoint = mHeaderBreakpoint;
  }
  if(isDtHeScreen(breakpoint)){
    $window.trigger(dtHeEvent);
  }
  else{
    $window.trigger(mbHeEvent);
  }
}

var moveToNewArea = function(fromA, toB) {
  $('[id^="' + fromA + '"]').each(function() {
    var $element = $(this);
    var $child = $element.children();
    var fromId = $element.attr('id');
    var strA = fromId.substr(fromA.length);
    var toId = toB + strA;
    $child.appendTo('#' +toId);
  });
};

var onMobile = function() {
  moveToNewArea(deskPrefix, mobiPrefix);
};
var onDesktop = function() {
  moveToNewArea(mobiPrefix, deskPrefix);
};
function appendScript(filepath, handle) {
    if ($('body script[src="' + filepath + '"]').length > 0) {
      if (typeof handle == 'function') {
      	handle();  
      }
      return;
    }

    var ele = document.createElement('script');
    ele.type = "text/javascript";
    ele.src = filepath;
    
  	if (typeof handle == 'function') {
      $(ele).on('load', function(e) {   
        handle();
      });
    }
    document.body.appendChild(ele);
}
function appendStyle(filepath) {
    if ($('head link[href="' + filepath + '"]').length > 0)
        return;

    var ele = document.createElement('link');
    ele.setAttribute("type", "text/css");
    ele.setAttribute("rel", "Stylesheet");
    ele.setAttribute("href", filepath);
    $('head').append(ele);
}