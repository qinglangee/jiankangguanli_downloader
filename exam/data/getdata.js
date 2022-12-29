function calldata(index){

    $.get('http://api.jinyizhuo.top/api/tiku/getQuestion?id=' + index, function(resp){
        sss += 'G.data' + index + '=' + JSON.stringify(resp) + '\n';
        if(index < 231){
            calldata(index + 1);
        }else{
            console.log(sss);
        }
    });
}
calldata(216);