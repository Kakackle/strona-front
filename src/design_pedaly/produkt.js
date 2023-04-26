const product_imgs = document.querySelectorAll(".extra-img");
const main_img = document.querySelector(".img");

let product_imgs_src = [];
product_imgs.forEach((img) => {
  product_imgs_src.push(img.src);
});
console.log(`srcs: ${product_imgs_src}`);

let current_img_src = product_imgs_src[0];
main_img.src = current_img_src;

product_imgs.forEach((img) => {
  img.addEventListener("click", (e) => {
    e.preventDefault();
    current_img_src = product_imgs_src[e.target.dataset.index];
    main_img.src = current_img_src;
  });
});

// --------- MAGNIFIER -----------

var evt = new Event(),
  m = new Magnifier(evt);

m.attach({
  thumb: "#thumb",
  large: current_img_src,
  //   largeWrapper: "preview",
  mode: "inside",
  //   zoom: 2,
  //   zoomable: false,
  //   lensW: 1,
  //   lensH: 1,
});
