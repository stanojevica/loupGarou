function checkingColor(checkClass) {
    for (let i = 0; i < checkClass.length; i++) {
      checkClass[i].addEventListener("change", function () {
        all()
      })
    }
  }
  function checkingStatus(checkClass) {
    for (let i = 0; i < checkClass.length; i++) {
      checkClass[i].addEventListener("change", function () {
        all();
      })
    }
  }
  function sort() {
    document.getElementById("sortBox").addEventListener("change", function () {
      all()
    });
  }

function all() {
  let products = JSON.parse(localStorage.getItem("allProducts"));
  let sorting = products;
  if (document.getElementById("sortBox").value != 0) {
    switch (document.getElementById("sortBox").value) {
      case "a-z":
        sorting = products.sort(function (a, b) {
          if (a.model > b.model) {
            return 1;
          } else if (a.model < b.model) {
            return -1;
          }
          return 0;
        });
        break;
      case "z-a":
        sorting = products.sort(function (a, b) {
          if (a.model < b.model) {
            return 1;
          } else if (a.model > b.model) {
            return -1;
          }
          return 0;
        });
        break;
      case "price ascending":
        sorting = products.sort((a, b) => b.price - a.price);
        break;
      case "price descending":
        sorting = products.sort((a, b) => a.price - b.price);
        break;
    }
    if (sorting != 0) {
      localStorage.setItem("all", JSON.stringify(sorting));
    }
  }

  let searchBox = document.getElementById("searchText");

  if (searchBox.value.length != 0) {
    localStorage.setItem("all", JSON.stringify(sorting.filter((p) => p.model.toLowerCase().includes(searchBox.value))));
  }

  let filterArrStatus = [];
  let checkedStatus = 0;
  let statuses = document.getElementsByClassName("checkboxStatus");
  for (let i = 0; i < statuses.length; i++) {
    if (statuses[i].checked) {
      filterArrStatus.push(statuses[i].name);
      checkedStatus = 1;
    }
  }
  if (checkedStatus != 0) {
    let statusResult = sorting.filter(c => filterArrStatus.includes(c.status));
    localStorage.setItem("all", JSON.stringify(statusResult));
  }
  products = JSON.parse(localStorage.getItem("all"));
  let filterArrColor = [];
  let checkedColor = 0;
  let colors = document.getElementsByClassName("checkboxColor");
  for (let i = 0; i < colors.length; i++) {
    if (colors[i].checked) {
      filterArrColor.push(colors[i].name);
      checkedColor = 1;
    }
  }
  if (checkedColor != 0) {
    let colorResult = sorting.filter((cc) => filterArrColor.includes(cc.color));
    localStorage.setItem("all", JSON.stringify(colorResult));
  }
  showProducts(JSON.parse(localStorage.getItem("all")));
  if (JSON.parse(localStorage.getItem("all")).length == 0) {
    document.getElementById("productsAllSec").innerHTML = ` <div id="noresult">
    <p>No result</p>
  </div>`;
  }
  localStorage.setItem("all", JSON.stringify(JSON.parse(localStorage.getItem("allProducts"))));
  showDetalis()
}