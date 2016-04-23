'use strict';

import Base from './base.js';
let fs = require("fs");
let cheerio = require("cheerio");

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    indexAction() {
        //auto render template file index_index.html
        //return this.display();


        this.end("hello boy xule");
    }
}