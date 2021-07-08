// 程式碼寫在這裡!

//1.-----宣告-----//
//玩家牌,點數
let yourDeck = [];
let yourpoint = 0;
//莊家牌,點數
let dealerDeck = [];
let dealerpoint = 0;
//偵測是否遊戲中，用來關閉或啟動html(hit)(stand)按鈕
let inGame = false;
let winner = 0; // 0: 未定, 1: 玩家贏, 2: 莊家贏, 3: 平手

$(document).ready(function(){
    cover_img();
    Game_star();
})

//2.-----把卡牌加上封面-----//
function cover_img(){
    // 1. 基本寫法
    // let cover_img = document.querySelectorAll(".card div");
    // cover_img.forEach(function (img){
    //     img.innerHTML = "🃏"; })

    // 2. JQ寫法
    $(".card div").html("🃏");
}


//3.-----for迴圈製作52張牌-----//
function cards_52(){
    //先let一個空陣列
    let deck = [];
    for (let card_set = 1; card_set <= 4; card_set++){
        for (let card_no  = 1; card_no <= 13; card_no++){
            //宣告 card52 定義 將 迴圈完的值送到Game_rule裏(烤盤)
            let card_52 = new Game_rule(card_set, card_no);
            //烤盤完後,push到deck空陣列
            deck.push(card_52)
        }
    }
    //記得要回傳到deck,不然只會在for迴圈裏不會保留。
    return deck;
}

//4.-----將手中的牌轉換成A,J,Q,K與花色與點數-----//
function renderGameTable(){
    //  1.將玩家手中的牌換成AJQK與花色
    //  使用forEach跑yourDeck(玩家牌)
    //  一開始只有兩張,是依照newgame執行順序
    yourDeck.forEach(function (card, i){
        let thisCard = $(`#yourCard${i + 1}`)
        thisCard.html(card.card_Number());
        thisCard.prev().html(card.card_flower());
    })
    dealerDeck.forEach(function (card, i){
        let thisCard = $(`#dealerCard${i + 1}`)
        let thisflower = $(`#♠${i + 1}`)   
        thisCard.html(card.card_Number());
        thisflower.html(card.card_flower());
    })
    //  2.將手中的牌計算成點數
    //  將//--1.宣告--//的point 用calcpoint算成點數之後
    //  傳到(yourDeck)==> 是上面做foreach時使用的
    yourpoint = calcpoint(yourDeck);
    dealerpoint = calcpoint(dealerDeck);
    $('.your-cards h1').html(`你（${yourpoint}點）`);
    $('.dealer-cards h1').html(`莊家（${dealerpoint}點）`)    

    //  3.設置遊戲結束條件
    if (yourpoint >= 21 || dealerpoint >= 21){
        inGame = false;
    }
    //  4.論輸贏
    checkWinner();
    showWinStamp();
    //  5.遊戲開始(inGame)將html(hit)(stand)按鈕設為true
    $('#action-hit').attr('disabled', !inGame);
    $('#action-stand').attr('disabled', !inGame);

}

//5.-----將手中的牌算成點數回傳到yourpoint = 0-----//
function calcpoint(deck){
    // 宣告 point 定義為 0;
    let point = 0;
    // 將傳進來的值(deck)跑foreach把換算出來的值放到 point
    deck.forEach(function(card){
        // point = point + card.card_point();
        point += card.card_point();
    })
    // 偵測是否超過21點,如果有"A" -10點
    if (point >21){
        deck.forEach(function(card){
            if (card.card_Number() === "A"){
                point = point - 10; // A從 11點 變成 1點
            }
        })
    }
    //注意要回傳到 point = 0 不然只會在迴圈裏不會保留
    // 而且要供外面使用
    return point;
}

//6.-----初始化遊戲-----//
function resetGame(){
    //製作52張牌裏面宣告的deck[]清除
    deck = [];

    yourDeck = [];
    yourpoint = 0;
    dealerDeck = [];
    dealerpoint = 0;    
    cover_img();
    winner = 0;
    $('.your-cards').removeClass('win');
    $('.dealer-cards').removeClass('win'); 
    $('.your-cards').removeClass('winlose');
    $('.dealer-cards').removeClass('winlose');   
}

//7.-----莊家回合(自動)-----//
function dealerRound() {
    // 1. 發牌
    // 2. 如果點數 >= 玩家，結束，莊家贏
    // 3. < 玩家，繼續發，重覆 1
    // 4. 爆了，結束，玩家贏
    // 5.while無限迴圈
    while(true){
        dealerpoint = calcpoint(dealerDeck);
        if (dealerpoint < yourpoint){
            dealerDeck.push(shuffle_deck.shift());
        } else {
            break;
        }
    }
    //當while達到條件break之後將 遊戲設為結束
    inGame = false;
    //重畫一張桌子
    renderGameTable();
  }

//8.-----論輸贏-----//
function checkWinner() {
    switch(true) {
      // 1. 如果玩家 21 點，玩家贏
      case yourpoint == 21:
        winner = 1;
        break;
  
      // 2. 如果點數爆...
      case yourpoint > 21:
        winner = 2;
        break;
  
      case dealerpoint > 21:
        winner = 1;
        break;
  
      // 3. 平手
      case dealerpoint == yourpoint:
        winner = 3;
        break;
  
      // 4. 比點數
      case dealerpoint > yourpoint:
        winner = 2;
        break;
  
      default:
        winner = 0;
        break;
    }
    console.log(winner);
  }

//9.-----蓋章-----//
function showWinStamp() {
    switch(winner) {
      case 1:
        $('.your-cards').addClass('win');
        break;
      case 2:
        $('.dealer-cards').addClass('win');
        break;
      case 3:
        $('.your-cards').addClass('winlose');
        $('.dealer-cards').addClass('winlose');
        break;
      default:
        break;
    }
}
//.-----開始前準備-----//
function newGame(){
    //1.先將遊戲初始化
    resetGame();
    //2. 將cards_52使用函數shuffle洗牌
    shuffle_deck = shuffle(cards_52());
    //3. ↓發牌-->玩家-->莊家-->玩家
    //   ↓將洗好的牌(shuffle_deck)
    //   ↓用shift(從最前面取出一個元素，原陣列元素會少一個)
    //   ↓在push到 玩家莊家(XXXXDeck)手中(//1.基本宣告//陣列中)     
    yourDeck.push(shuffle_deck.shift());
    dealerDeck.push(shuffle_deck.shift());
    yourDeck.push(shuffle_deck.shift());
    // 將ingmae設成ture 開始遊戲中
    inGame = true;
    //4. 將兩方手中的牌替換成花色與數字
    renderGameTable();
};

//.-----按下開始按鈕(開始遊戲)-----//
function Game_star(){
    //html按鈕click開始
    $("#action-new-game").click(function(evt){
        newGame();
    })
    //html抽牌按鈕
    $('#action-hit').click(function(evt){
        //先將其他預設動作停止
        evt.preventDefault();
        //從洗好的牌(shuffle_deck)
        //抽出來(shift())再push到玩家牌中
        yourDeck.push(shuffle_deck.shift());
        //然後再把牌重整一次(花色/點數/數字)
        renderGameTable();
    })
    //html換裝家按鈕
    $('#action-stand').click(function(evt){
        evt.preventDefault();
        dealerDeck.push(shuffle_deck.shift());
        //當按下stand時候執行莊家回合(自動)
        dealerRound();
    })   
};


//-----遊戲規則-----//
class Game_rule {
    //1.卡牌編號(模板)
    constructor(card_set, card_no) {
    this.card_set = card_set
    this.card_no = card_no
    }
    //2.把牌面換成 A J Q K
    card_Number(){
        switch(this.card_no){
            case 1:
                return "A";
            case 11:
                return "J";
            case 12:
                return "Q";
            case 13:
                return "K";
            default:
                return this.card_no;                 
        }
    }
    //3.算卡的點數
    card_point(){
        // switch(檢查項)
        switch(this.card_no){
            case 1:
                return 11;
            case 11: 
            case 12: 
            case 13:    
                return 10;
            default:
                return this.card_no
        }
    }
    //4.把牌換成花色
    card_flower(){
        switch (this.card_set){
            case 1:
                return "♣";
            case 2:
                return "♢";
            case 3:
                return "♡";
            case 4:
                return "♠";
        }
    }
    //4.
}
//-----洗牌-----//
//https://reurl.cc/Kjl9v9
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }