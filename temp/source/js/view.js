"use strict";
var Handlebars = require("handlebars");
var View = (function () {
    function View(templateUrl, container, model) {
        this._container = container;
        this._templateUrl = templateUrl;
        this._model = model;
    }
    View.prototype.render = function () {
        var _this = this;
        $.ajax({
            url: this._templateUrl,
            success: function (text) {
                var template = Handlebars.compile(text);
                var html = template({});
                $(_this._container).html(html);
            },
            error: function (error) {
                console.log(error);
            }
        });
    };
    return View;
}());
module.exports = View;
