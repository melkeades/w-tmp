import './styles/style.styl'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import CSSRulePlugin from 'gsap/CSSRulePlugin'
import SplitType from 'split-type'

gsap.registerPlugin(CSSRulePlugin)

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: 'vertical', // vertical, horizontal
  gestureDirection: 'vertical', // vertical, horizontal, both
  smooth: true,
  mouseMultiplier: 1.3,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

//get scroll value
lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
  console.log({ scroll, limit, velocity, direction, progress })
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

function onReady() {
  new SplitType('#heroTitle', {
    types: 'lines',
    lineClass: 'lineParent',
    // tagName: 'span',
  })

  const heroTitle = new SplitType('#heroTitle > .lineParent', {
    types: 'lines',
    lineClass: 'lineChild',
    // tagName: 'span',
  })

  const heroVideoAfter = CSSRulePlugin.getRule('.hero_video2:after')
  const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 2 } })

  tl.set(heroVideoAfter, { transformOrigin: 'bottom' }).to(heroVideoAfter, {
    cssRule: { height: '0%' },
    duration: 2,
  })

  tl.from('.hero_video2', {
    width: '100%',
    // transformOrigin: 'left top',
    onComplete: heroVideoOrigin,
  })

  tl.from([heroTitle.lines, '.hero_copy'], {
    yPercent: 120,
    stagger: 0.15,
    // stagger: { amount: 2 },
  })
}

function heroVideoOrigin() {
  smoothOriginChange('.hero_video2', 'right top')
  // gsap.to('.hero_video2', { duration: 3, scale: 1 })
}

function smoothOriginChange(element, transformOrigin) {
  if (typeof element === 'string') {
    element = document.querySelector(element)
  }
  var before = element.getBoundingClientRect()
  element.style.transformOrigin = transformOrigin
  var after = element.getBoundingClientRect()
  gsap.set(element, {
    x: '+=' + (before.left - after.left),
    y: '+=' + (before.top - after.top),
  })
}

if (document.readyState !== 'loading') {
  onReady()
} else {
  document.addEventListener('DOMContentLoaded', function () {
    onReady()
  })
}
