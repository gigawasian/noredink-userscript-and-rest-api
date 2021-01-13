// ==UserScript==
// @name         noredink
// @namespace    https://github.com/dayoshiguy/rest-api-for-userscript
// @version      0.1
// @description  shows the answer to the questions in noredink.  When you get a question wrong it will be saved to the database.  currently only supports multiple choice questions but more will be added later
// @author       You
// @match        *://www.noredink.com/learn/quiz/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        GM.xmlHttpRequest
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    var url=window.location.href;
    var practiceID=url.indexOf("try_similar")==-1?url.split("/learn/quiz/")[1].split("/")[0]:url.split("/learn/quiz/")[1].split("/try_similar")[0];
    //var REST="https://rest-api-for-nri-userscript.herokuapp.com/api/";
    var REST="https://rest-api-for-userscript-1.lukec1.repl.co/api/";
    var question;
    var choice=[];
    var $keyElements=["html>body>div:eq(2)>div>div>div:eq(0)>header>h2"];
    var $trySimilar="html>body>div:eq(3)>div:eq(1)>div>div>div>button";
    var numOfChoices=0;
    ///////////////
    function addQuestion(id,question,answer,callback){
        $.get(REST+"addanswer/"+id+"/"+encodeURIComponent(question)+"/"+encodeURIComponent(answer), function(result){
            console.log(result);
            callback(result);
        });
    }
    function getQuestions(id,question){
        //$("html>body>div:eq(3)>div>div>div:eq(1)>div>section>section:eq(1)>article>span:eq(0)>button>span>div>div>img").attr("src","https://www.streamscheme.com/wp-content/uploads/2020/04/poggers.png");
        //$("html>body>div:eq(3)>div>div>div:eq(1)>div>section>section:eq(1)>article>span:eq(0)>button>span>div>div>img").hide();
        //$("html>body>div:eq(3)>div>div>div:eq(1)>div>section>section:eq(1)>article>span:eq(0)>button>span>div>span").text("loading question info...");
        document.body.getElementsByTagName("h2")[0].innerText="loading question info...";
        //for some reason normal jquery ajax doesnt work here
        GM.xmlHttpRequest({//https://wiki.greasespot.net/GM.xmlHttpRequest#GET_request
            method: "GET",
            url: REST+"search/"+id+"/"+question,
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/xml"
            },
            onload: function(response) {
                var responseXML = null;
                console.log([
                    response.status,
                    response.statusText,
                    response.readyState,
                    response.responseHeaders,
                    response.responseText,
                    response.finalUrl,
                    responseXML
                ].join("\n"));
                if(response.responseText!=="no match"){
                    var question=JSON.parse(response.responseText).question;
                    var answer=JSON.parse(response.responseText).answer;
                    var confidence=JSON.parse(response.responseText).confidence;
                    console.log("answer: "+answer+"\nconfidence"+confidence);
                    //$("html>body>div:eq(3)>div>div>div:eq(1)>div>section>section:eq(1)>article>span:eq(0)>button>span>div>span").attr("style", "white-space: pre;");
                    document.body.getElementsByTagName("h2")[0].setAttribute("style","white-space: pre;");
                    //$("html>body>div:eq(3)>div>div>div:eq(1)>div>section>section:eq(1)>article>span:eq(0)>button>span>div>span").text("question: "+question+"\r\nanswer: "+answer+"\r\nconfidence: "+confidence);
                    document.body.getElementsByTagName("h2")[0].innerText="question: "+question+"\r\nanswer: "+answer+"\r\nconfidence: "+confidence;

                }else{
                    console.log(response.responseText);
                    //alert(encodeURIComponent(document.getElementsByClassName("Nri-Quiz-Layout-Question")[0].getElementsByTagName("p")[0].innerHtml));
                    //$("html>body>div:eq(3)>div>div>div:eq(1)>div>section>section:eq(1)>article>span:eq(0)>button>span>div>span").text(response.responseText);
                    document.body.getElementsByTagName("h2")[0].innerText=response.responseText;

                }

            }


        });
    }
    /*function findClosestStringInArray(array,_string){

        var a = FuzzySet();
        array.forEach((i)=>{a.add(i)});
        return a.get(_string);
    }*/
    function getQuestionType(){
        var qType="error";
        if($("html>body>div:eq(3)>div>div>div:eq(1)>div>section>div:eq(1)>section>section>button:eq(0)>span").length>-1){
            qType="multiplechoice";
        }
        return qType;
    }
    var waitForItToLoad=setInterval(()=>{
        $keyElements.forEach(i=>{if($(i).length>-1){//checks if certain key elements have loaded aka the page finished loaded
            if(url.indexOf("try_similar")==-1){//not on try_similar page aka in a practice question
                //alert(getQuestionType());
                if(getQuestionType()=="multiplechoice"){
                    question=document.getElementsByClassName("Nri-Quiz-Layout-Question")[0].getElementsByTagName("p")[0].innerText;
                    numOfChoices=document.getElementsByClassName("Nri-Quiz-Layout-Question")[0].getElementsByTagName("button").length;
                    for(var x=0;x<numOfChoices;x++){
                        choice[x]=document.getElementsByClassName("Nri-Quiz-Layout-Question")[0].getElementsByTagName("button")[x].innerText;
                    };
                    //alert("q:"+question+"\nchoice:"+choice);
                    getQuestions(practiceID,question);

                }
            }else if(url.indexOf("try_similar")>-1){//if on try_similar page aka they just got one wrong
                document.getElementById("try-similar-problem").innerText="question data saved";
                var Question,Answer;
                var questionjsondata=JSON.parse(document.getElementsByClassName("try-similar-container")[0].getElementsByTagName("div")[1].getAttribute("data-data"));
                Question=questionjsondata.sentence;
                Answer=questionjsondata.correct_option;
                //alert("q: "+Question+"\na: "+Answer);
                addQuestion(practiceID,Question,Answer,(result)=>{console.log(result)});

            }else{
                alert("wtf");
            }
            //alert(JSON.Stringify(getQuestions()));

            //alert(question+"\n"+choice);
            clearInterval(waitForItToLoad);
        }});
        var timer=3;var countdown=setInterval(()=>{document.getElementById("try-similar-problem").innerText="automatically continuing in "+timer+"...";timer--;if(timer<=0){clearInterval(countdown);$($trySimilar).click();}},1000);
        //$($trySimilar).click();//click the continue button (if it is there)
    },500);
})();
