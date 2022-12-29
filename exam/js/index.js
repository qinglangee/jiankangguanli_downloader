
// 页面模板
let T = {
    total : $('#q_template .total').prop('outerHTML'),
    item : $('#q_template .item').prop('outerHTML'),
    check_item : $('#q_template .check_item').prop('outerHTML'),
}


function init(){
    createSelect();
    selectChapter(0);
}

// 创建下拉选择列表
function createSelect(){
    for(let i = 0;i<16;i++){
        let opt = $('<option></option>');
        opt.val(i);
        opt.html('第' + (i + 1) + '章');
        opt.on('click', ()=>{
            selectChapter(i);
        });
        $('#chlist').append(opt);
    }
}

// 选中一个章节
function selectChapter(index){
    let questions = G['data' + (216+index)].data.list;
    G.questions = questions;
    G.total = questions.length;
    G.left = questions.length;
    G.right = 0;
    G.wrong = 0;
    G.questionIndexList = idList(G.total);
    G.wrongList = [];
    updateResult();
    updateQuestion(0);
}
// 生成一个序号列表
function idList(n){
    let arr = [];
    for(let i=0;i<n;i++){
        arr.push(i);
    }
    return arr;
}

function updateResult(){
    $('#total').html(G.total);
    $('#right').html(G.right);
    $('#wrong').html(G.wrong);
    $('#left').html(G.left);
}

// 更新当前题目
function updateQuestion(index){
    G.index = index;
    let questionIndex = G.questionIndexList[index % G.questionIndexList.length]; 
    let question = G.questions[questionIndex];
    $('#pre_question').html($('#question').html());
    $('#pre_question .answer').show();
    $('#question').html('');


    let total = $(T.total);
    total.attr('id', "q_" + questionIndex);
    $('.title', total).html(question.qname);
    let items = $('.items', total);
    for(let answer of question.answerList){
        let item = question.qtype==1?$(T.item):$(T.check_item);
        let inputEle = question.qtype==1 ? $('.answer_radio', item) : $('.answer_checkbox', item);
        let value = answer.aname.trim().substring(0,1);
        inputEle.val(value);
        inputEle.attr('id', answer.aid);
        inputEle.attr('name', question.qid);
        $('.text', item).attr('for', answer.aid);
        $('.text', item).html('[' + value + '] -- ' + answer.aname.trim().substring(1));

        if(question.qtype == 1){
            $('.answer_radio', item).on('change', ()=>{
                check_single();
            });
        }
        items.append(item);
    }
    $('.answer', total).html("正确答案： " + question.qright);
    $('.answer', total).hide();

    $('#question').append(total);

}

// 检查单选题答案
function check_single(){
    let index = $('#question .total').attr('id').split('_')[1];
    let question = G.questions[index];
    let value = $('#question input:checked').val();
    checkAnswer(value, question.qright, index);

    let items = $('#pre_question .answer_radio');
    for(let item of items){
        if($(item).val() == value){
            $(item).prop('checked', true);
        }
    }
    addAnswerDiv(value, question.qright);
}

// 检查多选题的答案
function check_multy(){
    let index = $('#question .total').attr('id').split('_')[1];
    let question = G.questions[index];
    let checkedItems = $('#question input:checked');
    let value = '';
    for(let checkedItem of checkedItems){
        value += $(checkedItem).val();
    }
    value = sortStr(value);
    console.log('mul', value.length, value);
    checkAnswer(value, question.qright, index);
    

    let items = $('#pre_question .answer_checkbox');
    for(let item of items){
        if(value.indexOf($(item).val()) >= 0){
            $(item).prop('checked', true);
        }
    }

    addAnswerDiv(value, question.qright)
}

// 对比答案并记录结果
function checkAnswer(your, right, index){
    if(your == right){
        G.right++;
    }else{
        G.wrong++;
        G.wrongList.push(index);
    }
    G.left--;
    updateResult();
    updateQuestion(G.index + 1);
}
function addAnswerDiv(your, right){
    let yourAnswer = $('<div></div>');
    yourAnswer.html('你的答案： ' + your);
    $('#pre_question').append(yourAnswer);
    if(your == right){
        yourAnswer.addClass('right');
    }else{
        yourAnswer.addClass('wrong');
    }
}

function retryWrongList(){
    G.questionIndexList = G.wrongList;
    G.wrongList = [];
    G.index = 0;
    G.left = G.questionIndexList.length;
    G.right = 0;
    G.wrong = 0;
    updateResult();
    updateQuestion(0);
}

init();