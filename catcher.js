var casper = require('casper').create();
var fs = require('fs');
var url = 'http://www.o2online.de/more/kategorie/mehr-erlebnisse/o2-kinotag-plus-eins-tickets-kaufen';
var isDebuggable = true;
var user = require('config.js');

//default time to wait in waitFamily functions. Waits maximum 20 seconds;
casper.options.waitTimeout = 20000;

//starting
casper.start(url);

//Steps made by the screenshots in the folder
//Step 1 Enter Postalcode for your Area and click search button
casper.then(function(){
    this.echo('Step 1 Enter PostalCode');

    debugScreenShot(isDebuggable,'Step1');

    this.waitForSelector('#postalCode',function(){

        //setting value for postalcode and return all Elements that might be the Search button
        casper.evaluate(function(user){
            document.querySelector('#postalCode').value = user.postalCode;
            //Click button to save the code
            var $searchBtn = $('span:contains("Suchen")').parent();
            $searchBtn.click();
        }, user);

    });
});


//Step 2 and 3 Finding the correct Radiobutton for the searched Cinema and click ok button on bottom of page
casper.then(function(){
    this.echo('Step 2 and 3 Find the Radiobutton with correct cinema');
    debugScreenShot(isDebuggable,'Step23');

    casper.waitForText(user.cinemaName,function(){
        //check the radiobutton
        casper.evaluate(function(user){
            //find the span with search query and grab the parent(a label) and the parent(the surrounding div)
            var $parentContainer = $('span:contains("' + user.cinemaName + '")').parent().parent();
            //use first child of div (the radio button)
            var $cinemaRadioBtn = $parentContainer.children().first();
            //check the radiobutton
            $cinemaRadioBtn.prop("checked", true);

            //Click button to save the code
            var $savaCodeBtn = $('span:contains("Code sichern")').parent();
            $savaCodeBtn.click();
        },user);

    });
});

//Step 4 Search for login formular, enter login information and hit login
casper.then(function(){
    this.echo('Step 4 fill login formular and hit login button');
    debugScreenShot(isDebuggable,'Step4');

    //TODO Check each each element exist (casper.exist) and wait or evaluate afterwards
    casper.waitForSelector('#loginButton',function(){
        casper.evaluate(function(user){
            document.querySelector('#IDToken1').value = user.phoneNumber;
            document.querySelector('#IDToken2').value = user.password;
            document.querySelector('#loginButton').click();
        },user);
    });
});

//Step 5 Accept Button reservation
//var acceptButton = 'Teilnehmen';
casper.then(function(){
    this.echo('Step 5 Accept Button reservation');
    debugScreenShot(isDebuggable,'Step5');

    casper.waitForText('Teilnehmen', function(){
        casper.evaluate(function() {
            //Click button to save the code
            var $saveCodeBtn = $('span:contains("Teilnehmen")').parent();
            $saveCodeBtn.click();
        });
    });
});

//Step 6 Find Code and save it to file
casper.then(function(){
    this.echo('Step 6 Find the Code on page');
    debugScreenShot(isDebuggable,'Step6');
    casper.waitForText('Gutscheincode:',function(){
        this.echo('Found String Gutscheincode:');
        //debugScreenShot(isDebuggable,'FinalScreenshot of the Code');
        var code = casper.evaluate(function(){
            var $codeElement = $('p:contains("Gutscheincode:")').children().first();
            return $codeElement.text();
        });

        //if length of node is not 0
        if(!code.length){
            writeInFile(code);
        }
    });
});

//Do this afterwards
casper.then(function(){
    debugScreenShot(isDebuggable,'Finish');

    this.echo('Script should be done');
});


casper.run();

//Debugging screen if gloabl variable debug is true
var debugScreenShot = function(debug, text){

    if(debug){
        //wait 10 seconds and then do the screenshot.
        //The page needs time to render the html elements
        casper.wait(10000,function(){
            casper.capture('screenshots/' + text + '.png')
        });
    }

};

//adding the new code to the current list of codes
var writeInFile = function(code){
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();

    fs.write('codeListLog.txt','' + year + '-' + month + '-' + day + '  Code: ' + code +'\n' , 'w+');
};

