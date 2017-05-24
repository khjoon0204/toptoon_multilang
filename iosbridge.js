/**
 *  ios bridge module
 *  2017.05.24
 *  by haejoon Kim
 *  
 */

var iosbridge = (function(namespace, $, undefined){

	// $ = jQuery임 전역번수를 지역변수로 전달하면 실행함수내에서 지역변수로 사용하기때문에 탐색작업이 좀더 빨라진다
    
	var bridge;
	
	// Example
	/*
	var i  = 0;
 
    function func1(){ //내부 함수 private
        alert(i);      
    };
    namespace.func2 = function(){ //외부 노출 함수 public
        alert(i);      
    };
    
    */

    
    
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
    	//alert('bridge Initialize!');


	    namespace.send = function(name, data, callback){ //외부 노출 함수 public
	    	if(bridge == undefined)return;    	
	    	bridge.callHandler(name, data, function(response) {
	    		//alert('JS got response = '+ response + ' data = ' + data);
	    		callback(name, data, response);
	    	});
	    }
    	
	    namespace.recv = function(name, callback){
	    	if(bridge == undefined)return; 
	    	bridge.registerHandler(name, function(data, responseCallback) {
				responseCallback("WEB: recv ios send data = " + data);
				callback(data, responseCallback);
			});
	    }

	    $(namespace).trigger('ready');
	    
	    
    });
    
    
    
    
    return namespace; //리턴을 해야함
    
})(window.namespace || {},jQuery); //객체 없으면 생성


