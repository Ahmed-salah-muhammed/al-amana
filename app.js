let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let create = document.getElementById("create");

// =================== TOAST SYSTEM (DARK STYLE) ===================
const notifications = document.getElementById("notifications");

const toastDetails = {
  timer: 5000,
  success: {
    icon: 'fa-circle-check',
    title: 'Success',
    color: 'bg-emerald-500',
    glow: 'shadow-emerald-500/20',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500'
  },
  error: {
    icon: 'fa-circle-exclamation',
    title: 'Error',
    color: 'bg-red-500',
    glow: 'shadow-red-500/20',
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-500'
  },
  warning: {
    icon: 'fa-triangle-exclamation',
    title: 'Warning',
    color: 'bg-amber-500',
    glow: 'shadow-amber-500/20',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500'
  },
  info: {
    icon: 'fa-circle-info',
    title: 'Info',
    color: 'bg-blue-500',
    glow: 'shadow-blue-500/20',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500'
  }
}

function showToast(type, message = "") {
  const { icon, title, color, glow, iconBg, iconColor } = toastDetails[type];
  const toast = document.createElement("li");
  toast.className = `toast animate-show pointer-events-auto relative flex items-center w-[340px] p-4 bg-[#1e293b] border border-gray-800 rounded-xl shadow-2xl ${glow} overflow-hidden list-none`;

  toast.innerHTML = `
        <div class="flex items-start gap-4 w-full">
            <div class="${iconBg} p-2 rounded-lg flex items-center justify-center">
                <i class="fa-solid ${icon} ${iconColor} text-xl"></i>
            </div>
            <div class="flex-1 pr-6">
                <h4 class="text-white font-bold text-sm mb-0.5">${title}</h4>
                <p class="text-gray-400 text-xs leading-relaxed">${message || `This is a ${type} toast.`}</p>
            </div>
            <button onclick="removeToast(this.parentElement.parentElement)" class="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                <i class="fa-solid fa-xmark text-sm"></i>
            </button>
        </div>
        <div class="absolute bottom-0 left-0 h-1 w-full ${color} toast-progress shadow-lg"></div>
    `;

  notifications.appendChild(toast);
  toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
}

function removeToast(toast) {
  toast.classList.add("animate-hide");
  if (toast.timeoutId) clearTimeout(toast.timeoutId);
  setTimeout(() => toast.remove(), 400);
}
// =====================================================

function getTotal() {
  if (price.value != "") {
    let result = parseFloat(price.value) + Number(taxes.value) + +ads.value - +(discount.value);
    total.innerHTML = `${result} جنيهًا`;
    total.classList.add("bg-emerald-600/20", "text-emerald-400", "border-emerald-500/50");
    total.classList.remove("bg-red-900/30", "text-red-400", "border-gray-700");
  } else {
    total.innerHTML = "L.E";
    total.classList.remove("bg-emerald-600/20", "text-emerald-400", "border-emerald-500/50");
    total.classList.add("bg-red-900/30", "text-red-400", "border-gray-700");
  }
}

discount.oninput = () => {
  if (+discount.value > +price.value) {
    showToast("error", "Discount cannot be greater than price");
    discount.value = "";
    discount.classList.add("border-red-500");
    discount.classList.remove("border-emerald-500/50");
    return;
  } else {
    discount.classList.remove("border-red-500");
    discount.classList.add("border-emerald- 500/50");
  }
};


function capitalizeFirst(str) {
  if (!str) return "";
  str = str.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

let dataPro = [];
localStorage.getItem("product") != null ? dataPro = JSON.parse(localStorage.getItem("product")) : [];

create.onclick = function () {
  if (title.value == "" || price.value == "" || category.value == "") {
    showToast("error", "Please fill in all required fields to create a product.");
    return;
  }

  let newpro = {
    title: capitalizeFirst(title.value),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value || 1,
    category: capitalizeFirst(category.value),
  };

  if (newpro.count > 1) {
    for (let i = 0; i < newpro.count; i++) {
      dataPro.push({ ...newpro });
    }
    showToast("success", `Successfully created ${newpro.count} items of ${newpro.title}.`);
  } else {
    dataPro.push(newpro);
    showToast("success", `${newpro.title} has been added to your inventory.`);
  }
  localStorage.setItem("product", JSON.stringify(dataPro));
  cleaninputs();
  readData();
}

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

function readData(data = dataPro) {
  let tableHTML = "";
  let mobileHTML = "";

  for (let i = 0; i < dataPro.length; i++) {
    tableHTML += `
      <tr class="group hover:bg-[#1e293b] transition-colors border-b border-gray-800/50">
        <td class="px-6 py-4 text-gray-500 font-mono text-xs">${i + 1}</td>
        <td class="px-6 py-4 font-semibold text-gray-200">${dataPro[i].title}</td>
        <td class="px-6 py-4">
          <span class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">${dataPro[i].category}</span>
        </td>
        <td class="px-6 py-4 text-gray-300">${dataPro[i].price} <span class="text-[10px] text-gray-600">L.E</span></td>
        <td class="px-6 py-4 text-red-400/80">${dataPro[i].discount} <span class="text-[10px] text-gray-600">L.E</span></td>
        <td class="px-6 py-4 text-emerald-400 font-bold">${dataPro[i].total}</td>
        <td class="px-6 py-4">
          <div class="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button onclick="updateProduct(${i}, 'desktop')" class="p-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all"><i class="fa-solid fa-pen text-xs"></i></button>
            <button onclick="deleteProduct(${i})" class="p-2 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all"><i class="fa-solid fa-trash text-xs"></i></button>
          </div>
        </td>
      </tr>
    `;
    mobileHTML += `
      <div class="bg-[#1e293b] rounded-xl p-4 border border-gray-800 shadow-lg">
        <div class="flex justify-between items-start mb-3">
            <div>
                <h3 class="font-bold text-gray-200">${dataPro[i].title}</h3>
                <span class="text-[10px] text-blue-400 uppercase font-bold">${dataPro[i].category}</span>
            </div>
            <div class="text-right">
                <p class="text-emerald-400 font-bold text-sm">${dataPro[i].total}</p>
            </div>
        </div>
        <div class="flex gap-2 mt-4">
            <button onclick="updateProduct(${i}, 'mobile')" class="flex-1 py-2 bg-blue-600/10 text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">تعديل المنتج</button>
            <button onclick="deleteProduct(${i})" class="flex-1 py-2 bg-red-600/10 text-red-400 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all">حذف المنتج</button>
        </div>
      </div>
    `;
  }

  document.querySelector(".table-body").innerHTML = tableHTML;
  document.querySelector(".mobile-body").innerHTML = mobileHTML;

  let deleteAllbtn = document.getElementById("deleteAll");
  if (dataPro.length > 0) {
    deleteAllbtn.innerHTML = `مســح جميـــع المنتجـــات (${dataPro.length})`;
    deleteAllbtn.classList.remove("hidden");
    deleteAllbtn.onclick = () => {
      showToast("warning", "Are you sure? This will wipe all data.");
      setTimeout(() => {
        if (confirm("Confirm deletion of all products?")) {
          dataPro = [];
          localStorage.setItem("product", JSON.stringify(dataPro));
          readData();
          showToast("info", "Database has been cleared.");
        }
      }, 100);
    }
  } else {
    deleteAllbtn.classList.add("hidden");
  }
}
readData();


function deleteProduct(i) {
  let name = dataPro[i].title;
  dataPro.splice(i, 1);
  localStorage.product = JSON.stringify(dataPro);
  readData();
  showToast("success", `Removed ${name} from the list.`);
}

function updateProduct(i, source = "desktop") {
  let product = dataPro[i];

  if (source === "desktop") {
    let row = document.querySelectorAll(".table-body tr")[i];
    row.children[1].innerHTML = `<input type="text" value="${product.title}" class="w-full p-1 bg-[#0f172a] border border-gray-700 rounded text-xs outline-none focus:border-blue-500">`;
    row.children[2].innerHTML = `<input type="text" value="${product.category}" class="w-full p-1 bg-[#0f172a] border border-gray-700 rounded text-xs outline-none focus:border-blue-500">`;
    row.children[3].innerHTML = `<input type="number" value="${product.price}" class="w-full p-1 bg-[#0f172a] border border-gray-700 rounded text-xs outline-none focus:border-blue-500">`;
    row.children[4].innerHTML = `<input type="number" value="${product.discount}" class="w-full p-1 bg-[#0f172a] border border-gray-700 rounded text-xs outline-none focus:border-blue-500">`;
    row.children[6].innerHTML = `
      <div class="flex justify-center gap-2">
        <button onclick="saveProduct(${i}, 'desktop')" class="p-1.5 bg-emerald-600 text-white rounded-md text-[10px] font-bold uppercase">Save</button>
        <button onclick="readData()" class="p-1.5 bg-gray-700 text-white rounded-md text-[10px] font-bold uppercase">Cancel</button>
      </div>
    `;
  } else if (source === "mobile") {
    let card = document.querySelectorAll(".mobile-body > div")[i];
    card.innerHTML = `
      <div class="space-y-3">
        <input type="text" value="${product.title}" id="mobile-title-${i}" class="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-sm outline-none focus:border-blue-500 text-white" placeholder="اسم المنتج">
        <input type="text" value="${product.category}" id="mobile-category-${i}" class="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-sm outline-none focus:border-blue-500 text-white" placeholder="التصنيف">
        <input type="number" value="${product.price}" id="mobile-price-${i}" class="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-sm outline-none focus:border-blue-500 text-white" placeholder="السعر">
        <input type="number" value="${product.discount}" id="mobile-discount-${i}" class="w-full p-2 bg-[#0f172a] border border-gray-700 rounded-lg text-sm outline-none focus:border-blue-500 text-white" placeholder="الخصم">
      </div>
      <div class="flex justify-between items-center
        <div class="flex gap-2 mt-4">
          <button onclick="saveProduct(${i}, 'mobile')" class="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all">Save</button>
          <button onclick="readData()" class="flex-1 py-2 bg-gray-700 text-white rounded-lg text-xs font-bold hover:bg-gray-600 transition-all">Cancel</button>
        </div>
      </div>
    `;
  }
}

function saveProduct(i, source = "desktop") {
  let product = dataPro[i];
  let priceValue, discountValue;

  if (source === "desktop") {
    let row = document.querySelectorAll(".table-body tr")[i];
    product.title = row.children[1].querySelector("input").value;
    product.category = row.children[2].querySelector("input").value;
    priceValue = +row.children[3].querySelector("input").value;
    discountValue = +row.children[4].querySelector("input").value;
  } else if (source === "mobile") {
    product.title = document.getElementById(`mobile-title-${i}`).value;
    product.category = document.getElementById(`mobile-category-${i}`).value;
    priceValue = +document.getElementById(`mobile-price-${i}`).value;
    discountValue = +document.getElementById(`mobile-discount-${i}`).value;
  }

  if (discountValue > priceValue) {
    showToast("error", "Discount cannot be greater than price");
    return;
  }

  product.price = priceValue;
  product.discount = discountValue;
  product.total = `${product.price - product.discount} L.E`;

  localStorage.setItem("product", JSON.stringify(dataPro));
  readData();
  showToast("success", "Changes saved successfully");
}

//search by

let searchMood = "title";

function getSearchMood(id) {
  let searchInput = document.getElementById("Search");
  let searchByTitle = document.getElementById("SearchByTitle");
  let searchByCategory = document.getElementById("SearchByCategory");

  if (id === "SearchByTitle") {
    searchMood = "title";
    searchInput.placeholder = "البحث بالمنتـــج";
    searchByTitle.classList.add("bg-emerald-600/10", "text-emerald-400");
    searchByCategory.classList.remove("bg-emerald-600/10", "text-emerald-400");
  } else {
    searchMood = "category";
    searchInput.placeholder = "البحث بالتصنيـف";
    searchByCategory.classList.add("bg-emerald-600/10", "text-emerald-400");
    searchByTitle.classList.remove("bg-emerald-600/10", "text-emerald-400");
  }
  searchInput.value = "";
  searchInput.focus();
}

let searchInput = document.getElementById("Search");

searchInput.onkeyup = function () {
  let rows = document.querySelectorAll(".table-body tr");
  let mobileCards = document.querySelectorAll(".mobile-body > div");

  for (let i = 0; i < dataPro.length; i++) {
    let value = searchInput.value.toLowerCase();

    let target =
      searchMood === "title"
        ? dataPro[i].title
        : dataPro[i].category;
    if (searchInput.value === "") {
      rows[i].classList.remove("hidden");
      mobileCards[i].classList.remove("hidden");
      continue;
    }

    else if (target.toLowerCase().includes(value)) {
      rows[i].classList.remove("hidden");
      mobileCards[i].classList.remove("hidden");
    } else {
      rows[i].classList.add("hidden");
      mobileCards[i].classList.add("hidden");
    }
  }
};