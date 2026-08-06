"use client"
import { useState, useRef, useEffect } from 'react'
import Link from "next/link"
import { BsCloudUpload, BsTags, BsCircleFill,
    BsClock,
    BsCloudDownload, BsLock,
    BsShare, BsDot,
    BsStars, BsTrash,
    BsLightning, BsFiles,
    BsShieldCheck, BsPersonX,
    BsDatabaseLock, BsInfoCircle,
    BsQuestionCircle,
    BsChevronDown, BsChevronUp,
} from "react-icons/bs"
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FileCard from '@/components/filecard'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export default function Home() {
    return (
        <>
            <Hero />
            <Card />
            <Step />
            <Features />
            <Why />
            <Faq />
            <Cta />
        </>
    );
}

function Hero() {
    const heroRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const descRef = useRef<HTMLParagraphElement>(null)
    const buttonsRef = useRef<HTMLDivElement>(null)
    const badgeRef = useRef<HTMLSpanElement>(null)

    useGSAP(() => {
        // Create a timeline for hero animations
        const tl = gsap.timeline({
            defaults: { ease: "power3.out" }
        })

        // Animate badge with bounce
        if (badgeRef.current) {
            tl.fromTo(badgeRef.current, 
                { opacity: 0, y: -40, scale: 0.8 },
                { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
            )
        }
        // Animate title with stagger and 3D effect
        if (titleRef.current) {
            tl.fromTo(titleRef.current?.children, 
                { opacity: 0, y: 50, rotationX: 10 },
                { opacity: 1, y: 0, rotationX: 0, duration: 1, stagger: 0.12, ease: "power3.out" }
            )
        }
        // Animate description
        if (descRef.current) {
            tl.fromTo(descRef.current, 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            )
        }
        // Animate buttons with stagger
        if (buttonsRef.current) {
            tl.fromTo(buttonsRef.current?.children, 
                { opacity: 0, y: 30, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.5)" }
            )
        }

        // Floating particles effect
        const particles = heroRef.current?.querySelectorAll('.particle')
        if (particles) {
            particles.forEach((particle, i) => {
                gsap.to(particle, {
                    y: gsap.utils.random(-30, 30),
                    x: gsap.utils.random(-20, 20),
                    duration: gsap.utils.random(4, 8),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: i * 0.4
                })
            })
        }

        // Parallax effect on hero
        if (heroRef.current) {
            gsap.to(heroRef.current, {
                y: -20,
                ease: "none",
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.5
                }
            })
        }

    }, [])

    return(
        <div ref={heroRef} className="grid-bg w-full flex flex-col items-center justify-center gap-4 text-center py-24 px-4 relative overflow-hidden">
            {/* Decorative particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="particle absolute w-2 h-2 bg-primary/10 rounded-full top-[10%] left-[5%]"></div>
                <div className="particle absolute w-3 h-3 bg-primary/10 rounded-full top-[70%] right-[8%]"></div>
                <div className="particle absolute w-2 h-2 bg-primary/10 rounded-full bottom-[20%] left-[15%]"></div>
                <div className="particle absolute w-4 h-4 bg-primary/10 rounded-full top-[40%] right-[12%]"></div>
                <div className="particle absolute w-2 h-2 bg-primary/10 rounded-full top-[20%] right-[25%]"></div>
                <div className="particle absolute w-3 h-3 bg-primary/10 rounded-full bottom-[30%] right-[20%]"></div>
            </div>

            <span ref={badgeRef} className="flex items-center gap-2 text-xs text-foreground/60 py-1 px-3 rounded-lg border bg-secondary relative z-10">
                <i className="text-primary"><BsStars /></i> 
                Secure <BsDot /> Temporary <BsDot /> Effortless
            </span>
            <h1 ref={titleRef} className="text-3xl md:text-5xl font-bold relative z-10">
                Temporary file sharing, <span className="gradient-text">made effortless.</span>
            </h1>
            <p ref={descRef} className="text-foreground/60 text-center w-full max-w-xl text-sm md:text-base relative z-10">
                Upload any file, share a secure link, and let DropBin automatically remove it when it's no longer needed. 
                No accounts. No clutter. No permanence.
            </p>

            <div ref={buttonsRef} className="flex flex-wrap justify-center items-center gap-2 w-full max-w-content text-sm relative z-10">
                <Link href="/drop"
                className="px-4 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold
                flex items-center gap-2 transition-all hover:scale-105 hover:shadow-lg
                hover:bg-accent hover:text-accent-foreground">
                    <BsCloudUpload className="transition-transform group-hover:rotate-12" /> Drop a file 
                </Link>
                <Link href="/pricing"
                className="px-4 py-3 rounded-2xl border font-semibold
                flex items-center gap-2 transition-all hover:scale-105 hover:shadow-lg
                hover:bg-accent hover:text-accent-foreground">
                    <BsTags /> See pricing 
                </Link>
            </div>
        </div>
    )
}

const file = {
    name: "Q3-financial-report.pdf",
    size: 13504,
    type: "application/pdf"
}

function Card() {
    const cardRef = useRef<HTMLDivElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)
    const detailsRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        // Animate card entrance with 3D effect
        if (cardRef.current) {
            gsap.fromTo(cardRef.current, 
                { opacity: 0, y: 60, scale: 0.9, rotationX: 5 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    rotationX: 0,
                    duration: 1.2,
                    ease: "back.out(1.8)",
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            )
        }

        // Animate progress bar with pulse
        if (progressRef.current) {
            gsap.fromTo(progressRef.current,
                { width: "0%" },
                { 
                    width: "100%", 
                    duration: 2.5, 
                    delay: 1,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: progressRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            )
        }

        // Animate details section with stagger
        if (detailsRef.current) {
            const items = detailsRef.current.children
            gsap.fromTo(items,
                { opacity: 0, x: -20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: detailsRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            )
        }

    }, [])

    return(
        <div ref={cardRef} className="max-w-xl mx-auto mb-12 w-[90%] flex flex-col rounded-lg border bg-secondary text-xs shadow-lg shadow-shadow">
            <div className="flex border-b p-4 gap-4 justify-between items-center w-full text-primary">
                <BsCircleFill className="animate-pulse" />
                <span className="text-foreground/60 mono-font">dropbin/d/k7s2...</span>
            </div>
            <div className="flex flex-col gap-3 p-4 w-full">
                <FileCard f={file} />               

                <div className="flex flex-col w-full gap-2">
                    <div className="flex items-center justify-between w-full">                            
                        <span>Encrypting & uploading</span>
                        <span className="mono-font text-primary">100%</span>
                    </div>
                    <div className="w-full rounded-xl gradient-bg p-1 relative overflow-hidden">
                        <div ref={progressRef} className="h-full w-0 relative">
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <div ref={detailsRef} className="p-3 rounded-lg border flex flex-col gap-2 w-full bg-secondary shadow-lg">
                    <div className="flex items-center gap-4 w-full">
                        <span className="text-primary"><BsShare/></span>
                        <span style={{whiteSpace: 'nowrap'}}>Drop link</span>
                        <span className="ml-auto text-foreground/60 mono-font truncate">https://dropbin/d/k7s2p9x5</span>
                    </div>
                    <div className="flex items-center gap-4 w-full">
                        <span className="text-primary"><BsClock/></span>
                        <span>Auto delete</span>
                        <span className="ml-auto text-foreground/60 mono-font">45m</span>
                    </div>
                    <div className="flex items-center gap-4 w-full">
                        <span className="text-primary"><BsCloudDownload/></span>
                        <span>Downloads left</span>
                        <span className="ml-auto text-foreground/60 mono-font">3 0f 5</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

const steps = [
    {num: "01", icon: <BsCloudUpload />, name: "Upload", desc: "Drop any file into DropBin. It's encrypted in transit and ready in seconds — no account, no setup."},
    {num: "02", icon: <BsShare />, name: "Share", desc: "Get a short, secure link instantly. Send it to anyone, anywhere. Add a password for extra control."},
    {num: "03", icon: <BsTrash />, name: "Auto Delete", desc: "Set an expiration or download limit. When the time's up, the file vanishes — permanently."},
]

function Step(){
    const stepRef = useRef<HTMLDivElement>(null)
    const stepCardsRef = useRef<(HTMLDivElement | null)[]>([])

    useGSAP(() => {
        // Animate step cards with stagger and 3D
        if (stepCardsRef.current) {
            gsap.fromTo(stepCardsRef.current, 
                { opacity: 0, y: 50, scale: 0.85, rotationY: 10 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    rotationY: 0,
                    duration: 0.9,
                    stagger: 0.2,
                    ease: "back.out(1.8)",
                    scrollTrigger: {
                        trigger: stepRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            )
        }

        // Enhanced hover animation for each card
        stepCardsRef.current.forEach((card) => {
            if (card) {
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, { 
                        y: -8, 
                        scale: 1.02,
                        boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)",
                        borderColor: "rgba(99, 102, 241, 0.3)",
                        duration: 0.4,
                        ease: "power3.out"
                    })
                    // Animate icon
                    const icon = card.querySelector('i')
                    if (icon) {
                        gsap.to(icon, {
                            scale: 1.2,
                            rotation: 10,
                            duration: 0.4,
                            ease: "back.out(1.7)"
                        })
                    }
                    // Animate number
                    const number = card.querySelector('.mono-font')
                    if (number) {
                        gsap.to(number, {
                            scale: 1.1,
                            color: "rgba(99, 102, 241, 0.8)",
                            duration: 0.3,
                            ease: "power2.out"
                        })
                    }
                })
                card.addEventListener('mouseleave', () => {
                    gsap.to(card, { 
                        y: 0, 
                        scale: 1,
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        borderColor: "transparent",
                        duration: 0.4,
                        ease: "power3.out"
                    })
                    const icon = card.querySelector('i')
                    if (icon) {
                        gsap.to(icon, {
                            scale: 1,
                            rotation: 0,
                            duration: 0.4,
                            ease: "power3.out"
                        })
                    }
                    const number = card.querySelector('.mono-font')
                    if (number) {
                        gsap.to(number, {
                            scale: 1,
                            color: "",
                            duration: 0.3,
                            ease: "power2.out"
                        })
                    }
                })
            }
        })
    }, [])

    return(
        <div id="how" ref={stepRef} className="w-full flex flex-col items-center justify-center gap-4 text-center py-24 px-4">
            <span className="flex items-center gap-2 text-xs text-foreground/60 py-1 px-3 rounded-lg border bg-secondary">
                <i className="text-primary"><BsCloudUpload /></i> 
                How it works
            </span>
            <h1 className="text-2xl md:text-4xl font-bold">
                Three steps. That's it.
            </h1>
            <p className="text-foreground/60 text-center w-full max-w-xl">
                No complex setup, no learning curve. DropBin turns file sharing into a single, frictionless motion.
            </p>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 w-full max-w-6xl py-4 my-8">
                {steps.map((s, i) => (
                    <div 
                        key={i} 
                        ref={el => { stepCardsRef.current[i] = el; }}
                        className="flex items-start flex-col p-4 gap-4 bg-secondary border rounded-lg
                        shadow-lg hover:border-primary hover:shadow-primary/10 transition-all"
                    >
                        <div className="flex w-full justify-between items-center text-xl">
                            <i className="p-4 rounded-sm text-primary bg-primary/10 transition-all">{s.icon}</i>
                            <span className="text-foreground/25 mono-font text-4xl transition-all">{s.num}</span>
                        </div>
                        <h2 className="text-base text-left font-semibold">{s.name}</h2>
                        <p className="text-foreground/60 text-left text-sm">{s.desc}</p>
                    </div>
                ))}
            </div>            
        </div>
    )
}

const features = [
    {icon: <BsClock />, name: "Automatic expiration", desc: "Set a timer from 1 hour to 30 days. Files self-destruct on schedule — no manual cleanup."},
    {icon: <BsLock />, name: "Password protection", desc: "Add an optional password so only the right people can access your drop."},
    {icon: <BsCloudDownload />, name: "Download limits", desc: "Cap downloads at 1, 5, 10, or more. Once the limit's hit, the link goes dark."},
    {icon: <BsLightning />, name: "Fast uploads", desc: "Optimized transfer means your file is ready to share before you finish typing the message."},
    {icon: <BsFiles />, name: "Large file support", desc: "Send hefty payloads without compression, ZIPs, or awkward workarounds."},
    {icon: <BsShieldCheck />, name: "Privacy first", desc: "We don't peek, index, or mine your data. Your files are yours — briefly, then gone."},
    {icon: <BsPersonX />, name: "No unnecessary accounts", desc: "No sign-up wall. Upload, share, move on. DropBin stays out of your way."},
    {icon: <BsDatabaseLock />, name: "Secure storage", desc: "Encrypted in transit and at rest on hardened infrastructure built for transience."},
]

function Features(){
    const featuresRef = useRef<HTMLDivElement>(null)
    const featureCardsRef = useRef<(HTMLDivElement | null)[]>([])

    useGSAP(() => {
        // Animate feature cards with alternating stagger
        if (featureCardsRef.current) {
            gsap.fromTo(featureCardsRef.current, 
                { opacity: 0, scale: 0.7, rotation: 5, y: 40 },
                { 
                    opacity: 1, 
                    scale: 1, 
                    rotation: 0,
                    y: 0,
                    duration: 0.8,
                    stagger: {
                        amount: 0.6,
                        from: "center"
                    },
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: featuresRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            )
        }

        // Enhanced hover animations
        featureCardsRef.current.forEach((card) => {
            if (card) {
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, { 
                        y: -12, 
                        scale: 1.04,
                        boxShadow: "0 25px 50px rgba(99, 102, 241, 0.15)",
                        borderColor: "rgba(99, 102, 241, 0.3)",
                        duration: 0.4,
                        ease: "power3.out"
                    })
                    const icon = card.querySelector('i')
                    if (icon) {
                        gsap.to(icon, {
                            scale: 1.3,
                            rotation: 15,
                            duration: 0.4,
                            ease: "back.out(1.8)"
                        })
                    }
                })
                card.addEventListener('mouseleave', () => {
                    gsap.to(card, { 
                        y: 0, 
                        scale: 1,
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        borderColor: "transparent",
                        duration: 0.4,
                        ease: "power3.out"
                    })
                    const icon = card.querySelector('i')
                    if (icon) {
                        gsap.to(icon, {
                            scale: 1,
                            rotation: 0,
                            duration: 0.4,
                            ease: "power3.out"
                        })
                    }
                })
            }
        })
    }, [])

    return(
        <div id="features" ref={featuresRef} className="w-full flex flex-col items-center justify-center gap-4 text-center py-24 px-4 
            bg-secondary">
            <span className="flex items-center gap-2 text-xs text-foreground/60 py-1 px-3 rounded-lg border bg-secondary">
                <i className="text-primary"><BsLightning /></i> 
                Features
            </span>
            <h1 className="text-2xl md:text-4xl font-bold">
                Built for the brief moment between send and gone.
            </h1>
            <p className="text-foreground/60 text-center w-full max-w-xl text-sm md:text-base">
                Everything you need to share files securely and temporarily — nothing you don't.
            </p>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl py-4 my-8">
                {features.map((f, i) => (
                    <div 
                        key={i} 
                        ref={el => { featureCardsRef.current[i] = el; }}
                        className="flex items-start flex-col p-4 gap-4 bg-secondary border rounded-lg
                        shadow-lg hover:border-primary hover:shadow-primary/10 transition-all"
                    >
                        <div className="flex w-full justify-between items-center text-xl">
                            <i className="p-4 rounded-sm text-primary bg-primary/10 transition-all">{f.icon}</i>
                        </div>
                        <h2 className="text-base text-left font-semibold">{f.name}</h2>
                        <p className="text-foreground/60 text-left text-sm">{f.desc}</p>
                    </div>
                ))}
            </div>            
        </div>
    )
}

const table = [
    {cap: 'Designed for temporary sharing', cloud: false, drop: true},
    {cap: 'No account required', cloud: false, drop: true},
    {cap: 'Auto-deletes after expiration', cloud: false, drop: true},
    {cap: 'Download limit controls', cloud: false, drop: true},
    {cap: 'Password-protected links', cloud: 'Limited', drop: true},
    {cap: 'Permanent storage', cloud: true, drop: false},
    {cap: 'Folder hierarchy & sync', cloud: true, drop: false},
    {cap: 'Lightweight & distraction-free', cloud: false, drop: true},
]

function Why(){
    const whyRef = useRef<HTMLDivElement>(null)
    const tableRef = useRef<HTMLTableElement>(null)

    useGSAP(() => {
        // Animate table with 3D perspective
        if (tableRef.current) {
            gsap.fromTo(tableRef.current,
                { opacity: 0, scale: 0.95, rotationX: 3 },
                {
                    opacity: 1,
                    scale: 1,
                    rotationX: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: whyRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            )

            const rows = tableRef.current?.querySelectorAll('tr')
            gsap.fromTo(rows, 
                { opacity: 0, x: -30 },
                { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.5,
                    stagger: 0.06,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: whyRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            )
        }
    }, [])

    return(
        <div id="why" ref={whyRef} className="w-full flex flex-col items-center justify-center gap-4 text-center py-24 px-4">
            <span className="flex items-center gap-2 text-xs text-foreground/60 py-1 px-3 rounded-lg border bg-secondary">
                <i className="text-primary"><BsInfoCircle /></i> 
                Why DropBin
            </span>
            <h1 className="text-2xl md:text-4xl font-bold">
                Not a warehouse. <span className="gradient-text">A conduit.</span>
            </h1>
            <p className="text-foreground/60 text-center w-full max-w-xl text-sm md:text-base">
                Cloud storage hoards. DropBin delivers — then disappears. Different tools for different jobs.
            </p>

            <div className="w-full max-w-6xl border overflow-hidden rounded-2xl my-8">
                <table ref={tableRef} className="w-full">
                    <thead>
                        <tr className="p-4 w-full">
                            <td className="w-[40%] border-r p-4 font-semibold bg-secondary text-left">
                                Capability
                            </td>
                            <td className="w-lg border-r p-4 font-semibold bg-secondary">
                                Cloud Storage
                            </td>
                            <td className="w-lg p-4 font-semibold bg-primary/10 text-primary">
                                DropBin
                            </td>
                        </tr>
                    </thead>
                    <tbody className="rounded-7xl">
                        {table.map((t, i) => (
                            <tr key={i} className="p-4 w-full border-t transition-all hover:bg-primary/5">
                                <td className="w-[40%] border-r p-4 text-foreground/60 text-left">
                                    {t.cap}
                                </td>
                                <td className={`w-lg border-r p-4 font-semibold
                                    ${t.cloud ? 'text-success' : 'text-destructive'}`}>
                                    {t.cloud == 'Limited' ? t.cloud : t.cloud ? '√' : '⨉'}
                                </td>
                                <td className={`w-lg p-4 font-semibold bg-primary/10
                                ${t.drop ? 'text-success' : 'text-destructive'}`}>
                                    {t.drop ? '√' : '⨉'}
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
        q: "How long are files stored?",        
        a: "You choose — anywhere from 5 minutes to 30 days. When the timer runs out, DropBin permanently removes the file and its link. No lingering copies, no recovery."
    },
    {
        q: "Can I password-protect files?",
        a: "Yes. Every drop has an optional password field. When enabled, recipients must enter the password before they can download — perfect for sensitive transfers.",
    },
    {
        q: "What happens after expiration?",
        a: "The file is deleted and the share link shows a clean 'This file has expired.' message. The data is gone for good — that's the whole point of DropBin.",
    },
    {
        q: "What's the maximum upload size?",
        a: "Free drops support up to 100 MB. Pro raises that to 2 GB, and Business supports 10 GB files — no compression or splitting required.",
    },
    {
        q: "Can I delete files early?",
        a: "Absolutely. If you need a drop gone before its expiration, you can remove it instantly by using the admin link provided after upload. It disappears immediately and permanently.",
    },
]

function Faq(){
    const [que, setQue] = useState<number>(-1);
    const faqRef = useRef<HTMLDivElement>(null)
    const answersRef = useRef<(HTMLParagraphElement | null)[]>([])
    const [isAnimating, setIsAnimating] = useState<boolean>(false)

    useGSAP(() => {
        // Animate FAQ items with stagger
        if (faqRef.current) {
            const faqItems = faqRef.current?.querySelectorAll('button')
            gsap.fromTo(faqItems, 
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: faqRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            )
        }
    }, [])

    // Enhanced answer expansion animation
    useEffect(() => {
        answersRef.current.forEach((answer, index) => {
            if (answer) {
                if (index === que) {
                    setIsAnimating(true)
                    gsap.to(answer, {
                        height: "auto",
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: "power3.out",
                        onComplete: () => setIsAnimating(false)
                    })
                } else {
                    gsap.to(answer, {
                        height: 0,
                        opacity: 0,
                        y: -10,
                        duration: 0.4,
                        ease: "power2.in"
                    })
                }
            }
        })
    }, [que])

    return(
        <div id="faqs" ref={faqRef} className="w-full flex flex-col items-center justify-center gap-4 text-center py-24 px-4
            bg-secondary">
            <span className="flex items-center gap-2 text-xs text-foreground/60 py-1 px-3 rounded-lg border bg-secondary">
                <i className="text-primary"><BsQuestionCircle /></i> 
                FAQs
            </span>
            <h1 className="text-2xl md:text-4xl font-bold">
                Questions, answered.
            </h1>
            <p className="text-foreground/60 text-center w-full max-w-xl text-sm md:text-base">
                Everything you might want to know before you drop your first file.
            </p>

            <div className="w-full max-w-4xl my-8">
                {faqs.map((f, i) => (
                    <button 
                        type="button" 
                        key={i} 
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
                            ref={el => { answersRef.current[i] = el; }}
                            className="text-left px-4 pb-4 w-full text-foreground/60 overflow-hidden"
                            style={{ height: 0, opacity: 0 }}
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
    const ctaRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        // Enhanced CTA animation with 3D perspective
        if (contentRef.current) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            })

            tl.fromTo(contentRef.current, 
                { opacity: 0, scale: 0.85, y: 50, rotationX: 5 },
                { 
                    opacity: 1, 
                    scale: 1, 
                    y: 0, 
                    rotationX: 0,
                    duration: 1,
                    ease: "back.out(1.8)"
                }
            )
            .fromTo(contentRef.current?.querySelectorAll('h1, p, a'), 
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.6,
                    stagger: 0.12,
                    ease: "power2.out"
                },
                "-=0.5"
            )

            // Floating animation for CTA
            gsap.to(contentRef.current, {
                y: -8,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            })
        }

        // Enhanced button pulse
        if (ctaRef.current) {
            const button = ctaRef.current.querySelector('a')
            if (button) {
                gsap.to(button, {
                    scale: 1.05,
                    boxShadow: "0 15px 40px rgba(99, 102, 241, 0.4)",
                    duration: 1.8,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                })
            }
        }

    }, [])

    return(
        <div ref={ctaRef} className="w-full flex flex-col items-center justify-center py-20 px-4">
            <div ref={contentRef} className="w-full max-w-6xl bg-primary/20 rounded-2xl border flex flex-col gradient-bg text-primary-foreground
                items-center justify-center gap-4 text-center py-20 px-4">
                <h1 className="text-2xl md:text-4xl font-bold">
                    Ready to share?
                </h1>
                <p className="text-foreground/60 text-center text-sm md:text-base">
                    No account. No commitment. Just drop your file and send the link.
                </p>

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