/**
 *  ios bridge module
 *  by haejoon Kim
 *  
 */

var iosbridge = (function(namespace, $, undefined){
// $ = jQuery임 전역번수를 지역변수로 전달하면 실행함수내에서 지역변수로 사용하기때문에 탐색작업이 좀더 빨라진다
    
	var registerHandlerName = 'testObjcCallback';
	var callHandlerName = 'testJavascriptHandler';
	var bridge;
	
	var i  = 0;
 
    function func1(){ //내부 함수 private
        alert(i);      
    };
    namespace.func2 = function(){ //외부 노출 함수 public
        alert(i);      
    };
   
    
    // Todo
    
    function setupWebViewJavascriptBridge(callback) {
    	if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    	if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    	window.WVJBCallbacks = [callback];
    	var WVJBIframe = document.createElement('iframe');
    	WVJBIframe.style.display = 'none';
    	WVJBIframe.src = 'https://__bridge_loaded__';
    	document.documentElement.appendChild(WVJBIframe);
    	setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    }
    
    setupWebViewJavascriptBridge(function(bridge) {
    	
    	
    	/* Initialize your app here */

    	bridge.registerHandler(registerHandlerName, function(data, responseCallback) {
    		//console.log("JS Echo called with:", data);
    		alert("JS Echo called with:" + data);
        	this.bridge = bridge;    		
        	alert('assigned bridge!');
    		responseCallback(data);
    	});
    	bridge.callHandler(callHandlerName, {'key':'value'}, function responseCallback(responseData) {
    		//console.log("JS received response:", responseData);
    		alert("JS received response:" + responseData);
    	});
    });
    
    namespace.call = function(data){ //외부 노출 함수 public
    	alert(bridge);
    	if(bridge == undefined)return;    	
    	bridge.callHandler(callHandlerName, data, function responseCallback(responseData) {
    		
    	});
    };
    
    
    
    return namespace; //리턴을 해야함 
})(window.namespace || {},jQuery); //객체 없으면 생성


