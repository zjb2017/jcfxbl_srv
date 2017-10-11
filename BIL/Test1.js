function doForm(Form,callback) {
  

 
    console.log(Form.urlParams);

    var ErrCode=0;
    var msg='BIL OK';
    var result={};
    var resultCount=0;
    callback(ErrCode,msg,result,resultCount)
}

module.exports.doForm = doForm;