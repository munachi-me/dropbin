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
    const containerRef = useRef<HTMLDivElement>(null)
    const badgeRef = useRef<HTMLSpanElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const descRef = useRef<HTMLParagraphElement>(null)

    useGSAP(() => {
        // Create a timeline for hero animations
        const tl = gsap.timeline({
            defaults: { ease: "power3.out" }
        })

        // Animate badge with bounce
        if (badgeRef.current) {
            tl.from(badgeRef.current, {
                opacity: 0,
                y: -40,
                scale: 0.8,
                duration: 0.8,
                ease: "back.out(1.7)"
            })
        }

        // Animate title with 3D effect
        if (titleRef.current) {
            tl.from(titleRef.current, {
                opacity: 0,
                y: 60,
                duration: 1,
                scale: 0.9,
                rotationX: 15,
                ease: "power3.out"
            }, "-=0.3")
        }

        // Animate description with fade-up
        if (descRef.current) {
            tl.from(descRef.current, {
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.4")
        }

        // Parallax effect on scroll
        if (containerRef.current) {
            gsap.to(containerRef.current, {
                y: -20,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.5
                }
            })
        }

        // Floating price tags decoration
        const decorations = containerRef.current?.querySelectorAll('.price-tag')
        if (decorations) {
            decorations.forEach((tag, i) => {
                gsap.to(tag, {
                    y: gsap.utils.random(-20, 20),
                    x: gsap.utils.random(-15, 15),
                    rotation: gsap.utils.random(-10, 10),
                    duration: gsap.utils.random(4, 7),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: i * 0.3
                })
            })
        }

    }, [])

    return(
        <div ref={containerRef} className="grid-bg w-full flex flex-col items-center justify-center gap-4 text-center pt-24 pb-12 px-4 relative overflow-hidden">
            {/* Decorative floating elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="price-tag absolute text-4xl text-primary/5 font-bold top-[15%] right-[10%]">$</div>
                <div className="price-tag absolute text-3xl text-primary/5 font-bold bottom-[25%] left-[8%]">¢</div>
                <div className="price-tag absolute text-5xl text-primary/5 font-bold top-[50%] right-[5%]">€</div>
                <div className="price-tag absolute text-2xl text-primary/5 font-bold bottom-[40%] left-[15%]">£</div>
            </div>

            <span ref={badgeRef} className="flex items-center gap-2 text-xs text-foreground/60 py-1 px-3 rounded-lg border bg-secondary relative z-10">
                <i className="text-primary"><BsTags /></i> 
                Pricing
            </span>
            <h1 ref={titleRef} className="text-3xl md:text-5xl font-bold relative z-10">
                Pay for <span className="gradient-text">power</span>, not for storage.
            </h1>
            <p ref={descRef} className="text-foreground/60 text-center w-full max-w-xl text-sm md:text-base relative z-10">
                Start free forever. Upgrade when you need bigger files, longer durations, or priority speed. No hidden fees.
            </p>
        </div>
    )
}

interface Tier {
    special: boolean;
    icon: React.ReactNode;
    name: string;
    desc: string;
    price: number;
    duration: string;
    lk_title: string;
    lk: string;
    specs: string[];
}

const free: Tier = {
    special: false,
    icon: <BsStars />, 
    name: "Free", 
    desc: "For quick, one-off transfers.",
    price: 0, 
    duration: "/ forever", 
    lk_title: "Start sharing", 
    lk: "/drop",
    specs: [
        "100 MB max file size",
        "Up to 24 hours storage",
        "5 downloads per drop",
        "Password protection",
        "Standard upload speed",
    ],
};

const pro: Tier = {
    special: true,
    icon: <BsLightning />, 
    name: "Pro", 
    desc: "For frequent senders who need more.",
    price: 8, 
    duration: "/ per month", 
    lk_title: "Go Pro", 
    lk: "#",
    specs: [
        "2 GB max file size",
        "Up to 14 days storage",
        "100 downloads per drop",
        "Password protection",
        "Priority upload speed",
        "Download analytics",
    ],
};

const business: Tier = {
    special: false,
    icon: <BsBuildings />, 
    name: "Business", 
    desc: "For teams moving files daily.",
    price: 24, 
    duration: "/ per month", 
    lk_title: "Contact us", 
    lk: "#",
    specs: [
        "10 GB max file size",
        "Up to 30 days storage",
        "Unlimited downloads",
        "Password protection",
        "Priority upload speed",
        "Custom branding & analytics",
    ],
};

const tiers: Tier[] = [free, pro, business]

function Card() {
    const containerRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<(HTMLDivElement | null)[]>([])
    const popularRef = useRef<HTMLDivElement | null>(null)

    useGSAP(() => {
        // Card entrance animations with stagger and 3D effect
        cardsRef.current.forEach((card, i) => {
            if (card) {
                // Main card entrance
                gsap.from(card, {
                    opacity: 0,
                    y: 70,
                    scale: 0.85,
                    rotationX: 10,
                    duration: 0.9,
                    delay: i * 0.15,
                    ease: "back.out(1.8)",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 88%",
                        toggleActions: "play none none reverse"
                    }
                })

                // Animate price with counter effect
                const priceElement = card.querySelector('.price-number')
                if (priceElement) {
                    gsap.from(priceElement, {
                        opacity: 0,
                        scale: 0.5,
                        duration: 0.6,
                        delay: i * 0.15 + 0.3,
                        ease: "back.out(1.7)",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 88%",
                            toggleActions: "play none none reverse"
                        }
                    })
                }

                // Enhanced hover animations for cards
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        y: -15,
                        scale: 1.03,
                        boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
                        duration: 0.5,
                        ease: "power3.out"
                    })
                    
                    // Animate icon with 3D rotation
                    const icon = card.querySelector('i')
                    if (icon) {
                        gsap.to(icon, {
                            scale: 1.3,
                            rotation: 15,
                            duration: 0.5,
                            ease: "back.out(1.8)"
                        })
                    }

                    // Animate specs with slide
                    const specs = card.querySelectorAll('.spec-item')
                    specs.forEach((spec, idx) => {
                        gsap.to(spec, {
                            x: 8,
                            opacity: 1,
                            duration: 0.3,
                            delay: idx * 0.05,
                            ease: "power2.out"
                        })
                    })

                    // Animate the price
                    const price = card.querySelector('.price-number')
                    if (price) {
                        gsap.to(price, {
                            scale: 1.1,
                            color: "rgba(99, 102, 241, 0.9)",
                            duration: 0.3,
                            ease: "power2.out"
                        })
                    }
                })
                
                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        y: 0,
                        scale: 1,
                        boxShadow: "0 0 0 rgba(0,0,0,0)",
                        duration: 0.5,
                        ease: "power3.out"
                    })
                    
                    const icon = card.querySelector('i')
                    if (icon) {
                        gsap.to(icon, {
                            scale: 1,
                            rotation: 0,
                            duration: 0.5,
                            ease: "power3.out"
                        })
                    }

                    const specs = card.querySelectorAll('.spec-item')
                    specs.forEach((spec) => {
                        gsap.to(spec, {
                            x: 0,
                            duration: 0.3,
                            ease: "power2.out"
                        })
                    })

                    const price = card.querySelector('.price-number')
                    if (price) {
                        gsap.to(price, {
                            scale: 1,
                            color: "",
                            duration: 0.3,
                            ease: "power2.out"
                        })
                    }
                })

                // Animate checkmarks with stagger and bounce
                const checkmarks = card.querySelectorAll('.checkmark')
                gsap.from(checkmarks, {
                    opacity: 0,
                    scale: 0,
                    rotation: -20,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "back.out(1.8)",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 82%",
                        toggleActions: "play none none reverse"
                    }
                })

                // Animate the divider line
                const divider = card.querySelector('hr')
                if (divider) {
                    gsap.from(divider, {
                        scaleX: 0,
                        transformOrigin: "left",
                        duration: 0.6,
                        delay: i * 0.15 + 0.4,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 82%",
                            toggleActions: "play none none reverse"
                        }
                    })
                }
            }
        })

        // Special glow animation for Pro card with pulse
        if (popularRef.current) {
            const glowTimeline = gsap.timeline({
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            })
            glowTimeline.to(popularRef.current, {
                boxShadow: "0 0 40px rgba(99, 102, 241, 0.3)",
                duration: 2
            })
            glowTimeline.to(popularRef.current, {
                boxShadow: "0 0 20px rgba(99, 102, 241, 0.1)",
                duration: 2
            })

            // Animate the "Popular" badge
            const badge = popularRef.current.querySelector('.popular-badge')
            if (badge) {
                gsap.to(badge, {
                    scale: 1.05,
                    duration: 1.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                })
            }
        }

    }, [])

    return(
        <div ref={containerRef} className="w-full flex flex-col items-center justify-center gap-4 py-24 px-4">
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 p-4 gap-8">
                {tiers.map((t, i) => (
                    <div 
                        key={i} 
                        ref={el => {
                            cardsRef.current[i] = el;
                            if (t.special) popularRef.current = el;
                        }} 
                        className={`flex flex-col p-8 gap-8 rounded-2xl border relative shadow-lg bg-secondary/50
                        ${t.special ? 'glow border-primary/30' : ''}`}
                    >
                        {t.special ? 
                            <span className="popular-badge absolute text-xs py-2 px-4 w-[60%] rounded-lg bg-primary text-primary-foreground
                            text-center font-semibold top-0 left-[50%] translate-[-50%] transform">
                                ⚡ Popular
                            </span> : null
                        }
                        <div className="flex flex-wrap items-center gap-3">
                            <i className="p-2 rounded-sm text-primary bg-primary/10 text-2xl transition-all">{t.icon}</i>
                            <h2 className="text-xl text-left font-semibold text-base">{t.name}</h2>
                            <p className="text-foreground/60 text-left text-sm w-full font-medium">{t.desc}</p>
                        </div>

                        <h2>
                            <span className="price-number text-3xl">${t.price}</span> <span className="text-foreground/60">{t.duration}</span>
                        </h2>

                        <Link href={t.lk}
                        className={`w-full flex items-center justify-center gap-2 rounded-4xl px-4 py-2 text-sm transition-all
                        hover:scale-105 hover:shadow-lg
                        ${t.special ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-background text-foreground border hover:bg-accent hover:text-accent-foreground'}`}>
                            {t.lk_title} <BsArrowRight className="transition-transform group-hover:translate-x-1" />
                        </Link>

                        <hr className="w-full border" />

                        <div className="flex flex-col gap-2 text-sm text-foreground/60">
                            {t.specs.map((s, index) => (
                                <span key={index} className="checkmark flex items-center gap-2 transition-all">
                                    <BsCheck className="text-primary" /> {s}
                                </span>
                            ))}
                        </div>
                        
                    </div>
                ))}

            </div>            
        </div>
    )
}

interface TableRow {
    feature: string;
    free: string;
    pro: string;
    business: string;
}

const table: TableRow[] = [
    {feature: 'Maximum upload size', free: '100 MB', pro: '2 GB', business: '10 GB'},
    {feature: 'Storage duration', free: '7 days', pro: '30 days', business: '30 days'},
    {feature: 'Download limit', free: '5', pro: '50', business: 'Unlimited'},
    {feature: 'Password protection', free: '√', pro: '√', business: '√'},
    {feature: 'Priority speed', free: '—', pro: '√', business: '√'},
    {feature: 'Analytics', free: '—', pro: '√', business: '√'},
    {feature: 'Custom branding', free: '—', pro: '—', business: '√'},
]

function Compare(){
    const containerRef = useRef<HTMLDivElement>(null)
    const tableRef = useRef<HTMLTableElement>(null)
    const rowsRef = useRef<(HTMLTableRowElement | null)[]>([])
    const headerRef = useRef<HTMLTableRowElement>(null)

    useGSAP(() => {
        // Header animation with stagger
        if (containerRef.current) {
            gsap.from(containerRef.current.children, {
                opacity: 0,
                y: 40,
                duration: 0.7,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            })
        }

        // Table reveal animation with 3D perspective
        if (tableRef.current) {
            gsap.from(tableRef.current, {
                opacity: 0,
                scale: 0.9,
                rotationX: 5,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: tableRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            })

            // Table rows stagger animation with slide
            rowsRef.current.forEach((row, i) => {
                if (row) {
                    gsap.from(row, {
                        opacity: 0,
                        x: -50,
                        duration: 0.6,
                        delay: i * 0.06,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: row,
                            start: "top 90%",
                            toggleActions: "play none none reverse"
                        }
                    })

                    // Enhanced hover effect for rows
                    row.addEventListener('mouseenter', () => {
                        gsap.to(row, {
                            backgroundColor: "rgba(99, 102, 241, 0.08)",
                            scale: 1.01,
                            duration: 0.3,
                            ease: "power2.out"
                        })
                        // Animate cells
                        const cells = row.querySelectorAll('td')
                        cells.forEach((cell) => {
                            gsap.to(cell, {
                                color: "rgba(99, 102, 241, 0.9)",
                                duration: 0.3,
                                ease: "power2.out"
                            })
                        })
                    })
                    row.addEventListener('mouseleave', () => {
                        gsap.to(row, {
                            backgroundColor: "transparent",
                            scale: 1,
                            duration: 0.3,
                            ease: "power2.out"
                        })
                        const cells = row.querySelectorAll('td')
                        cells.forEach((cell) => {
                            gsap.to(cell, {
                                color: "",
                                duration: 0.3,
                                ease: "power2.out"
                            })
                        })
                    })
                }
            })

            // Pro column highlight animation with pulse
            const proCells = tableRef.current.querySelectorAll('td:nth-child(3)')
            proCells.forEach((cell, i) => {
                gsap.from(cell, {
                    scale: 0.6,
                    opacity: 0,
                    duration: 0.7,
                    delay: i * 0.08 + 0.3,
                    ease: "back.out(1.8)",
                    scrollTrigger: {
                        trigger: cell,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                })
                
                // Subtle pulse for pro column
                if (i % 2 === 0) {
                    gsap.to(cell, {
                        scale: 1.05,
                        duration: 1.5,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut"
                    })
                }
            })

            // Animate header with glow
            if (headerRef.current) {
                gsap.from(headerRef.current, {
                    opacity: 0,
                    y: -30,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                })
            }
        }

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
                            <tr key={i} ref={el => { rowsRef.current[i] = el; }} className="p-4 w-full border-t transition-all">
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

interface FAQ {
    q: string;
    a: string;
}

const faqs: FAQ[] = [
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
    const [que, setQue] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement>(null)
    const faqRef = useRef<(HTMLButtonElement | null)[]>([])
    const contentRef = useRef<(HTMLParagraphElement | null)[]>([])
    const [isAnimating, setIsAnimating] = useState<boolean>(false)

    useGSAP(() => {
        // Header animation with stagger
        if (containerRef.current) {
            gsap.from(containerRef.current.children, {
                opacity: 0,
                y: 40,
                duration: 0.7,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            })
        }

        // FAQ items animation with slide
        faqRef.current.forEach((item, i) => {
            if (item) {
                gsap.from(item, {
                    opacity: 0,
                    x: -40,
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 88%",
                        toggleActions: "play none none reverse"
                    }
                })

                // Enhanced hover effect for FAQ items
                item.addEventListener('mouseenter', () => {
                    gsap.to(item, {
                        x: 15,
                        backgroundColor: "rgba(99, 102, 241, 0.05)",
                        duration: 0.3,
                        ease: "power2.out"
                    })
                    // Animate the chevron
                    const chevron = item.querySelector('i')
                    if (chevron) {
                        gsap.to(chevron, {
                            scale: 1.2,
                            duration: 0.3,
                            ease: "back.out(1.7)"
                        })
                    }
                })
                item.addEventListener('mouseleave', () => {
                    gsap.to(item, {
                        x: 0,
                        backgroundColor: "transparent",
                        duration: 0.3,
                        ease: "power2.out"
                    })
                    const chevron = item.querySelector('i')
                    if (chevron) {
                        gsap.to(chevron, {
                            scale: 1,
                            duration: 0.3,
                            ease: "power2.out"
                        })
                    }
                })
            }
        })

    }, [])

    // Enhanced FAQ content animation when toggled
    useEffect(() => {
        if (que !== -1 && contentRef.current[que]) {
            setIsAnimating(true)
            gsap.from(contentRef.current[que], {
                opacity: 0,
                height: 0,
                y: -10,
                duration: 0.5,
                ease: "power3.out",
                clearProps: "height",
                onComplete: () => setIsAnimating(false)
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
                    <button 
                        type="button" 
                        key={i} 
                        ref={el => { faqRef.current[i] = el; }}
                        onClick={() => i == que ? setQue(-1) : setQue(i)}
                        className="flex flex-col w-full border-b hover:bg-background/50 transition-colors"
                        disabled={isAnimating}
                    >
                        <p className="flex items-center w-full text-left justify-between p-4 font-semibold">
                            {f.q}
                            <i className="transition-all duration-300" style={{ transform: i === que ? 'rotate(180deg)' : 'rotate(0)' }}>
                                {i == que ? <BsChevronUp /> : <BsChevronDown />}
                            </i>
                        </p>
                        <p 
                            ref={el => { contentRef.current[i] = el; }}
                            className={`${i == que ? 'block' : 'hidden'} text-left px-4 pb-4 w-full text-foreground/60`}
                        >
                            {f.a}
                        </p>
                    </button>

                ))}
            </div>  
        </div>
    )
}

function Cta(){
    const containerRef = useRef<HTMLDivElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        // CTA section animation with 3D perspective
        if (ctaRef.current) {
            gsap.from(ctaRef.current, {
                opacity: 0,
                scale: 0.85,
                y: 60,
                rotationX: 10,
                duration: 1,
                ease: "back.out(1.8)",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            })

            // Inner elements with stagger and bounce
            gsap.from(ctaRef.current.children, {
                opacity: 0,
                y: 40,
                duration: 0.7,
                stagger: 0.15,
                ease: "back.out(1.5)",
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            })

            // Enhanced pulse animation for the button
            const button = ctaRef.current.querySelector('a')
            if (button) {
                gsap.to(button, {
                    scale: 1.06,
                    boxShadow: "0 15px 40px rgba(99, 102, 241, 0.4)",
                    duration: 1.8,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                })
            }

            // Animated gradient background with floating
            const tl = gsap.timeline({
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            })
            tl.to(ctaRef.current, {
                backgroundPosition: "200% 200%",
                duration: 12
            })
            tl.to(ctaRef.current, {
                y: -8,
                duration: 3
            }, 0)
            tl.to(ctaRef.current, {
                y: 8,
                duration: 3
            }, 3)
        }

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
                flex items-center gap-2 transition-all hover:scale-105 hover:shadow-lg
                hover:bg-accent hover:text-accent-foreground">
                    <BsCloudUpload className="transition-transform group-hover:rotate-12" /> Drop files 
                </Link>

            </div>  
        </div>
    )
}