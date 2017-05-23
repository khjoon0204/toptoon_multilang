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
	
	// Example
	
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
        // 6.0.2
        WVJBIframe.src = 'https://__bridge_loaded__';
        // 5.2.0
        //WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
        
    }
    
    
    setupWebViewJavascriptBridge(function(bridge) {
    	
    	
    	/* Initialize your app here */


		var uniqueId = 1
		function log(message, data) {
			var log = document.getElementById('log')
			var el = document.createElement('div')
			el.className = 'logLine'
			el.innerHTML = uniqueId++ + '. ' + message + ':<br/>' + JSON.stringify(data)
			if (log.children.length) { log.insertBefore(el, log.children[0]) }
			else { log.appendChild(el) }
		}

		alert(bridge);
		
		bridge.registerHandler(registerHandlerName, function(data, responseCallback) {
			log('ObjC called testJavascriptHandler with', data);
			var responseData = { 'Javascript Says':'Right back atcha!' }
			log('JS responding with', responseData);
			responseCallback(responseData);
		});

		document.body.appendChild(document.createElement('br'));

		var callbackButton = document.getElementById('buttons').appendChild(document.createElement('button'));
		callbackButton.innerHTML = 'Fire testObjcCallback';
		callbackButton.onclick = function(e) {
			//e.preventDefault()
			log('JS calling handler "testObjcCallback"')
			bridge.callHandler(callHandlerName, {'foo': 'bar'}, function(response) {
				log('JS got response', response);
			});
		}
    	
    });
    
    namespace.call = function(data){ //외부 노출 함수 public
    	alert(bridge);
    	if(bridge == undefined)return;    	
    	bridge.callHandler(callHandlerName, data, function(response) {
    		log('JS got response', response)
    	});
    };
    
    
    
    return namespace; //리턴을 해야함 
})(window.namespace || {},jQuery); //객체 없으면 생성


