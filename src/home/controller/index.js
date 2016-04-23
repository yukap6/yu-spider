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
        return this.display();
    }

    async getdata(storename, currentdir, filename) {
        let data = fs.readFileSync(currentdir+"/"+filename);
        let $ = cheerio.load(data, {decodeEntities: true});
        let table = $("#titlesTable tbody");
        let trs = table.find("tr");
        let trDatas = new Array();
        let dateBegin = $("#date-picker-container .fromDate .terapeak-blue").text();
        dateBegin = dateBegin.replace(/\D/g, "-").replace(/-+/g, "-").replace(/-$/, "");
        let dateEnd = $("#date-picker-container .toDate .terapeak-blue").text();
        dateEnd = dateEnd.replace(/\D/g, "-").replace(/-+/g, "-").replace(/-$/, "");
        for (let i = 0; i < trs.length; i++) {
            let item = $(trs[i]);
            let src = item.find("img").attr("src");
            if (src) {
                trDatas[i] = new Array();
                let tds = item.find("td");
                for (let j = 0; j < tds.length; j++) {
                    let td = $(tds[j]);
                    switch (j) {
                        case 0:
                            //img
                            let imgstr = $(td.find("img")[0]).attr("src");
                            let imgarr = imgstr.split("/");
                            trDatas[i]["item_img"] = "http://thumbs.ebaystatic.com/pict/" + imgarr[imgarr.length - 1];
                            break;
                        case 1:
                            //隐藏的一串数字，暂时不知道做什么用
                            trDatas[i]["item_serialnum"] = td.text();
                            break;
                        case 2:
                            trDatas[i]["item_title"] = $(td.find("a")[0]).text().replace(/[\s|\n|\r|\n\r|\r\n]+/g, " ").replace(/\'/g, "").replace(/\"/g, "\"");
                            break;
                        case 3:
                            trDatas[i]["item_total"] = td.text().replace("$", "").replace(/,/g, "");
                            break;
                        case 4:
                            //刊登总数
                            trDatas[i]["item_shownum"] = td.text();
                            break;
                        case 5:
                            //成交率
                            trDatas[i]["item_per"] = td.text().replace("%", "");
                            break;
                        case 6:
                            trDatas[i]["item_price"] = td.text().replace("$", "").replace(/,/g, "");
                            break;
                        case 7:
                            //销量
                            trDatas[i]["item_count"] = td.text();
                            break;
                    }
                }
            }
        }
        let model = this.model("item");
        for (let k in trDatas) {
            trDatas[k]["item_datebegin"] = dateBegin;
            trDatas[k]["item_dateend"] = dateEnd;
            trDatas[k]["item_store"] = storename;
            let insertId = await model.add(trDatas[k]);
            let minId = await model.where("item_store = '" + trDatas[k]["item_store"] + "' and ( item_img = '" + trDatas[k]["item_img"] + "' or item_title = '" + trDatas[k]["item_title"] + "' or item_serialnum = '" + trDatas[k]["item_serialnum"] + "' )").min("item_id");
            model.where({"item_id": insertId}).update({"item_tag": minId});
        }
        if(!fs.existsSync(currentdir+"/spidered")){
            fs.mkdirSync(currentdir+"/spidered", "07777");
        }
        let readerStream = fs.createReadStream(currentdir+"/"+filename);
        let writerStream = fs.createWriteStream(currentdir+"/spidered/"+filename);
        readerStream.pipe(writerStream);
        fs.unlink(currentdir+"/"+filename);
    }

    async scanAction() {
        let dirhome = "./www/shophtml";
        let $this = this;
        fs.readdir(dirhome, function (err, files) {
            if (err) {
                return console.error(err);
            }
            files.forEach(function (storename) {
                let currentStore = dirhome + "/" + storename;
                let stat = fs.lstatSync(currentStore);
                if (stat.isDirectory()) {
                    let htmls = fs.readdirSync(currentStore);
                    htmls.forEach(function (hfile) {
                        if (hfile.substr(-4, 4) == ".htm" || hfile.substr(-5, 5) == ".html") {
                            $this.getdata(storename, currentStore, hfile);
                        }
                    });
                }
            });
        });
        this.end("ok");
    }

    testAction() {
        let currentdir = "./www/shophtml/ksports";
        if(!fs.existsSync(currentdir+"/spidered")){
            fs.mkdirSync(currentdir+"/spidered", "07777");
        }
        let readerStream = fs.createReadStream(currentdir+"/1.html");
        let writerStream = fs.createWriteStream(currentdir+"/spidered/1.html");
        readerStream.pipe(writerStream);
        this.end("test success");
    }

    reactAction() {
        return this.display();
    }

    dataAction() {
        return this.display();
    }

    async sortinitAction() {
        let model = this.model("item");
        let stores = await model.field("item_store").group("item_store").select();
        let result = {"data":stores, "code":"10000"};
        this.end(result);
    }

    async getalldataAction() {
        let model = this.model("item");
        let item_store = this.post("item_store");
        let item_datebegin = this.post("item_datebegin");
        let item_dateend = this.post("item_dateend");

        let chartsData = await model.field("sum(item_count) as num, sum(item_total) as total, item_title").where("item_store = '"+item_store+"' and item_datebegin >= '"+item_datebegin+"' and item_dateend <= '"+item_dateend+"'").group("item_tag").order("total desc").limit(10).select();
        let tableData = await model.field("sum(item_count) as num, sum(item_total) as total, item_title, item_img, item_tag").where("item_store = '"+item_store+"' and item_datebegin >= '"+item_datebegin+"' and item_dateend <= '"+item_dateend+"'").group("item_tag").order("total desc").limit(50).select();
        let result = {"chartsData":chartsData, "tableData":tableData, "code":"10000"};
        this.end(result);
    }
}

