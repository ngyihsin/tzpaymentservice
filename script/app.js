function strtoArray(str) {
  var result = [];
  for(var i = 0, length = str.length; i < length; i++) {
    var code = str.charCodeAt(i);
    result.push(code);
  }
  return result;
}

var paymentTest = {

  init: function init() {
    this.current = 0;
    this.navigableItems[this.current].focus();
    window.addEventListener('keyup', this);
    window.addEventListener('keydown', this);
    window.addEventListener('hashchange', this);
    // this.all_result = document.getElementById('all_result');

    this.invoke_result = document.getElementById('invoke_result');
    this.abort_result = document.getElementById('abort_result');
    this.close_result = document.getElementById('close_result');
    this.selectedCase = document.getElementById('selectedCase');
    this.isAvailable_result = document.getElementById('isAvailable_result');
    var lock = navigator.mozSettings.createLock();
  },

  uninit: function uninit() {

  },

  get navigableItems() {
    delete this.navigableItems;
    return this.navigableItems = document.querySelectorAll('.navigable');
  },

  handleEvent: function handleEvent(ev) {
    dump("handleEvent:" + ev.type);
    switch (ev.type) {
      case 'click':
        if (ev.target.id === "exit-button") {
          window.location.hash = '';
        }
        break;
      case 'load':
        break;
      case 'unload':
        break;
      case 'hashchange':
        break;
      case 'transitionend':
        break;
      case 'keydown':
        this.handleKeydown(ev);
        break;
      case 'keyup':
        this.handleKeyup(ev);
        break;
    }
  },

  disSelectAll: function () {
    this.sendMoney.checked = false;
    this.getMoney.checked = false;
    this.stop.checked = false;
  },

  handleKeydown: function ut_handleKeydown(ev) {
    var key = ev.key;
    dump("handleKeydown " + key );
    switch(key) {
      case 'Enter':
        if (ev.target.id == "invoke_button") {
          let regName = "JohnYouarethebest";
          let regArray = strtoArray(regName);
          navigator.teeReader.openSession('Payment')
          .then(function(session){
            window.session1 = session;
            console.log('invoke use case:' +  this.selectedCase.value);
            return session.invoke({application: this.selectedCase.value, data: regArray});
          })
          .then((result)=>{
            console.log('Invoke PinRegistration use case: result: '+ result.result + ' data:' + result.data);
            paymentTest.invoke_result.textContent = "Invoke " + this.selectedCase.value + " Success";
          })
          .catch((e) => {
            console.log('Error:' + e);
            paymentTest.invoke_result.textContent = "Invoke " + this.selectedCase.value + " Failed:" + e;
          });
        } else if (ev.target.id == "abort_button") {
          if (!window.session1) {
            paymentTest.abort_result.textContent = "Close " + this.selectedCase.value + " Failed: invalid session";
            return;
          }

          window.session1.abort()
          .then(()=>{
            paymentTest.abort_result.textContent = "Abort " + this.selectedCase.value + " Success";
          })
          .catch((e)=>{
            paymentTest.abort_result.textContent = "Abort " + this.selectedCase.value + " Failed:" + e;
          })
        } else if (ev.target.id == "close_button") {
          if (!window.session1) {
            paymentTest.close_result.textContent = "Close " + this.selectedCase.value + " Failed: invalid session";
            return;
          }
          window.session1.close()
          .then(()=>{
            paymentTest.close_result.textContent = "Close " + this.selectedCase.value + " Success";
          })
          .catch((e)=>{
            paymentTest.close_result.textContent = "Close " + this.selectedCase.value + " Failed:" + e;
          })
          window.session1 = null;
        } else if (ev.target.id == "isAvailable-button") {
          let teeReader = navigator.teeReader;
          if (!teeReader || teeReader.isPresent == false) {
            paymentTest.isAvailable_result.textContent = "Failed";
            return;
          }
          paymentTest.isAvailable_result.textContent = "Success";
        } else if (ev.target.id == "all-button") {
          navigator.teeReader.openSession('Payment')
          .then(function(session){
            window.session = session;
            return session.invoke({application: 'PinRegistration', data:[1, 2, 2, 2]});
          })
          .then((result)=>{
            console.log('Invoke PinRegistration use case: result: '+ result.result + ' data:' + result.data);
            return window.session.abort();
          })
          .then(()=>{
            console.log('abort PinRegistration session');
            return window.session.invoke({application: 'PinChange', data:[1, 3, 3, 3]});
          })
          .then((result)=>{
            console.log('Invoke PinChange use case: result: '+ result.result + ' data:' + result.data);
            return window.session.abort();
          })
          .then(()=>{
            console.log('abort PinChange session');
            return window.session.invoke({application: 'SecureIndicatorUpdate', data:[1, 3, 3, 3]});
          })
          .then((result)=>{
            console.log('Invoke SecureIndicatorUpdate use case: result: '+ result.result + ' data:' + result.data);
            return window.session.abort();
          })
          .then(()=>{
            console.log('abort SecureIndicatorUpdate session');
            return window.session.invoke({application: 'InitiatePayment', data:[1, 3, 3, 3]});
          })
          .then((result)=>{
            console.log('Invoke InitiatePayment use case: result: '+ result.result + ' data:' + result.data);
            return window.session.abort();
          })
          .then(()=>{
            console.log('abort InitiatePayment session');
            return window.session.invoke({application: 'ReceivePayment', data:[1, 3, 3, 3]});
          })
          .then((result)=>{
            console.log('Invoke ReceivePayment use case: result: '+ result.result + ' data:' + result.data);
            return window.session.abort();
          })
          .then(()=>{
            console.log('abort ReceivePayment session');
            return window.session.close();
          })
          .then(()=> {
            console.log('close the session');
            //paymentTest.all_result.textContent = "Success";
          })
          .catch((e) => {
            console.log('Error:' + e);
            //paymentTest.all_result.textContent = "Failed:" + e;
          });
        } else if (ev.target.id == "clear_button") {
          navigator.teeReader.closeAll();
          //paymentTest.all_result.textContent = "";
          paymentTest.invoke_result.textContent = "";
          paymentTest.close_result.textContent = "";
          paymentTest.abort_result.textContent = "";
          paymentTest.isAvailable_result.textContent = "";
        }
        break;
      case 'ArrowUp':
        this.current -= 1;
        if (this.current < 0) {
          this.current = this.navigableItems.length;
        }
        this.navigableItems[this.current].focus();
        break;
      case 'ArrowDown':
        this.current += 1;
        this.current %= this.navigableItems.length;
        this.navigableItems[this.current].focus();
        break;
      case 'BrowserBack':
      case 'Backspace':
        break;
    }
  },

  handleKeyup: function ut_handleKeyup(ev) {
    var key = ev.key;
    switch(key) {
      case 'BrowserBack':
      case 'Backspace':
        break;
    }
  }
};
window.addEventListener('load', paymentTest.init.bind(paymentTest));
