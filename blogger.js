(function(global){

    var Blogger = function(title)
    {
        return new Blogger.init(title);
    }

    Blogger.prototype = {};

    Blogger.init = function(title){
        var self = this;
        self.title = title || "Your Title Here";
    }

    Blogger.init.prototype = Blogger.prototype;

    global.Blogger = global.B$ = Blogger;

}(window));
