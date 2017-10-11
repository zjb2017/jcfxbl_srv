var ResponseEnd = require('./ResponseEnd.js').ResponseEnd;
//var xmlJS = require('xml2js');
//var ScriptExecute = require('./ScriptExecute.js').ScriptExecute;
//var LoadTempletScript = require('./LoadTempletScript.js').LoadTempletScript;

var querystring = require('querystring');
var util = require('util');
var url = require('url');
var debug = require('debug')('jcDAL:HttpContent');



function HttpContent(JCCache, request, response, postStr) {

    var postData = querystring.parse(postStr);
    var urlParams = url.parse(request.url, true);
    var srvID = urlParams.query.srvID; //业务ID

    if (typeof (srvID) == 'undefined' || srvID == '' || srvID == null) {
        var myDate = new Date();
        console.log(myDate.toLocaleString() + ' ERR_REQ_srvID_UNDEFINED :[' + srvID + ']');
        ResponseEnd(JCCache, response, 'false', 'ERR_REQ_srvID_UNDEFINED', null, null, null);
        return;
    }


    //srv业务脚本调用
    var path = util.format('./BIL/%s.js', srvID.replace(/\./g, '/'));
    JCCache.srvCache[srvID] = require(path);

    var Form = {};
    Form.srvID=srvID;
    Form.urlParams = urlParams;
    Form.data = postStr;
    JCCache.srvCache[srvID].doForm(Form, function (ErrCode, msg, result, resultCount) {
        if (ErrCode > 0) {
            ResponseEnd(JCCache, response, 'false', ErrCode, msg, null, null);
        } else {
            ResponseEnd(JCCache, response, 'true', ErrCode, msg, result, resultCount);
        }
    });

    JCCache.SrvState.ResponseCount++;
    //ResponseEnd(JCCache, response, 'true', 'ErrCode', 'msg', 'result', 'resultCount');
    //console.log('*');
}


module.exports.HttpContent = HttpContent;