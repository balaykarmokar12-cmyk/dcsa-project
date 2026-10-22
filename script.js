let foods = JSON.parse(localStorage.getItem('cfv_foods')||'[]');
let cart = JSON.parse(localStorage.getItem('cfv_cart')||'[]');

if(foods.length===0){
 foods=[
  {id:1,name:"Chicken Biryani",price:280,cat:"Biriyani",img:"images/restaurant.jpg"},
  {id:2,name:"Special Thali",price:320,cat:"Curry",img:"images/thali.jpg"},
  {id:3,name:"Chocolate Dessert",price:180,cat:"Dessert",img:"images/dessert.jpg"},
  {id:4,name:"Chef Special Platter",price:450,cat:"Biriyani",img:"images/chef_plating.jpg"},
  {id:5,name:"Spice Mix Curry",price:250,cat:"Curry",img:"images/spices.jpg"},
  {id:6,name:"Mutton Kacchi",price:380,cat:"Biriyani",img:"images/restaurant.jpg"}
 ];
 localStorage.setItem('cfv_foods',JSON.stringify(foods));
}

function renderMenu(filter="All"){
 const list=document.getElementById('menu-list');
 let filtered = filter==="All"?foods:foods.filter(f=>f.cat===filter);
 list.innerHTML=filtered.map(f=>`
  <div class="menu-category">
    <div class="menu-category-header">${f.cat}</div>
    <img src="${f.img}" style="width:100%; height:180px; object-fit:cover" onerror="this.src='https://via.placeholder.com/300'">
    <div style="padding:1.2rem">
      <b>${f.name}</b><br><span style="color:#b27b38; font-weight:700;">৳${f.price}</span><br>
      <button onclick="addToCart(${f.id})" style="margin-top:8px; background:#2f2a24; color:#fff; border:0; padding:7px 16px; border-radius:999px; cursor:pointer">Add to Cart</button>
    </div>
  </div>
 `).join('');
}

function addToCart(id){
 let item=foods.find(f=>f.id===id);
 cart.push(item);
 localStorage.setItem('cfv_cart',JSON.stringify(cart));
 updateCart();
 alert(item.name+" Added & Saved!");
}

function updateCart(){
 document.getElementById('cart-count').innerText=cart.length;
 let el=document.getElementById('cart-list');
 if(cart.length===0){ el.innerHTML="<p>Cart empty - Add from menu</p>"; return; }
 let total=cart.reduce((s,i)=>s+i.price,0);
 el.innerHTML=cart.map((c,i)=>`<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eee"><span>${i+1}. ${c.name}</span><span>৳${c.price} <button onclick="removeItem(${i})" style="background:#fee2e2; border:0; padding:2px 6px; border-radius:4px; cursor:pointer">x</button></span></div>`).join('')+
 `<div style="margin-top:12px; display:flex; justify-content:space-between; font-weight:700"><span>Total</span><span>৳${total}</span></div>
  <button class="btn btn-gold" style="margin-top:12px; width:100%" onclick="placeOrder()">Place Order</button>`;
}

function removeItem(i){ cart.splice(i,1); localStorage.setItem('cfv_cart',JSON.stringify(cart)); updateCart(); }
function placeOrder(){ if(cart.length===0) return; alert("Order Placed! Total: ৳"+cart.reduce((s,i)=>s+i.price,0)); cart=[]; localStorage.setItem('cfv_cart',JSON.stringify(cart)); updateCart(); }
function addFood(){
 let name=document.getElementById('foodName').value.trim();
 let price=parseInt(document.getElementById('foodPrice').value);
 let cat=document.getElementById('foodCat').value;
 if(!name||!price) return alert("Name & Price required");
 foods.push({id:Date.now(), name, price, cat, img:"images/restaurant.jpg"});
 localStorage.setItem('cfv_foods',JSON.stringify(foods));
 renderMenu('All');
 alert("Food Added & Saved for DCSA Viva!");
}

document.addEventListener('DOMContentLoaded',()=>{ renderMenu('All'); updateCart(); });
