import './styles/style.styl'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import CSSRulePlugin from 'gsap/CSSRulePlugin'
import CustomEase from 'gsap/CustomEase'
import ScrollTrigger from 'gsap/ScrollTrigger '
import SplitType from 'split-type'

gsap.registerPlugin(CSSRulePlugin, CustomEase, ScrollTrigger)

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
  const tlLoad = gsap.timeline({
    defaults: { ease: 'power4.out', duration: 2 },
  })
  const tlScrollHero = gsap.timeline({})
  tlScrollHero.pause()
  // set(heroVideoAfter, { transformOrigin: 'bottom' })

  tlLoad
    .from('.hero_video2', {
      ease: CustomEase.create(
        'custom',
        'M0,0 C0.29,0 0.219,0.018 0.29,0.103 0.359,0.186 0.413,0.798 0.476,0.892 0.551,1.003 0.704,1 1,1'
      ),
      duration: 2.5,
      width: '100%',
      // transformOrigin: 'left top',
      onComplete: heroVideoOrigin,
    })
    .to(
      heroVideoAfter,
      {
        // cssRule: { height: '0%' },
      },
      '>-1.2'
    )
    .from(
      [heroTitle.lines, '.hero_copy'],
      {
        yPercent: 120,
        stagger: 0.25,
        // stagger: { amount: 2 },
      },
      '<'
    )
    .from(
      ['.hero_logo', '.hero_btn'],
      { x: 50, opacity: 0, duration: 3 },
      '>-1.8'
    )
    .from(
      ['.hero_menu', '.hero_awards'],
      { x: -50, opacity: 0, duration: 3 },
      '<'
    )
    .from('.hero_hr', { scaleX: 0.8, opacity: 0, duration: 3 }, '<')
    .add(tlScrollHero.tweenFromTo(0, tlScrollHero.duration()), '<1.5')
    .add(() => {
      ScrollTrigger.create({
        animation: tlScrollHero,
        trigger: '.hero_video2',
        start: '30% 40%',
        end: '50% 20%',
        toggleActions: 'play reverse restart reverse',
        markers: true,
      })
    })

  tlScrollHero.to('.hero_video2', {
    // clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%',
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
  let before = element.getBoundingClientRect()
  element.style.transformOrigin = transformOrigin
  let after = element.getBoundingClientRect()
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
