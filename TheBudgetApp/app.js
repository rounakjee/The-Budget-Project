// @ts-nocheck
//* The Budget Controller handles all the Business Logics..
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var total = 0;
    data.allItems[type].forEach(function(current) {
      total += current.value;
    });
    data.totals[type] = total;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    data,
    addItem: function(type, desc, val) {
      var newItem, ID;
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      if (type === "exp") {
        newItem = new Expense(ID, desc, val);
      } else if (type === "inc") {
        newItem = new Income(ID, desc, val);
      }
      data.allItems[type].push(newItem);
      return newItem;
    },
    deleteItem: function(type, Id) {
      var itemIndex, ids;
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });
      itemIndex = ids.indexOf(Id);
      if (itemIndex !== -1) {
        data.allItems[type].splice(itemIndex, 1);
      }
    },
    calculateBudget: function() {
      //1. calculate total expenses and income

      calculateTotal("exp");

      calculateTotal("inc");

      //2. calcualte the budget income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      //3. calculate the percentage of expense done expense/income *100
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    }
  };
})();

//* The UI Controller handles all the FrontEnd Actions..
var uiController = (function() {
  var DOMSTRINGS = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    container: ".container"
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMSTRINGS.inputType).value,
        description: document.querySelector(DOMSTRINGS.inputDescription).value,
        value: parseFloat(document.querySelector(DOMSTRINGS.inputValue).value)
      };
    },
    addListItem: function(obj, type) {
      var html, newHtml, element;
      if (type === "inc") {
        element = DOMSTRINGS.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%">' +
          '<div class="item__description">%description%</div>' +
          '<div class="right clearfix"><div class="item__value">+ %value%</div>' +
          '<div class="item__delete"><button class="item__delete--btn">' +
          '<i class="ion-ios-close-outline"></i>' +
          "</button></div></div></div>";
      } else if (type === "exp") {
        element = DOMSTRINGS.expensesContainer;

        html =
          '<div class="item clearfix" id="exp-%id%">' +
          '<div class="item__description">%description%</div>' +
          '<div class="right clearfix">' +
          '<div class="item__value">- %value%</div>' +
          '<div class="item__percentage">21%</div>' +
          '<div class="item__delete">' +
          '<button class="item__delete--btn"><i class="ion-ios-close-outline">' +
          "</i></button>" +
          "</div></div></div>";
      }

      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    deleteItem: function(selectorId) {
      var el = document.getElementById(selectorId);
      el.parentNode.removeChild(el);
    },
    clearFields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMSTRINGS.inputDescription + "," + DOMSTRINGS.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },
    getDOMSTRINGS: function() {
      return DOMSTRINGS;
    },
    updateBudget: function(bud) {
      document.querySelector(".budget__income--value").textContent =
        bud.totalInc;
      document.querySelector(".budget__expenses--value").textContent =
        bud.totalExp;
      document.querySelector(".budget__value").textContent = bud.budget;

      if (bud.percentage > 0) {
        document.querySelector(".budget__expenses--percentage").textContent =
          bud.percentage + "%";
      } else {
        document.querySelector(".budget__expenses--percentage").textContent =
          "----";
      }
    }
  };
})();

//* The Controller which is the global app Controller is the bridge between
//* budget controller and ui controller..
var Controller = (function(budgetCtr, uiCtr) {
  var DOM = uiCtr.getDOMSTRINGS();

  var setupEventListeners = function() {
    document
      .querySelector(DOM.inputButton)
      .addEventListener("click", ctrAddItem);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrAddItem();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrDeleteItem);
  };

  var updateBudget = function() {
    //1.calculate the budget
    budgetCtr.calculateBudget();
    //2. return the budget
    var budget = budgetCtr.getBudget();
    console.log(budget);
    //3. display budget to the ui
    uiCtr.updateBudget(budget);
  };

  var updatePercentages = function() {};

  var ctrAddItem = function() {
    //1. Get the field input data..
    var inputdata = uiCtr.getInput();

    if (
      inputdata.description !== "" &&
      !isNaN(inputdata.value) &&
      inputdata.value > 0
    ) {
      //2. Add the item to the budget controller..
      var newItem = budgetCtr.addItem(
        inputdata.type,
        inputdata.description,
        inputdata.value
      );
      console.log(newItem);
      //3. add the item to the UI..
      uiCtr.addListItem(newItem, inputdata.type);
      //4. Clear the fields
      uiCtr.clearFields();
      //5.update the budget
      updateBudget();
      //6.calculate and update the percentages
      updatePercentages();
    }
  };

  var ctrDeleteItem = function(event) {
    var itemId, splitId, type, Id;

    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemId) {
      splitId = itemId.split("-");
      type = splitId[0];
      Id = parseInt(splitId[1]);

      budgetCtr.deleteItem(type, Id);
      uiCtr.deleteItem(itemId);
      updateBudget();
      updatePercentages();
    }
  };

  return {
    init: function() {
      console.log("Application has started!");
      updateBudget();
      setupEventListeners();
    }
  };
})(budgetController, uiController);

Controller.init();
