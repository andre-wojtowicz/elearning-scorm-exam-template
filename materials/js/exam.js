Array.prototype.equals = function (array)
{
    if (!array)
        return false;

    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++)
    {
        if (this[i] instanceof Array && array[i] instanceof Array) 
        {
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i])
        { 
            return false;   
        }           
    }       
    return true;
}

var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function getCheckedValues(questionNumber)
{
	var vals = [];
	
	for (var y=0; y<alphabet.length; y++)
	{
		var element = document.getElementById(questionNumber + "-" + alphabet[y]);
		if (!element)
			return vals;
		if (element.checked)
            vals.push(alphabet[y]);
	}
}

var startTimeStamp = new Date();

//SCORM requires time to be formatted in a specific way
    function ConvertMilliSecondsToSCORMTime(intTotalMilliseconds, blnIncludeFraction){
	
	    var intHours;
	    var intintMinutes;
	    var intSeconds;
	    var intMilliseconds;
	    var intHundredths;
	    var strCMITimeSpan;
    	
	    if (blnIncludeFraction == null || blnIncludeFraction == undefined){
		    blnIncludeFraction = true;
	    }
    	
	    //extract time parts
	    intMilliseconds = intTotalMilliseconds % 1000;

	    intSeconds = ((intTotalMilliseconds - intMilliseconds) / 1000) % 60;

	    intMinutes = ((intTotalMilliseconds - intMilliseconds - (intSeconds * 1000)) / 60000) % 60;

	    intHours = (intTotalMilliseconds - intMilliseconds - (intSeconds * 1000) - (intMinutes * 60000)) / 3600000;

	    /*
	    deal with exceptional case when content used a huge amount of time and interpreted CMITimstamp 
	    to allow a number of intMinutes and seconds greater than 60 i.e. 9999:99:99.99 instead of 9999:60:60:99
	    note - this case is permissable under SCORM, but will be exceptionally rare
	    */

	    if (intHours == 10000) 
	    {	
		    intHours = 9999;

		    intMinutes = (intTotalMilliseconds - (intHours * 3600000)) / 60000;
		    if (intMinutes == 100) 
		    {
			    intMinutes = 99;
		    }
		    intMinutes = Math.floor(intMinutes);
    		
		    intSeconds = (intTotalMilliseconds - (intHours * 3600000) - (intMinutes * 60000)) / 1000;
		    if (intSeconds == 100) 
		    {
			    intSeconds = 99;
		    }
		    intSeconds = Math.floor(intSeconds);
    		
		    intMilliseconds = (intTotalMilliseconds - (intHours * 3600000) - (intMinutes * 60000) - (intSeconds * 1000));
	    }

	    //drop the extra precision from the milliseconds
	    intHundredths = Math.floor(intMilliseconds / 10);

	    //put in padding 0's and concatinate to get the proper format
	    strCMITimeSpan = ZeroPad(intHours, 4) + ":" + ZeroPad(intMinutes, 2) + ":" + ZeroPad(intSeconds, 2);
    	
	    if (blnIncludeFraction){
		    strCMITimeSpan += "." + intHundredths;
	    }

	    //check for case where total milliseconds is greater than max supported by strCMITimeSpan
	    if (intHours > 9999) 
	    {
		    strCMITimeSpan = "9999:99:99";
    		
		    if (blnIncludeFraction){
			    strCMITimeSpan += ".99";
		    }
	    }

	    return strCMITimeSpan;
    	
    }

    function ZeroPad(intNum, intNumDigits){
 
	    var strTemp;
	    var intLen;
	    var i;
    	
	    strTemp = new String(intNum);
	    intLen = strTemp.length;
    	
	    if (intLen > intNumDigits){
		    strTemp = strTemp.substr(0,intNumDigits);
	    }
	    else{
		    for (i=intLen; i<intNumDigits; i++){
			    strTemp = "0" + strTemp;
		    }
	    }
    	
	    return strTemp;
    }

function getScoreAndSaveAnswers()
{
    var score = 0;
    for (var i=1; i<=tot; i++)
    {
        checkedValues = getCheckedValues(i);
        var correctAnswer = checkedValues.equals(answers[i-1]);
        var result = (correctAnswer ? "correct" : "wrong");
        
        if (correctAnswer)
        {
            score += 1;
            document.getElementById("question-"+i).className = "bg-success";
			document.getElementById("result-"+i).className = "text-success glyphicon glyphicon-ok";
        }
        else
        {
			document.getElementById("question-"+i).className = "bg-danger";
            document.getElementById("result-"+i).className = "text-danger glyphicon glyphicon-remove";
        }
        
        ScormSaveAnswer(i, "choice", 
                        checkedValues.toString().toLowerCase(), 
                        answers[i-1].toString().toLowerCase(), 
                        result);
    }
    return score;
}

function returnScore()
{
	var score = getScoreAndSaveAnswers();
    var endTimeStamp = new Date();
    var sessionTime = ConvertMilliSecondsToSCORMTime(endTimeStamp - startTimeStamp, false);
    
    ScormSaveScore(score, tot, sessionTime);
    ScormCommitChanges();
    ScormProcessTerminate();
    window.onunload = null;
    window.onbeforeunload = null;
    
    document.getElementById("result-score").innerHTML = score + " / " + tot;
	document.getElementById("progress-ok").style.width = ((score/tot)*100).toFixed(2) + "%";
	document.getElementById("progress-wrong").style.width = (((tot-score)/tot)*100).toFixed(2) + "%";
    document.getElementById("result-msg").hidden = false;
	document.getElementById("result-msg").style.display = "inline";
    
    document.getElementById("form-control").removeChild(document.getElementById("check-button"))
    
    document.body.style.pointerEvents = "none";
}


function CheckExam()
{
    if (ScormLessonPassed())
    {
        ScormProcessTerminate();
        returnScore = function(){};
        getScoreAndSaveAnswers = function(){};
        answers = null;
        window.onunload = null;
        window.onbeforeunload = null;
        $.toaster("Exam already passed.", 'Info', 'info');
        document.getElementById("form-control").removeChild(document.getElementById("check-button"))
        document.body.style.pointerEvents = "none";
    }
}