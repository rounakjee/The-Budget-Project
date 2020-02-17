// @ts-nocheck
//* The Budget Controller handles all the Business Logics..
var budgetController = (function() {})();

//* The UI Controller handles all the FrontEnd Actions..
var uiController = (function() {
  var DOMSTRINGS = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn"
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMSTRINGS.inputType).value,
        description: document.querySelector(DOMSTRINGS.inputDescription).value,
        value: document.querySelector(DOMSTRINGS.inputValue).value
      };
    }
  };
})();

//* The Controller which is the global app Controller is the bridge between
//* budget controller and ui controller..
var Controller = (function(budgetCtr, uiCtr) {
  var setupEventListeners = function() {
    document
      .querySelector(uiCtr.DOMSTRINGS.inputButton)
      .addEventListener("click", ctrAddItem);
    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrAddItem();
      }
    });
  };
  var ctrAddItem = function() {
    var inputdata = uiCtr.getInput();
    console.log(inputdata);
  };
})(budgetController, uiController);
