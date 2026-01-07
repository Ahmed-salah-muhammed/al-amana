let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let create = document.getElementById("create");

/*console.log("Title:", title);
console.log("Price:", price);
console.log("Taxes:", taxes);
console.log("Ads:", ads);
console.log("Discount:", discount);
console.log("Total:", total);
console.log("Count:", count);
console.log("Category:", category);
console.log("create:", create);*/

//get total

function getTotal() {
  if (price.value != "") {
    let result = parseFloat(price.value) + Number(taxes.value) + +ads.value - +(discount.value);
    total.innerHTML = `${result} L.E`;
    total.classList.add("bg-green-700");
    total.classList.remove("bg-red-950");
  } else {
    total.innerHTML = "L.E";
    total.classList.remove("bg-green-700");
    total.classList.add("bg-red-950");
  }
}



//create product

function capitalizeFirst(str) {
  if (!str)
    return "";
  str = str.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//save localstorage
let dataPro = [];
localStorage.getItem("product") != null ? dataPro = JSON.parse(localStorage.getItem("product")) : [];

create.onclick = function () {
  let newpro = {
    title: capitalizeFirst(title.value),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML, //form html
    count: count.value,
    category: capitalizeFirst(category.value),
  };

  if (newpro.count >= 1000) {
    if (!confirm(`Are you sure you want to add ${newpro.count} products?`)) {
      return;
    }
  }
  if (newpro.count > 1) {
    for (let i = 0; i < newpro.count; i++) {
      dataPro.push({ ...newpro });
    }
  } else if (+newpro.count === 1) {
    dataPro.push(newpro);
  } else if (newpro.count === "") {
    alert("Please enter a count value to add a new product.");
  } else if (+newpro.count === 0) {
    alert("Please enter a positive number greater than zero.");
  } else {
    alert("Please enter a valid positive count.");

  }

  localStorage.setItem("product", JSON.stringify(dataPro));

  /*if (newpro.title != "") {
    title.value = "";
    price.value = "";
    taxes.value = "";
    ads.value = "";
    discount.value = "";
    total.innerHTML = "L.E";
    count.value = "";
    category.value = "";
    getTotal();*/
  //show toast
  showToast("add", title.value, count.value);
  //clean inputs
  cleaninputs();
  //read data
  readData();

}

//clean inputs
function cleaninputs() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "L.E";
  count.value = "";
  category.value = "";
  getTotal();
}


//read data

function readData() {
  let tableHTML = "";
  let mobileHTML = "";

  for (let i = 0; i < dataPro.length; i++) {

    // ===== desktop table =====
    tableHTML += `
      <tr class="group hover:bg-gray-800 transition">
        <td class="px-4 py-3">${i + 1}</td>
        <td class="px-4 py-3 font-medium">${dataPro[i].title}</td>

        <td class="px-4 py-3">
          <span class="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
            ${dataPro[i].category}
          </span>
        </td>

        <td class="px-4 py-3">${dataPro[i].price} L.E</td>

        <td class="px-4 py-3 text-red-400 font-semibold">${dataPro[i].discount} L.E</td>

        <td class="px-4 py-3 text-green-400 font-bold animate-pulse">
          ${dataPro[i].total}
        </td>

        <td class="px-4 py-3 text-center">
          <div class="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
            <button onclick="updateProduct(${i}, 'desktop')" class="cursor-pointer px-3 py-1 text-xs bg-blue-600 rounded-lg hover:bg-blue-700">
              Update
            </button>
            <button onclick="deleteProduct(${i})" class="cursor-pointer px-3 py-1 text-xs bg-red-600 rounded-lg hover:bg-red-700">
              Delete
            </button>
          </div>
        </td>
      </tr>
  `
    // ===== mobile card  =====
    mobileHTML += `
            <details data-aos="fade-up" class="bg-gray-900 rounded-xl shadow p-4 group">
              <summary class="flex justify-between items-center cursor-pointer">
                <div>
                  <p class="font-semibold">${dataPro[i].title}</p>
                  <p class="text-sm text-green-400">Total: ${dataPro[i].total}</p>
                </div>
                <span class="text-gray-400 group-open:rotate-180 transition"
                  >▼</span
                >
              </summary>

              <div class="mt-4 space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-400">Price</span><span id = "pricemobile">${dataPro[i].price}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-red-400">Discount</span>
                  <span class="text-red-400" id = "discountmobile">${dataPro[i].discount}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">category</span>
                  <span
                    id = "categorymobile"
                    class="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400"
                  >
                    ${dataPro[i].category}
                  </span>
                </div>
              </div>

              <!-- Sticky-like actions -->
              <div class="flex gap-3 mt-4">
                <button
                onclick="updateProduct(${i}, 'mobile')"
                  class="cursor-pointer flex-1 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Update
                </button>
                <button
                onclick="deleteProduct(${i})"
                  class="cursor-pointer flex-1 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </details>
      `;
  }

  document.querySelector(".table-body").innerHTML = tableHTML;

  document.querySelector(".mobile-body").innerHTML = mobileHTML;

  let deleteAllbtn = document.getElementById("deleteAll");
  if (dataPro.length > 0) {
    deleteAllbtn.innerHTML = `Delete All products (${dataPro.length}) 🗑️`;
    deleteAllbtn.classList.remove("hidden");
    deleteAllbtn.onclick = () => {
      dataPro = [];
      localStorage.setItem("product", JSON.stringify(dataPro));
      readData();
    }
  } else {
    deleteAllbtn.classList.add("hidden");
  }
}
readData()

function deleteProduct(i) {
  dataPro.splice(i, 1);
  localStorage.product = JSON.stringify(dataPro);
  readData();
  showToast("delete", title.value[i], count.value[i]);
}



//count
//delete
//update
function updateProduct(i, source = "desktop") {
  let product = dataPro[i];

  if (source === "desktop") {
    let row = document.querySelectorAll(".table-body tr")[i];

    row.children[1].innerHTML = `<input type="text" value="${product.title}" class="w-full px-1 py-0.5 border">`;
    row.children[2].innerHTML = `<input type="text" value="${product.category}" class="w-full px-1 py-0.5 border">`;
    row.children[3].innerHTML = `<input type="number" value="${product.price}" class="w-full px-1 py-0.5 border">`;
    row.children[4].innerHTML = `<input type="number" value="${product.discount}" class="w-full px-1 py-0.5 border">`;
    row.children[5].innerHTML = `${product.total}`;

    row.children[6].innerHTML = `
      <div class="flex justify-center gap-2">
        <button onclick="saveProduct(${i}, 'desktop')" class="bg-blue-600 text-white rounded px-3 py-1">Save</button>
        <button onclick="cancelProduct(${i}, 'desktop')" class="bg-red-600 text-white rounded px-3 py-1">Cancel</button>
      </div>
    `;
    showToast("update", title.value[i], count.value[i]);

  }
  else if (source === "mobile") {
    let card = document.querySelectorAll(".mobile-body details")[i];

    card.querySelector("p.font-semibold").innerHTML = `<input type="text" value="${product.title}" class="w-full px-1 py-0.5 border">`;
    card.querySelector("#pricemobile").innerHTML = `<input type="number" value="${product.price}" class="w-full px-1 py-0.5 border">`;
    card.querySelector("#discountmobile").innerHTML = `<input type="number" value="${product.discount}" class="w-full px-1 py-0.5 border">`;
    card.querySelector("#categorymobile").innerHTML = `<input type="text" value="${product.category}" class="w-full px-1 py-0.5 border">`;
    card.querySelector("p.text-sm.text-green-400").innerHTML = `Total: ${product.total}`;

    let actionsDiv = card.querySelector("div.flex.gap-3");
    actionsDiv.innerHTML = `
      <button onclick="saveProduct(${i}, 'mobile')" class="bg-blue-600 text-white  px-3 py-1 flex-1 rounded-2xl">Save</button>
      <button onclick="cancelProduct(${i}, 'mobile')" class="bg-red-600 text-white rounded-2xl px-3 py-1 flex-1">Cancel</button>
    `;
    showToast("update", title.value, count.value);

  }
}

function saveProduct(i, source = "desktop") {
  let product = dataPro[i];

  if (source === "desktop") {
    let row = document.querySelectorAll(".table-body tr")[i];
    product.title = row.children[1].querySelector("input").value;
    product.category = row.children[2].querySelector("input").value;
    product.price = +row.children[3].querySelector("input").value;
    product.discount = +row.children[4].querySelector("input").value;
    product.total = `${product.price - product.discount} L.E`;

    row.children[1].innerHTML = product.title;
    row.children[2].innerHTML = product.category;
    row.children[3].innerHTML = product.price;
    row.children[4].innerHTML = product.discount;
    row.children[5].innerHTML = `${product.total} L.E`;

    row.children[6].innerHTML = `
      <div class="flex gap-3">
        <button onclick="updateProduct(${i}, 'desktop')" class="bg-blue-600 text-white rounded-2xl px-3 py-1 flex-1 cursor:pointer">Update</button>
        <button onclick="deleteProduct(${i})" class="bg-red-600 text-white rounded-2xl px-3 py-1 flex-1 cursor:pointer">Delete</button>
      </div>
    `;
    showToast("update", title.value[i], count.value[i]);

  }
  else if (source === "mobile") {
    let card = document.querySelectorAll(".mobile-body details")[i];
    product.title = card.querySelector("p.font-semibold input").value;
    product.title = card.querySelector("p.font-semibold input").value;
    product.price = +card.querySelector("#pricemobile input").value;
    product.discount = +card.querySelector("#discountmobile input").value;
    product.category = card.querySelector("#categorymobile input").value;
    product.total = `${product.price - product.discount} L.E`;

    card.querySelector("p.font-semibold").textContent = product.title;
    card.querySelector("p.text-sm.text-green-400").textContent = `Total: ${product.total}`;
    card.querySelector("#pricemobile").textContent = product.price;
    card.querySelector("#discountmobile").textContent = product.discount;
    card.querySelector("#categorymobile").textContent = product.category;


    let actionsDiv = card.querySelector("div.flex.gap-3");
    actionsDiv.innerHTML = `
      <button onclick="updateProduct(${i}, 'mobile')" class="bg-blue-600 text-white rounded-2xl px-3 py-1 flex-1 cursor:pointer">Update</button>
      <button onclick="deleteProduct(${i})" class="bg-red-600 text-white rounded-2xl px-3 py-1 flex-1 cursor:pointer">Delete</button>
    `;
    showToast("update", title.value, count.value);
  }

  localStorage.setItem("product", JSON.stringify(dataPro));
  readData();
}

function cancelProduct(i, source = "desktop") {
  let product = dataPro[i];

  if (source === "desktop") {
    let row = document.querySelectorAll(".table-body tr")[i];
    row.children[1].innerHTML = product.title;
    row.children[2].innerHTML = product.category;
    row.children[3].innerHTML = product.price;
    row.children[4].innerHTML = product.discount;
    row.children[5].innerHTML = `${product.total} L.E`;

    row.children[6].innerHTML = `
      <div class="flex gap-3">
        <button onclick="updateProduct(${i}, 'desktop')" class="bg-blue-600 text-white rounded-2xl px-3 py-1 flex-1">Update</button>
        <button onclick="deleteProduct(${i})" class="bg-red-600 text-white rounded-2xl px-3 py-1 flex-1">Delete</button>
      </div>
    `;
  }
  else if (source === "mobile") {
    let card = document.querySelectorAll(".mobile-body details")[i];
    card.querySelector("p.font-semibold").innerHTML = product.title;
    card.querySelector("#discountmobile").innerHTML = product.discount;
    card.querySelector("#categorymobile").innerHTML = product.category;
    card.querySelector("p.font-semibold").innerHTML = product.title;
    card.querySelector("p.text-sm.text-green-400").innerHTML = `Total: ${product.total}`;



    let actionsDiv = card.querySelector("div.flex.gap-3");
    actionsDiv.innerHTML = `
      <button onclick="updateProduct(${i}, 'mobile')" class="bg-blue-600 text-white rounded-2xl px-3 py-1 flex-1 cursor:pointer">Update</button>
      <button onclick="deleteProduct(${i})" class="bg-red-600 text-white rounded-2xl px-3 py-1 flex-1 cursor:pointer">Delete</button>
    `;
  }
  localStorage.setItem("product", JSON.stringify(dataPro));
  readData();
}
function showToast(type, name = "", count = "") {
  const toast = document.getElementById("toast");

  toast.classList.remove("bg-green-600", "bg-red-600", "bg-blue-600");

  if (type === "add") {
    toast.textContent = `${count} ${name} added successfully ✅`;
    toast.classList.add("bg-green-600");
  }

  if (type === "update") {
    toast.textContent = ` ${name} updated successfully ✏️`;
    toast.classList.add("bg-blue-600");
  }

  if (type === "delete") {
    toast.textContent = `🗑️ ${name} deleted successfully`;
    toast.classList.add("bg-red-600");
  }

  // show
  toast.classList.remove("opacity-0", "translate-y-10");
  toast.classList.add("opacity-100", "translate-y-0");

  // hide
  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-10");
  }, 3000);
}



//search
//clean data
