// ==UserScript==
// @name         noredink bf
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.noredink.com/learn/quiz/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    var url=window.location.href;
    var practiceID=url.indexOf("try_similar")==-1?url.split("/learn/quiz/")[1]:url.split("/learn/quiz/")[1].split("/try_similar")[0];
    var REST="https://rest-api-for-nri-userscript.herokuapp.com/api/";
    var question;
    var choice=[];
    var $keyElements=["html>body>div:eq(2)>div>div>div:eq(0)>header>h2"];
    var $trySimilar="html>body>div:eq(3)>div:eq(1)>div>div>div>button";
    function addQuestion(question,answer,callback){
        $.get(REST+"addanswer/"+encodeURIComponent(question)+"/"+encodeURIComponent(answer), function(result){
            console.log(result);
            callback(result);
        });
    }
    function getQuestions(callback){
        $.getJSON(REST+"getanswer/", function(result){
            console.log(JSON.Stringify(result));
            callback(result);
        });
    }
    var waitForItToLoad=setInterval(()=>{
        $keyElements.forEach(i=>{if($(i).length>-1){//checks if certain key elements have loaded aka the page finished loaded
            if(url.indexOf("try_similar")==-1){//not on try_similar page aka in a practice question
                question=document.getElementsByClassName("Nri-Quiz-Layout-Question")[0].getElementsByTagName("p")[0].innerText;
                var numOfChoices=document.getElementsByClassName("Nri-Quiz-Layout-Question")[0].getElementsByTagName("button").length;
                for(var x=0;x<numOfChoices;x++){
                    choice[x]=document.getElementsByClassName("Nri-Quiz-Layout-Question")[0].getElementsByTagName("button")[x].innerText;
                };
            }else if(url.indexOf("try_similar")>-1){//if on try_similar page aka they just got one wrong
                var Question,Answer;
                var questionjsondata=JSON.parse(document.getElementsByClassName("try-similar-container")[0].getElementsByTagName("div")[1].getAttribute("data-data"));
                Question=questionjsondata.sentence;
                Answer=questionjsondata.correct_option;
                //alert("q: "+Question+"\na: "+Answer);

            }else{
                alert("wtf");
            }
            //alert(JSON.Stringify(getQuestions()));

            //alert(question+"\n"+choice);
            clearInterval(waitForItToLoad);
        }});
        $($trySimilar).click();//click the continue button (if it is there)
    },500);
})();
