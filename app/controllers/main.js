var service = new Service();

var productList = new ProductList();

var cart = [];

var tongTien = 0;

getLocalStorage();

function getEle(id) {
    return document.getElementById(id);
}

function fetchData() {
    getEle("loader").style.display = "block";
    document.getElementsByClassName("wrapper")[0].style.paddingBottom = "40rem";
    service.getListProduct()
        .then((result) => {
            console.log(result.data);
            document.querySelector(".wrapper").style.paddingBottom = "15rem";
            productList.array = result.data;
            renderHTML(productList.array);
            getEle("loader").style.display = "none";
        })
        .catch((error) => {
            console.log(error);
        })
}

fetchData();

function renderHTML(data) {
    var content = "";
    var iconApple = `fa-brands fa-apple`;
    var iconAndroid = `fa-brands fa-android`;
    data.forEach((item) => {
        var icon = "";
        var string = item.desc;
        if (item.type == 'Iphone') {
            icon = iconApple;
        }
        else {
            icon = iconAndroid;
        }
        if (item.desc.length > 40) {
            string = string.substring(0, 40) + "...";
        }
        content += `<div class="products__item col-12 col-md-4 col-sm-6 col-lg-3">
        <div class="card">

            <i class=" ${icon} product__type"></i>
            <img class="card-img-top img-fluid" src="${item.img}" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">${string}</p>
              <div class="d-flex justify-content-between align-items-center">
                <p class="product__price mb-0">$${item.price}</p>
                <div style="height: 1.7rem; display: none;">
                    <button class="btn-qty" ><i
                            class="fas fa-chevron-left"></i></button>
                    <p class="qty">3</p>
                    <button class="btn-qty"><i
                            class="fas fa-chevron-right"></i></button>
                </div>
                <button onclick="addToCart(${item.id})" class="add-btn">Add</button>
              </div>
            </div>
          </div>
    </div>`
    })

    getEle("productsList").innerHTML = content;
}

function selectType() {
    var type = getEle("loaiSP").value;
    if (type !== "Chọn loại sản phẩm") {
        var arrSelect = [];
        productList.array.forEach((item) => {
            if (type == item.type) {
                arrSelect.push(item);
            }
            renderHTML(arrSelect);
        })
    }
    else {
        renderHTML(productList.array);
    }
}
function addToCart(id) {
    var product = productList.laySanPham(id);
    var index = timViTriSanPhamTrongGioHang(id);
    if (product) {
        if (index == -1) {
            var cartItem = new CartItem(product, 1);
            cart.push(cartItem);
            index = cart.length - 1;
        }
        else {
            cart[index].quantity++;
        }
    }
    setLocalStorage();
    renderCart(cart);
}

function timViTriSanPhamTrongGioHang(id) {
    var index = -1;
    for (var i = 0; i < cart.length; i++) {
        if (id == cart[i].product.id) {
            index = i;
        }
    }
    return index;
}

function capNhatTrangThaiSoLuong() {
   var sum = 0;
    cart.forEach((item) => {
        sum += item.quantity;
    })
    getEle("quantityCart").innerHTML = sum;
}

function renderCart(data) {
    capNhatTrangThaiSoLuong();
    var content = "";
    data.forEach((item) => {
        content += `<tr>
        <td>
            <div class="cart-img">
            <img class="img-fluid" src="${item.product.img}"
                alt="">
            </div>
        </td>
        <td><strong class="name">${item.product.name}</strong></td>
        <td>
            <span class="qty-change">
                <div class="d-flex" style="height: 1.7rem;">
                    <button class="btn-qty" onclick="tangGiamSoLuong(${item.product.id},'sub')"><i
                            class="fas fa-chevron-left"></i></button>
                    <p class="qty">${item.quantity}</p>
                    <button class="btn-qty" onclick="tangGiamSoLuong(${item.product.id},'add')"><i
                            class="fas fa-chevron-right"></i></button>
                </div>
            </span>
        </td>
        <td><p class="price" style="margin-bottom: 0">$ ${item.quantity * item.product.price}</p></td>
        <td> <button class="trash" onclick="xoaSanPham(${item.product.id})"><i class="fa-solid fa-trash"></i></button></td>
    </tr>`
    })
    tinhTongTien();
    getEle("cartTable").innerHTML = content;
    getEle("total").innerHTML = tongTien;

}

function tangGiamSoLuong(id, math) {
    var index = timViTriSanPhamTrongGioHang(id);
    if (math == "sub") {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        }
    }
    else {
        cart[index].quantity++;
    }
    setLocalStorage();
    renderCart(cart);
}
function xoaSanPham(id) {
    var index = timViTriSanPhamTrongGioHang(id);
    if (index !== -1) {
        cart.splice(index, 1);
    }
    renderCart(cart);
    setLocalStorage();
    notification();
}

function tinhTongTien() {
    tongTien = 0;
    cart.forEach((item) => {
        tongTien += (item.quantity * item.product.price);
    })
}
function notification() {
    if (cart.length < 1) {
        getEle("tablefoot").style.display = "none";
        getEle("thongBaoGioHang").style.display = "block";
    }
    else {
        getEle("thongBaoGioHang").style.display = "none";
        getEle("tablefoot").style.display = "block";
    }
}
getEle("sidebarCollapse").addEventListener("click", () => {
    notification();
})


function xoaGioHang() {
    while (cart.length > 0) {
        cart.pop();
    }
    setLocalStorage();
    renderCart(cart);
    notification();
}

getEle("datHang").onclick = () => {
    renderConfirmCart();
}

function renderConfirmCart() {
    var content = "";
    cart.forEach((item) => {
        content += `<tr>
        <td>${item.product.name}</td>
        <td>${item.quantity}</td>
        <td>${(item.quantity * item.product.price)}</td>
    </tr>`

    })
    content += `<tr>
        <td colspan="3">Tổng đơn hàng của bạn là: <b>$${tongTien}</b></td>
    </tr>`
    getEle("tbodyConfirm").innerHTML = content;
}

getEle("xacNhanDatHang").addEventListener("click", () => {
    getEle("close").click();
    xoaGioHang();
})

function setLocalStorage() {
    // Convert từ json sang String vì trên localstorage nó chỉ nhận dạng text (string) thôi
    var dataString = JSON.stringify(cart);
    localStorage.setItem("GioHang", dataString);
}

function getLocalStorage() {
    var dataString = localStorage.getItem("GioHang");
    if (dataString) {
        // Convert từ String sang Json
        var dataJson = JSON.parse(dataString);
        // backup data tu localStorage vao GioHang
        cart = dataJson;
        // Hien thi ra table
        renderCart(cart);
    }
}