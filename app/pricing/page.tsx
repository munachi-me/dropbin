"use client"
import { useState, useRef, useEffect } from 'react'
import Link from "next/link"
import { BsCloudUpload, BsTags,
    BsCheck, BsInfoCircle, BsQuestionCircle,
    BsChevronDown, BsChevronUp,
    BsArrowRight, BsStars, BsLightning, BsBuildings,
} from "react-icons/bs"
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export default function Pricing() {
  return (
    <>
      <Hero />
      <Card />
      <Compare />
      <Faq />
      <Cta />
    </>
  );
}

function Hero() {
    const containerRef = useRef(null)
    const badgeRef = useRef(null)
    const titleRef = useRef(null)
    const descRef = useRef(null)

    useGSAP(() => {
        // Create a timeline for hero animations
        const tl = gsap.timeline({
            defaults: { ease: "power3.out" }
        })

        // Animate badge
        tl.from(badgeRef.current, {
            opacity: 0,
            y: -30,
            duration: 0.6
        })
        // Animate title with stagger effect
        .from(titleRef.current, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            scale: 0.9,
            rotationX: 10
        })
        // Animate description
        .from(descRef.current, {
            opacity: 0,
            y: 30,
            duration: 0.6
        })

        // Parallax effect on scroll
        gsap.to(containerRef.current, {
            y: -30,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        })

    }, [])

    return(
        <div ref={containerRef} className="grid-bg w-full flex flex-col items-center justify-center gap-4 text-center pt-24 pb-12 px-4 relative overflow-hidden">
            <span ref={badgeRef} className="flex items-center gap-2 text-xs text-foreground/60 py-1 px-3 rounded-lg border bg-secondary">
                <i className="text-primary"><BsTags /></i> 
                Pricing
            </span>
            <h1 ref={titleRef} className="text-3xl md:text-5xl font-bold">
                Pay for <span className="gradient-text">power</span>, not for storage.
            </h1>
            <p ref={descRef} className="text-foreground/60 text-center w-full max-w-xl text-sm md:text-base">
                Start free forever. Upgrade when you need bigger files, longer durations, or priority speed. No hidden fees.
            </p>
        </div>
    )
}

const free = {
    special: false,
    icon: <BsStars />, name: "Free", desc: "For quick, one-off transfers.",
    price: 0, duration: "/ forever", lk_title: "Start sharing", lk: "/drop",
    specs: [
        "100 MB max file size",
        "Up to 24 hours storage",
        "5 downloads per drop",
        "Password protection",
        "Standard upload speed",
    ],
};
const pro = {
    special: true,
    icon: <BsLightning />, name: "Pro", desc: "For frequent senders who need more.",
    price: 8, duration: "/ per month", lk_title: "Go Pro", lk: "#",
    specs: [
        "2 GB max file size",
        "Up to 14 days storage",
        "100 downloads per drop",
        "Password protection",
        "Priority upload speed",
        "Download analytics",
    ],
};
const business = {
    special: false,
    icon: <BsBuildings />, name: "Business", desc: "For teams moving files daily.",
    price: 24, duration: "/ per month", lk_title: "Contact us", lk: "#",
    specs: [
        "10 GB max file size",
        "Up to 30 days storage",
        "Unlimited downloads",
        "Password protection",
        "Priority upload speed",
        "Custom branding & analytics",
    ],
};

const tiers = [free, pro, business]

function Card() {
    const containerRef = useRef(null)
    const cardsRef = useRef([])
    const popularRef = useRef(null)

    useGSAP(() => {
        // Card entrance animations with stagger
        cardsRef.current.forEach((card, i) => {
            gsap.from(card, {
                opacity: 0,
                y: 60,
                scale: 0.95,
                duration: 0.8,
                delay: i * 0.15,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            })
        })

        // Hover animations for cards
        cardsRef.current.forEach((card) => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                    duration: 0.3,
                    ease: "power2.out"
                })
                
                // Animate icon on hover
                const icon = card.querySelector('i')
                gsap.to(icon, {
                    scale: 1.2,
                    rotation: 10,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                })

                // Animate specs on hover
                const specs = card.querySelectorAll('.spec-item')
                specs.forEach((spec, idx) => {
                    gsap.to(spec, {
                        x: 5,
                        duration: 0.2,
                        delay: idx * 0.05,
                        ease: "power2.out"
                    })
                })
            })
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    boxShadow: "0 0 0 rgba(0,0,0,0)",
                    duration: 0.3,
                    ease: "power2.out"
                })
                
                const icon = card.querySelector('i')
                gsap.to(icon, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: "power2.out"
                })

                const specs = card.querySelectorAll('.spec-item')
                specs.forEach((spec) => {
                    gsap.to(spec, {
                        x: 0,
                        duration: 0.2,
                        ease: "power2.out"
                    })
                })
            })
        })

        // Special glow animation for Pro card
        if (popularRef.current) {
            gsap.to(popularRef.current, {
                boxShadow: "0 0 30px rgba(99, 102, 241, 0.2)",
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            })
        }

        // Animate checkmarks with stagger
        cardsRef.current.forEach((card) => {
            const checkmarks = card.querySelectorAll('.checkmark')
            gsap.from(checkmarks, {
                opacity: 0,
                scale: 0,
                duration: 0.4,
                stagger: 0.08,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            })
        })

    }, [])

    return(
        <div ref={containerRef} className="w-full flex flex-col items-center justify-center gap-4 py-24 px-4">
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 p-4 gap-8">
                {tiers.map((t, i) => (
                    <div key={i} ref={el => {
                        cardsRef.current[i] = el
                        if (t.special) popularRef.current = el
                    }} className={`flex flex-col p-8 gap-8 rounded-2xl border relative shadow-lg bg-secondary/50
                    ${t.special ? 'glow' : ''}`}>
                        {t.special ? 
                            <span className="absolute text-xs py-2 px-4 w-[60%] rounded-lg bg-primary text-primary-foreground
                            text-center font-semibold top-0 left-[50%] translate-[-50%]">
                                Popular
                            </span> : null
                        }
                        <div className="flex flex-wrap items-center gap-3">
                            <i className="p-2 rounded-sm text-primary bg-primary/10 text-2xl">{t.icon}</i>
                            <h2 className="text-xl text-left font-semibold text-base">{t.name}</h2>
                            <p className="text-foreground/60 text-left text-sm w-full font-medium">{t.desc}</p>
                        </div>

                        <h2>
                            <span className="text-3xl">${t.price}</span> <span className="text-foreground/60">{t.duration}</span>
                        </h2>

                        <Link href={t.lk}
                        className={`w-full flex items-center justify-center gap-2 rounded-4xl px-4 py-2 text-sm
                        hover:bg-accent hover:text-accent-foreground
                        ${t.special ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground border'}`}>
                            {t.lk_title} <BsArrowRight />
                        </Link>

                        <hr className="w-full border" />

                        <div className="flex flex-col gap-2 text-sm text-foreground/60">
                            {t.specs.map((s, index) => (
                                <span key={index} className="checkmark flex items-center gap-2"><BsCheck /> {s}</span>
                            ))}
                        </div>
                        
                    </div>
                ))}

            </div>            
        </div>
    )
}

const table = [
    {feature: 'Maximum upload size', free: '100 MB', pro: '2 GB', business: '10 GB'},
    {feature: 'Storage duration', free: '7 days', pro: '30 days', business: '30 days'},
    {feature: 'Download limit', free: '5', pro: '50', business: 'Unlimited'},
    {feature: 'Password protection', free: '√', pro: '√', business: '√'},
    {feature: 'Priority speed', free: '—', pro: '√', business: '√'},
    {feature: 'Analytics', free: '—', pro: '√', business: '√'},
    {feature: 'Custom branding', free: '—', pro: '—', business: '√'},
]

function Compare(){
    const containerRef = useRef(null)
    const tableRef = useRef(null)
    const rowsRef = useRef([])
    const headerRef = useRef(null)

    useGSAP(() => {
        // Header animation
        gsap.from(containerRef.current.children, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        })

        // Table reveal animation
        gsap.from(tableRef.current, {
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: tableRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        })

        // Table rows stagger animation
        rowsRef.current.forEach((row, i) => {
            gsap.from(row, {
                opacity: 0,
                x: -40,
                duration: 0.5,
                delay: i * 0.08,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: row,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            })

            // Hover effect for rows
            row.addEventListener('mouseenter', () => {
                gsap.to(row, {
                    backgroundColor: "rgba(99, 102, 241, 0.05)",
                    duration: 0.2,
                    ease: "power2.out"
                })
            })
            row.addEventListener('mouseleave', () => {
                gsap.to(row, {
                    backgroundColor: "transparent",
                    duration: 0.2,
                    ease: "power2.out"
                })
            })
        })

        // Pro column highlight animation
        const proCells = tableRef.current.querySelectorAll('td:nth-child(3)')
        proCells.forEach((cell) => {
            gsap.from(cell, {
                scale: 0.8,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: cell,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            })
        })

    }, [])

    return(
        <div ref={containerRef} id="compare" className="w-full flex flex-col items-center justify-center gap-4 text-center py-24 px-4">
            <span className="flex items-center gap-2 text-xs text-foreground/60 py-1 px-3 rounded-lg border bg-secondary">
                <i className="text-primary"><BsInfoCircle /></i> 
                Compare
            </span>
            <h1 className="text-2xl md:text-4xl font-bold">
                Every detail, side by side.
            </h1>

            <div ref={tableRef} className="w-full max-w-6xl border overflow-hidden rounded-2xl my-8">
                <table className="w-full">
                    <thead>
                        <tr ref={headerRef} className="p-4 w-full">
                            <td className="w-[40%] border-r p-4 font-semibold bg-secondary text-left">
                                Feature
                            </td>
                            <td className="w-lg border-r p-4 font-semibold bg-secondary">
                                Free
                            </td>
                            <td className="w-lg border-r p-4 font-semibold bg-primary/10 text-primary">
                                Pro
                            </td>
                            <td className="w-lg border-r p-4 font-semibold bg-secondary">
                                Business
                            </td>
                        </tr>
                    </thead>
                    <tbody className="rounded-7xl">
                        {table.map((t, i) => (
                            <tr key={i} ref={el => rowsRef.current[i] = el} className="p-4 w-full border-t">
                                <td className="w-[40%] border-r p-4 text-foreground/60 text-left">
                                    {t.feature}
                                </td>
                                <td className="w-lg border-r p-4 font-semibold">
                                    {t.free}
                                </td>
                                <td className="w-lg border-r p-4 font-semibold bg-primary/10">
                                    {t.pro}
                                </td>
                                <td className="w-lg p-4 font-semibold">
                                    {t.business}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>         
        </div>
    )
}

const faqs = [
    {
        q: "Can I change plans anytime?",
        a: "Yes — upgrade or downgrade in a click. Changes apply immediately and we prorate the difference automatically."
    },
    {
        q: "Is there a free tier?",
        a: "Always. The Free plan never expires and needs no credit card. It's perfect for occasional transfers.",
    },
    {
        q: "Do unused drops roll over?",
        a: "Drops are transient by design — they expire based on their own timer, not a monthly quota. Plans raise your file size, duration, and download limits.",
    },
    {
        q: "How does billing work for teams?",
        a: "Business is billed per workspace. Add or remove seats anytime; we adjust the invoice on the next cycle.",
    },
]

function Faq(){
    const [que, setQue] = useState(-1);
    const containerRef = useRef(null)
    const faqRef = useRef([])
    const contentRef = useRef([])

    useGSAP(() => {
        // Header animation
        gsap.from(containerRef.current.children, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        })

        // FAQ items animation
        faqRef.current.forEach((item, i) => {
            gsap.from(item, {
                opacity: 0,
                x: -30,
                duration: 0.5,
                delay: i * 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            })

            // Hover effect for FAQ items
            item.addEventListener('mouseenter', () => {
                gsap.to(item, {
                    x: 10,
                    duration: 0.2,
                    ease: "power2.out"
                })
            })
            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    x: 0,
                    duration: 0.2,
                    ease: "power2.out"
                })
            })
        })

    }, [])

    // Animate FAQ content when toggled
    useEffect(() => {
        if (que !== -1 && contentRef.current[que]) {
            gsap.from(contentRef.current[que], {
                opacity: 0,
                height: 0,
                duration: 0.4,
                ease: "power2.out",
                clearProps: "height"
            })
        }
    }, [que])

    return(
        <div ref={containerRef} id="faqs" className="w-full flex flex-col items-center justify-center gap-4 text-center py-24 px-4
            bg-secondary">
            <span className="flex items-center gap-2 text-xs text-foreground/60 py-1 px-3 rounded-lg border bg-secondary">
                <i className="text-primary"><BsQuestionCircle /></i> 
                FAQs
            </span>
            <h1 className="text-2xl md:text-4xl font-bold">
                Price questions.
            </h1>
            <p className="text-foreground/60 text-center w-full max-w-xl text-sm md:text-base">
                Everything you might want to know before you drop your first file.
            </p>

            <div className="w-full max-w-4xl my-8">
                {faqs.map((f, i) => (
                    <button type="button" key={i} ref={el => faqRef.current[i] = el}
                        onClick={() => i == que ? setQue(-1) : setQue(i)}
                        className="flex flex-col w-full border-b hover:bg-background/50">
                        <p className="flex items-center w-full text-left justify-between p-4 font-semibold">
                            {f.q}
                            <i>{i == que ? <BsChevronUp /> : <BsChevronDown />}</i>
                        </p>
                        <p ref={el => contentRef.current[i] = el}
                            className={`${i == que ? 'block' : 'hidden'} text-left px-4 pb-4 w-full text-foreground/60`}>
                            {f.a}
                        </p>
                        
                    </button>

                ))}
            </div>  
        </div>
    )
}

function Cta(){
    const containerRef = useRef(null)
    const ctaRef = useRef(null)

    useGSAP(() => {
        // CTA section animation with floating effect
        gsap.from(ctaRef.current, {
            opacity: 0,
            scale: 0.9,
            y: 50,
            duration: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        })

        // Inner elements with stagger
        gsap.from(ctaRef.current.children, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ctaRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        })

        // Pulse animation for the button
        const button = ctaRef.current.querySelector('a')
        gsap.to(button, {
            scale: 1.05,
            boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        })

        // Background gradient animation
        gsap.to(ctaRef.current, {
            backgroundPosition: "200% 200%",
            duration: 10,
            repeat: -1,
            ease: "sine.inOut"
        })

    }, [])

    return(
        <div ref={containerRef} className="w-full flex flex-col items-center justify-center py-20 px-4">
            <div ref={ctaRef} className="w-full max-w-6xl bg-primary/20 rounded-2xl border flex flex-col gradient-bg text-primary-foreground
                items-center justify-center gap-4 text-center py-20 px-4"
                style={{backgroundSize: "200% 200%"}}>
                <h1 className="text-2xl md:text-4xl font-bold">
                    Start free. Upgrade when you need it.
                </h1>

                <Link href="/drop"
                className="px-8 py-4 rounded-4xl bg-background text-foreground font-semibold
                flex items-center gap-2
                hover:bg-accent hover:text-accent-foreground">
                    <BsCloudUpload /> Drop files 
                </Link>

            </div>  
        </div>
    )
}