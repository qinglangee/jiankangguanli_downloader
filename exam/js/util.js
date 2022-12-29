function sortStr(str){
    let arr = [];
    for(let c of str){
        arr.push(c);
    }
    arr.sort();
    let res = '';
    for(let c of arr){
        res += c;
    }
    return res;
}
