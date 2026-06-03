const products = [
{ id: 1, name: "محصول نمونه ۱", price: "۱۰۰,۰۰۰ تومان" },
{ id: 2, name: "خدمات ویژه تترا", price: "۲۵۰,۰۰۰ تومان" }
];
‌
document.body.innerHTML += '<ul>' +
products.map(p => '<li>' + p.name + ' - ' + p.price + '</li>').join('') +
'</ul>';
