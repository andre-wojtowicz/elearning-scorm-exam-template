/*
Source code created by Rustici Software, LLC is licensed under a 
Creative Commons Attribution 3.0 United States License
(http://creativecommons.org/licenses/by/3.0/us/)

Want to make SCORM easy? See our solutions at http://www.scorm.com.

This example demonstrates the use of more advanced runtime calls in a multi-page SCO. It
includes a demonstration of reporting interactions (question results), and progress
towards specific learning objective. It also demonstrates using the manifest to specify
a passing score rather than hard coding the passing score within the content.
*/


//Include the standard ADL-supplied API discovery algorithm


///////////////////////////////////////////
//Begin ADL-provided API discovery algorithm
///////////////////////////////////////////

var nFindAPITries = 0;
var API = null;
var maxTries = 500; 

// The ScanForAPI() function searches for an object named API
// in the window that is passed into the function.  If the object is
// found a reference to the object is returned to the calling function.
// If the instance is found the SCO now has a handle to the LMS
// provided API Instance.  The function searches a maximum number
// of parents of the current window.  If no object is found the
// function returns a null reference.  This function also reassigns a
// value to the win parameter passed in, based on the number of
// parents.  At the end of the function call, the win variable will be
// set to the upper most parent in the chain of parents.
function ScanForAPI(win)
{
   while ((win.API == null) && (win.parent != null)
           && (win.parent != win))
   {
      nFindAPITries++;
      if (nFindAPITries > maxTries)
      {
         return null;
      }
      win = win.parent;
   }
   return win.API;
} 

// The GetAPI() function begins the process of searching for the LMS
// provided API Instance.  The function takes in a parameter that
// represents the current window.  The function is built to search in a
// specific order and stop when the LMS provided API Instance is found.
// The function begins by searching the current window’s parent, if the
// current window has a parent.  If the API Instance is not found, the
// function then checks to see if there are any opener windows.  If
// the window has an opener, the function begins to look for the
// API Instance in the opener window.
function GetAPI(win)
{
   if ((win.parent != null) && (win.parent != win))
   {
      API = ScanForAPI(win.parent);
   }
   if ((API == null) && (win.opener != null))
   {
      API = ScanForAPI(win.opener);
   }
}

///////////////////////////////////////////
//End ADL-provided API discovery algorithm
///////////////////////////////////////////
  
  
//Create function handlers for the loading and unloading of the page

//Constants
var SCORM_TRUE = "true";
var SCORM_FALSE = "false";
var SCORM_NO_ERROR = "0";

//Since the Unload handler will be called twice, from both the onunload
//and onbeforeunload events, ensure that we only call Terminate once.
var terminateCalled = false;

//Track whether or not we successfully initialized.
var initialized = false;

function ScormProcessInitialize(){
    var result;
    
    GetAPI(window);
    
    if (API == null){
		$.toaster('Could not establish a connection with the LMS.\n\nYour results may not be recorded.', 'Error', 'danger');
        return;
    }
    
    result = API.LMSInitialize("");
    
    if (result == SCORM_FALSE){
        var errorNumber = API.LMSGetLastError();
        var errorString = API.LMSGetErrorString(errorNumber);
        var diagnostic = API.LMSGetDiagnostic(errorNumber);
        
        var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
        
		$.toaster("Could not initialize communication with the LMS.\n\nYour results may not be recorded.\n\n" + errorDescription, 'Error', 'danger');
        return;
    }
    
    initialized = true;
}

function ScormProcessTerminate(){
    
    var result;
    
    //Don't terminate if we haven't initialized or if we've already terminated
    if (initialized == false || terminateCalled == true){return;}
    
    result = API.LMSFinish("");
    
    terminateCalled = true;
    
    if (result == SCORM_FALSE){
        var errorNumber = API.LMSGetLastError();
        var errorString = API.LMSGetErrorString(errorNumber);
        var diagnostic = API.LMSGetDiagnostic(errorNumber);
        
        var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
        
		$.toaster("Could not terminate communication with the LMS.\n\nYour results may not be recorded.\n\n" + errorDescription, 'Error', 'danger');
        return;
    }
}


/*
The onload and onunload event handlers are assigned in launchpage.html because more processing needs to 
occur at these times in this example.
*/
//window.onload = ScormProcessInitialize;
//window.onunload = ScormProcessTerminate;
//window.onbeforeunload = ScormProcessTerminate;

//There are situations where a GetValue call is expected to have an error
//and should not alert the user.
function ScormProcessGetValue(element, checkError){
    
    var result;
    
    if (initialized == false || terminateCalled == true){return;}
    
    result = API.LMSGetValue(element);
    
    if (checkError == true && result == ""){
    
        var errorNumber = API.LMSGetLastError();
        
        if (errorNumber != SCORM_NO_ERROR){
            var errorString = API.LMSGetErrorString(errorNumber);
            var diagnostic = API.LMSGetDiagnostic(errorNumber);
            
            var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
            
			$.toaster("Could not retrieve a value from the LMS.\n\n" + errorDescription, 'Error', 'danger');
            return "";
        }
    }
    
    return result;
}

function ScormProcessSetValue(element, value){
   
    var result;
    
    if (initialized == false || terminateCalled == true){return;}
    
    result = API.LMSSetValue(element, value);
    
    if (result == SCORM_FALSE){
        var errorNumber = API.LMSGetLastError();
        var errorString = API.LMSGetErrorString(errorNumber);
        var diagnostic = API.LMSGetDiagnostic(errorNumber);
        
        var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
        
		$.toaster("Error - Could not store a value in the LMS.\n\nYour results may not be recorded.\n\n" + errorDescription, 'Error', 'danger');
        return;
    }
    
}

function ScormCommitChanges(){
   
    var result;
    
    if (initialized == false || terminateCalled == true){return;}
    
    result = API.LMSCommit("");
    
    if (result == SCORM_FALSE){
        var errorNumber = API.LMSGetLastError();
        var errorString = API.LMSGetErrorString(errorNumber);
        var diagnostic = API.LMSGetDiagnostic(errorNumber);
        
        var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
        
		$.toaster("Error - Could not commit changes to the LMS.\n\nYour results may not be recorded.\n\n" + errorDescription, 'Error', 'danger');
        return;
    }
    
}

function ScormLessonCompleted()
{   
    if (ScormProcessGetValue("cmi.core.lesson_status") == "completed")
        return true;
    
    return false;
}

function ScormLessonPassed()
{   
    if (ScormProcessGetValue("cmi.core.lesson_status") == "passed")
        return true;
    
    return false;
}

function ScormLessonNotAttempted()
{   
    if (ScormProcessGetValue("cmi.core.lesson_status") == "not attempted")
        return true;
    
    return false;
}


function ScormMarkAsCompleted()
{   
    ScormProcessSetValue("cmi.core.lesson_status", "completed");
}

function ScormMarkAsIncomplete()
{   
    ScormProcessSetValue("cmi.core.lesson_status", "incomplete");
}

function ScormMarkAsPassed()
{   
    ScormProcessSetValue("cmi.core.lesson_status", "passed");
}

function ScormMarkAsFailed()
{   
    ScormProcessSetValue("cmi.core.lesson_status", "failed");
}

function ScormMarkAsBrowsed()
{   
    ScormProcessSetValue("cmi.core.lesson_status", "browsed");
}

function ScormSaveAnswer(id, type, student_response, pattern, result)
{   
    ScormProcessSetValue("cmi.interactions." + (id-1) + ".id", id);
    ScormProcessSetValue("cmi.interactions." + (id-1) + ".type", type);
    ScormProcessSetValue("cmi.interactions." + (id-1) + ".student_response", student_response);
    ScormProcessSetValue("cmi.interactions." + (id-1) + ".correct_responses.0.pattern", pattern);
    ScormProcessSetValue("cmi.interactions." + (id-1) + ".result", result);
}

function ScormSaveScore(score, total, sessionTime)
{
    ScormProcessSetValue("cmi.core.score.raw", score);
    ScormProcessSetValue("cmi.core.score.min", 0);
    ScormProcessSetValue("cmi.core.score.max", total);
    ScormProcessSetValue("cmi.core.lesson_status", "passed");
    ScormProcessSetValue("cmi.core.session_time", sessionTime);
    
    var comment = ScormProcessGetValue("cmi.comments");
    
    ScormProcessSetValue("cmi.comments", comment + (new Date()).toString() + "; ");
}
