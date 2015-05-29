$( function () {

Groceries.all();
View.init();

})

// // // // // // // // 

function View() {};
View.render = function(items, parentId, templateId) {
	console.log("items", items);
  // render a template
  var template = _.template($("#" + templateId).html());
  // input data into template and append to parent
  $("#" + parentId).html(template({collection: items}));
};


View.init = function() {
  // groceries form submit event listener
  $("#newGroceries").on("submit", function(e){
    // stop page reload
    e.preventDefault();
    // format form data into a query string
    var groceriesParams = $(this).serialize();
    console.log(groceriesParams);
    // send a post request to put this phrase in db
    Groceries.create(groceriesParams);
  });
}
 
// Groceries OBJECT
function Groceries() {};
Groceries.all = function() {
	console.log(Groceries.all);
  $.get("/groceries", function(res){ 
    // parse the response
    var groceries = JSON.parse(res);
    console.log("groceries", groceries);
    // render the results
    View.render(groceries, "groceries-ul", "groceryTemplate");
  });
};

Groceries.create = function(groceriesParams) {
	console.log(groceriesParams);
  $.post("/groceries", groceriesParams).done(function(res){
    // once done, re-render all foods
    Groceries.all();
  }).done(function(res){
    // reset form
    $("#newGroceries")[0].reset();
  });
}

Groceries.delete = function(phrase) {
  var groceriesId = $().data()._id;
  $.ajax({
    url: '/users/userId/groceries' + groceriesId,
    type: 'DELETE',
    success: function(res) {
      // once successfull, re-render all foods
      Groceries.all();
    }
  })
};
