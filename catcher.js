//var page = require('webpage').create();
var casper = require('casper').create();
var system = require('system');
var url = 'http://www.o2online.de/more/kategorie/mehr-erlebnisse/o2-kinotag-plus-eins-tickets-kaufen';
var debugable = true;

//personal Information for login
var user = {
    phoneNumber: 0,
    password: '',
    zip: '10559',
    cinemaName: ''
};

/**
 * page logging inside of evaluate scope
 * @param msg
 */
/*page.onConsoleMessage = function(msg) {
    system.stderr.writeLine( 'console in eval: ' + msg );
};

if(system.args.length < 3){
    console.log('Please set as first argument your phone number, as second your password');
    phantom.exit();
} else {
    userInformation.phoneNumber = system.args[1];
    userInformation.password = system.args[2];

    console.log('PhoneNumber = ' + userInformation.phoneNumber);
    console.log('Password  = ' + userInformation.password);
}*/

//var buttonClassList = '.btn .mid .red .button .width3';
var buttonClassList = 'red';

//starting
casper.start(url);

//Step 1 Enter Postalcode for your Area and click search button
casper.then(function(){
    this.echo('Step 1 Enter PostalCode');
    this.waitForSelector('#postalCode',function(){

        //setting value for postalcode and return all Elements that might be the Search button
        var elements = casper.evaluate(function(postalCodeInformation){
            document.querySelector('#postalCode').value = user.postalCode;
            return document.querySelectorAll('a.btn.button.blue');
        }, postalCodeInformation);

        var correctButton = findCorrectByText('Suchen', elements);

        //click anchor with the correct Text
        casper.evaluate(function(id){
            $('#'+id).trigger('click');
        },correctButton.id);
    });
});

//Step 2

//Search for the red labeld button with buttonText on it and click it.
var buttonText = 'Alarm bestellen'
casper.then(function(){
    casper.waitForText(buttonText, function(){
        var elements = casper.evaluate(function() {
            return document.querySelectorAll('a.btn.mid.red.button');
        });

        var correctButton = findCorrectByText('Alarm bestellen', elements);

        //click anchor with the correct Text
        casper.evaluate(function(id){
            $('#'+id).trigger('click');
        },correctButton.id);
    });
});

//Search for login formular, enter login information and hit login
casper.then(function(){

    //TODO Check each each element exist (casper.exist) and wait or evaluate afterwards
    casper.waitForSelector('#loginButton',function(){
        casper.evaluate(function(user){
            document.querySelector('#IDToken1').value = user.phoneNumber;
            document.querySelector('#IDToken2').value = user.password;
            document.querySelector('#loginButton').click();
        },user);
        casper.wait(5000,function(){casper.capture('LoginFilled.png')});
    });
});


casper.then(function(){
    this.echo('Do this after timeout');
});

casper.run();



var findCorrectByText = function(text, elements){
//checking if the list of elements has at least one element
    if(elements === null || typeof elements === 'undefined'){
        this.echo('no Elements found')
        casper.exit();
    }

    if(!elements.length > 0){
        this.echo('no Elements found')
        casper.exit();
    }

    //go through all elements in list
    for(var i = 0; i < elements.length; i++){
        this.echo(elements.length);
        if(elements[i] === null || typeof elements[i] === 'undefined'){
            continue;
        }

        //substring because of other characters or whitespaces in the button text
        if(elements[i].innerText.substring(0,buttonText.length) === buttonText && elements[i].localName === 'a'){
            console.log('Button with ' + buttonText + ' found');
            return elements[i];
        }
    }
}

/**
 * get called when the pageload is finished. init
 * @param status
 */
/*page.onLoadFinished = function(status){
    //timeout so that all script are loaded
    window.setTimeout(function(){
        if(status !== 'success'){
            console.log('Connection to server failed, try in your browser');
        } else {
            //var elements = findElementsByClassnames('btn mid red button width3');
            enterPostalCode();
        }
        phantom.exit();
    },3000);
};*/



/**
 * Enter postalCode and press Searchbutton
 */
var enterPostalCode = function(){
    var postalCodeInformation = {
        buttonClasses:'',
        postalCode: userInformation.zip
    }

    var isEntered = page.evaluate(function(postalCodeInformation){
        var finished = false;
        console.log('PostalcodeLength ' + $('#postalCode').length);
        $('#postalCode').val(postalCodeInformation.postalCode);
        //PRESSING ENTER BELOW IS NOT WORKING FROM PAGE SIDE.
        //$.event.trigger({type:'keypress', which: 13});
        finished = true;
        return finished;
    }, postalCodeInformation);

    console.log('Postalcode is entered ' + isEntered);
    debugScreenShot(debugable, 'postalCode');
}

/**
 * Entering Username and Password to login so that the zip code can be inserted
 * @param phoneNumber
 * @param password
 */
/*var enterUserInformation = function(){

    var isEntered = page.evaluate(function (_userInfo) {
        var finished = false;

        repeatUntilAvailable(document.querySelector('#IDToken1'), function(element){
            element.value = _userInfo.phoneNumber;
        });

        repeatUntilAvailable(document.querySelector('#IDToken2'), function(element){
            element.value = _userInfo.password;
        });

        repeatUntilAvailable(document.querySelector('#loginButton'), function(element){
            element.click();
        });

        //debug scrennshot
        debugScreenShot(debugable, '2_AfterLoginInformation');

        return finished;
    }, userInformation);

    console.log('Userinformation are entered ' + isEntered);

};*/

var debugScreenShot = function(debug, text){

    if(typeof debug !== 'boolean'){
        console.log('typof of debug is not boolean');
        return -1;
    }

    if(debug){
        console.log('Rendering ' + text + '.png')
        window.setTimeout(casper.capture(text + '.png'),1000);
        return 1;
    }

    return 1;
};

