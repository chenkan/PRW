"use strict";

var _ = require("underscore")._;

//console.log(_.uniqueId('contact_'));

//var _ = require('underscore')._;
//
//console.log(
//    _.map([1, 2, 3], function (num) {
//        return num * 3;
//    })
//);
//
//console.log(123);

var stooges = [
    {name: 'curly', age: 25},
    {name: 'moe', age: 21},
    {name: 'larry', age: 23}
];

var youngest = _.chain(stooges)
    .sortBy(function (stooge) {
        return stooge.age;
    })
    .map(function (stooge) {
        return stooge.name + ' is ' + stooge.age;
    })
    .first()
    .value();
console.log(youngest);