'use strict';

import Base from './base.js';
let fs = require("fs");
let cheerio = require("cheerio");

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
	//auto render template file index_index.html
	return this.display();
  }

  async tryAction(){
	let data = fs.readFileSync("www/shophtml/ksports/1.html");
	let $ = cheerio.load(data, {decodeEntities: true});
	let table = $("#titlesTable tbody");
	let trs = table.find("tr");
	let trDatas = new Array();
	let dateBegin = $("#date-picker-container .fromDate .terapeak-blue").text();
	dateBegin = dateBegin.replace(/\D/g, "-").replace(/-+/g, "-").replace(/-$/, "");
	let dateEnd = $("#date-picker-container .toDate .terapeak-blue").text();
	  dateEnd = dateEnd.replace(/\D/g, "-").replace(/-+/g, "-").replace(/-$/, "");
	for(let i=0; i<trs.length; i++)
	{
	  let item = $(trs[i]);
	  let src = item.find("img").attr("src");
	  if(src)
	  {
		trDatas[i] = new Array();
		let tds = item.find("td");
		for(let j=0; j<tds.length; j++)
		{
		  let td = $(tds[j]);
		  switch(j)
		  {
			case 0:
				//img
				let imgstr = $(td.find("img")[0]).attr("src");
				let imgarr = imgstr.split("/");
			  trDatas[i]["item_img"] = "http://thumbs.ebaystatic.com/pict/"+imgarr[imgarr.length - 1];
				  break;
			case 1:
				//隐藏的一串数字，暂时不知道做什么用
			  trDatas[i]["item_serialnum"] = td.text();
			  break;
			case 2:
			  trDatas[i]["item_title"] = $(td.find("a")[0]).text().replace(/[\s|\n|\r|\n\r|\r\n]+/g, " ");
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
	for(let k in trDatas)
	{
		trDatas[k]["item_datebegin"] = dateBegin;
		trDatas[k]["item_dateend"] = dateEnd;
		let insertId = await model.add(trDatas[k]);
		let minId = await model.where({"item_img":trDatas[k]["item_img"], "item_title":trDatas[k]["item_title"],"item_serialnum":trDatas[k]["item_serialnum"], _logic: "OR"}).min("item_id");
		model.where({"item_id":insertId}).update({"item_tag":minId});
	}
	this.end(trs.length);
  }

  test(){
      let arr = new Array(1,2,3);
	  this.end(arr);
  }

  htmlAction(){
      let arr = new Array(1,2,3);
      think.log(arr);
      this.end(arr);

  }
}