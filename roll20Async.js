function setActiveCharacterId(charId){
    var oldAcid=getActiveCharacterId();
    var ev = new CustomEvent("message");
    ev.data={"id":"0", "type":"setActiveCharacter", "data":charId};
    self.dispatchEvent(ev); 
    return oldAcid;
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

