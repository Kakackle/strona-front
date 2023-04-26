gsap.registerPlugin(ScrollTrigger);
let tl = gsap.timeline();

gsap.to(".dog-img", {
  rotation: 360,
  duration: 1,
  scrollTrigger: {
    trigger: ".dog-img",
    toggleActions: "restart pause resume none",
    markers: true,
    scrub: true,
  },
});

tl.to(".knight-img", {
  x: 400,
  rotation: 360,
  duration: 2,
  // scrollTrigger: ".knight-img",
});
tl.to(".man-img", {
  rotationY: 180,
  duration: 0.25,
  repeat: 1,
  yoyo: true,
  repeatDelay: 0.5,
});
tl.to(".knight-img", { y: -100, duration: 0.5, repeat: 5, yoyo: true });
tl.to(".knight-img", { x: 0, duration: 2, rotation: -360 });
tl.to(".knight-img", { y: -200, duration: 0.75, repeat: 1, yoyo: true });
