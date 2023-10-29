//-------------------------------------------------------------------------------------
// Roll20Async
// Compensates for a defect in the underlying Roll20 system, where it "loses context"
// (forgets which player is active) during asynchronous methods and callbacks, 
// resulting in error messages like:
//
//      Error: Trying to do getAttrs when no character is active in sandbox.
//
// Include this module to have setTimeout() and setInterval() just start working as 
// expected; no additional setup required.  Additionally, async-safe versions of the
// typical attribute functions will be available:
//
//      getAttrsAsync
//      setAttrsAsync
//      getSectionIDsAsync
//      
function isRunningOnServer() { return self.dispatchEvent == undefined; }
function setActiveCharacterId(charId){
    var oldAcid=getActiveCharacterId();
    var msg={"id":"0", "type":"setActiveCharacter", "data":charId};
    
    if(isRunningOnServer()==false){ //if in a browser, use "dispatchEvent" to process the message
        var ev = new CustomEvent("message");
        ev.data=msg; 
        self.dispatchEvent(ev);
    }else{ //otherwise, use the API (server) message processor, "onmessage"
        self.onmessage({data:msg});
    }
    return oldAcid; //return what the value used to be, so calling code can be a little cleaner 
} 
var _sIn=setInterval;
setInterval=function(callback, timeout){
    var acid=getActiveCharacterId();
    _sIn(
        function(){
            var prevAcid=setActiveCharacterId(acid);
            callback();
            setActiveCharacterId(prevAcid);
        }
    ,timeout);
}
var _sto=setTimeout
setTimeout=function(callback, timeout){
    var acid=getActiveCharacterId();
    _sto(
        function(){
            var prevAcid=setActiveCharacterId(acid);
            callback();
            setActiveCharacterId(prevAcid);
        }
    ,timeout);
}
function getAttrsAsync(props){
    var acid=getActiveCharacterId(); //save the current activeCharacterID in case it has changed when the promise runs 
    var prevAcid=null;               //local variable defined here, because it needs to be shared across the promise callbacks defined below
    return new Promise((resolve,reject)=>{
            prevAcid=setActiveCharacterId(acid);  //in case the activeCharacterId has changed, restore it to what we were expecting and save the current value to restore later
            try{
                getAttrs(props,(values)=>{  resolve(values); }); 
            }
            catch{ reject(); }
    }).finally(()=>{
        setActiveCharacterId(prevAcid); //restore activeCharcterId to what it was when the promise first ran
    });
}
//use the same pattern for each of the following...
function setAttrsAsync(propObj, options){
    var acid=getActiveCharacterId(); 
    var prevAcid=null;               
    return new Promise((resolve,reject)=>{
            prevAcid=setActiveCharacterId(acid);  
            try{
                setAttrs(propObj,options,(values)=>{ resolve(values); });
            }
            catch{ reject(); }
    }).finally(()=>{
        setActiveCharacterId(prevAcid); 
    });
}

function getSectionIDsAsync(sectionName){
    var acid = getActiveCharacterId(); 
    var prevAcid=null;               
    return new Promise((resolve,reject)=>{
            prevAcid = setActiveCharacterId(acid);  
            try{
                getSectionIDs(sectionName,(values)=>{ resolve(values); });
            }
            catch{ reject(); }
    }).finally(()=>{
        setActiveCharacterId(prevAcid); 
    });
}

