"use strict";
var Promise = require("bluebird");
var Model = (function () {
    function Model(moduleUrl, formatter) {
        this._modelUrl = moduleUrl;
        this._formatter = formatter;
    }
    Model.prototype.genericAjaxCallAsync = function (method, args) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: _this._modelUrl,
                data: args,
                success: function (response) {
                    if (typeof _this._formatter === "function") {
                        response = _this._formatter(response);
                    }
                    resolve(response);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    };
    Model.prototype.getAsync = function (args) {
        return this.genericAjaxCallAsync("GET", args);
    };
    return Model;
}());
module.exports = Model;
