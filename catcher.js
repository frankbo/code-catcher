var casper = require('casper').create();
//TODO write answer in file on hd;
var system = require('system');
var url = 'http://www.o2online.de/more/kategorie/mehr-erlebnisse/o2-kinotag-plus-eins-tickets-kaufen';
var debugable = true;
var user = require('config.js');

//starting
casper.start(url);

//Steps made by the screenshots in the folder
//Step 1 Enter Postalcode for your Area and click search button
casper.then(function(){
    this.echo('Step 1 Enter PostalCode');
    debugScreenShot(debugable,'Step1');

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
    debugScreenShot(debugable,'Step23');

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
    debugScreenShot(debugable,'Step4');

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
var acceptButton = 'Teilnehmen';
casper.then(function(){
    this.echo('Step 5 Accept Button reservation');
    debugScreenShot(debugable,'Step5');

    casper.waitForText(acceptButton, function(){
        casper.evaluate(function(acceptButton) {
            //Click button to save the code
            var $savaCodeBtn = $('span:contains("' + acceptButton + '")').parent();
            $savaCodeBtn.click();
        }, acceptButton);
    });
});

//Step 6 Find Code and save it to file
casper.then(function(){
    this.echo('Step 6 Find the Code on page');
    debugScreenShot(debugable,'Step6');

    casper.waitForText('Gutscheincode:',function(){
        debugScreenShot(debugable,'FinalScreenshot of the Code');
        var code = casper.evaluate(function(){
            var $codeElement = $('p:contains("Gutscheincode")').children().first();
            return $codeElement.text();
        });

        this.echo(code);

    })
});

//Do this afterwards
casper.then(function(){
    this.echo('Script should be done');
});

casper.run();

//Debugging screen in gloabl variable debug is true
var debugScreenShot = function(debug, text){

    if(debug){
        console.log('Rendering ' + text + '.png')
        window.setTimeout(casper.capture(text + '.png'),1000);
    }

};

