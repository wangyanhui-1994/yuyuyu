
// import Nightmare from 'nightmare';
// const nightmare = Nightmare({ show: true });

if (!typeof window){
    window.global = window;
}else{
    global.window = global;
    // global.MutationObserver = true;
    // global.navigator = {};
    // global.document = {};
    // global.Array = function(){
    //   // this.prototype = {}
    //   return [];
    // }
    // Array.isArray = function(){
    //   return true;
    // }
    // if (!Array.prototype.indexOf)
    // {
    //   Array.prototype.indexOf = function(elt /*, from*/)
    //   {
    //     var len = this.length >>> 0;
    //     var from = Number(arguments[1]) || 0;
    //     from = (from < 0)
    //          ? Math.ceil(from)
    //          : Math.floor(from);
    //     if (from < 0)
    //       from += len;
    //     for (; from < len; from++)
    //     {
    //       if (from in this &&
    //           this[from] === elt)
    //         return from;
    //     }
    //     return -1;
    //   };
    // }
    //
    // global.document.querySelectorAll = function(){
    //    return [
    //      {
    //        addEventListener: function(){},
    //        getAttribute: function(){}
    //      }
    //    ];
    // }
    // global.document.createElement = function(){
    //    return {
    //      style: {webkitPerspective: {}, MozPerspective: ''}
    //    };
    // }
    // global.navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
};
