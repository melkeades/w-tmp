import './styles/style.styl'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import CSSRulePlugin from 'gsap/CSSRulePlugin'
import CustomEase from 'gsap/CustomEase'
import ScrollToPlugin from 'gsap/ScrollToPlugin '
import ScrollTrigger from 'gsap/ScrollTrigger '
import $ from 'jquery'
import SplitType from 'split-type'

gsap.registerPlugin(CSSRulePlugin, CustomEase, ScrollTrigger, ScrollToPlugin)

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

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

let lenisScroll = 0
let slowMultiplier = 1
let tlLoadComplete = false

function onReady() {
  new SplitType('#heroTitle', {
    types: 'lines',
    lineClass: 'lineParent',
    // tagName: 'span',
  })

  const heroTitle = new SplitType('#heroTitle > .lineParent', {
    types: 'lines',
  })
  const heroCopy = $('#heroCopy').wrap("<div class='hero_copyW'></div>")

  ScrollTrigger.defaults({ markers: true })
  const heroVideoAfter = CSSRulePlugin.getRule('.hero_video2:after')
  const tlLoad = gsap.timeline({ defaults: { ease: 'power4.out', duration: 2 } })
  const tlScrollHero = gsap.timeline({
    defaults: { ease: 'linear', duration: 3 },
    paused: true,
  })
  // tlScrollHero.pause()
  // set(heroVideoAfter, { transformOrigin: 'bottom' })

  tlLoad
    .from('.hero_video2', {
      ease: CustomEase.create('custom', 'M0,0 C0.29,0 0.219,0.018 0.29,0.103 0.359,0.186 0.413,0.798 0.476,0.892 0.551,1.003 0.704,1 1,1'),
      duration: 2.5,
      width: '100%',
      // transformOrigin: 'left top',
      onComplete: heroVideoOrigin,
    })
    .to(heroVideoAfter, { cssRule: { height: '100%' } }, '>-=1.2')
    .from([heroTitle.lines, heroCopy], { yPercent: 120, stagger: 0.25 }, '<')
    .from(['.hero_logo', '.hero_btn'], { x: 50, opacity: 0, duration: 3 }, '>-=1.8')
    .from(['.hero_menu', '.hero_awards'], { x: -50, opacity: 0, duration: 3 }, '<')
    .from('.hero_hr', { scaleX: 0.8, opacity: 0, duration: 3 }, '<')
    .addLabel('tlLoadEnd')
    // .add(tlScrollHero.tweenFromTo(0, tlScrollHero.duration()), '<1.5')
    .add(() => {
      tlLoadComplete = true
      addHeroScroll()
    })

  //get scroll value

  lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
    // console.log({ scroll, limit, velocity, direction, progress })
    lenisScroll = scroll
    if (scroll >= 10 && !tlLoadComplete && slowMultiplier == 1) {
      // tlLoad.kill()
      // tlLoad.play('qwe', false)
      // tlLoad.tweenTo('tlLoadEnd', { duration: 2 })
      // tlScrollHero.timeScale(0.02)
      // tlLoadComplete = true
      slowMultiplier = 0.1
      console.log('dow')
    }
  })

  function addHeroScroll() {
    ScrollTrigger.create({
      animation: heroScrollAni(),
      trigger: '.hero',
      start: 'top top',
      end: 'bottom 30%',
      toggleActions: 'play reverse restart reverse',
      onLeave: () => {
        // console.log(slowMultiplier)
        if (slowMultiplier < 1) {
          console.log('up')
          tlScrollHero.seek(0)
          tlScrollHero.clear()
          slowMultiplier = 1
          heroScrollAni()
        }
      },
      scrub: 1,
    })
  }
  function heroScrollAni() {
    const heroSquish = 100 * slowMultiplier + '%'
    tlScrollHero
      .to('.hero_video2', { ease: 'none', opacity: 0, clipPath: 'polygon(' + heroSquish + ' 0%, 100% 0%, 100% 100%, ' + heroSquish + ' 100%' })
      .to(['.nero_navbar', '#heroTitle>.lineParent', '.hero_copyW', '.hero_cta'], { y: -600 * slowMultiplier, stagger: { amount: 1 }, duration: 2 }, '<')
      .to('.hero_hr', { scaleX: 0, duration: 2.35 }, '<')
      .to(['.hero_btn', '.hero_awards'], { opacity: 0, ease: 'power2.in', duration: 2.4 }, '<')
      // .to('.work_title', { marginTop: '-300px', ease: 'power2.in', duration: 2.4 }, '<')
      .to('.work_title', { y: '-100px', ease: 'power2.in', duration: 2.4 }, '<+=2')
    // .add(() => {
    //   tlScrollHero.timeScale(1)
    // })
    return tlScrollHero
  }
  ScrollTrigger.config({
    limitCallbacks: true,
  })
  ScrollTrigger.create({
    trigger: '.hero',
    // end: 'bottom-=30% top+=1',
    start: 'bottom bottom',
    // markers: false,
    onEnterBack: () => {
      // gsap.set('body', { overflow: 'hidden' })
      gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: '.hero', autoKill: false },
        overwrite: true,
        // onComplete: () => gsap.set('body', { overflow: 'auto' }),
      })
    },
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
