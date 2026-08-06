"use client"
import { useState, useRef, useEffect } from 'react'
import Link from "next/link"
import { BsCloudUpload, BsTags, BsCircleFill,
    BsFileEarmarkPdf,
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
import FileCard from '@/components/filecard'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
    const containerRef = useRef(null)
    const badgeRef = useRef(null)
    const titleRef = useRef(null)
    const descRef = useRef(null)
    const buttonsRef = useRef(null)

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
            scale: 0.9
        })
        // Animate description
        .from(descRef.current, {
            opacity: 0,
            y: 30,
            duration: 0.6
        })
        // Animate buttons
        .from(buttonsRef.current.children, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.15,
            ease: "back.out(1.7)"
        })

        // Parallax effect on scroll
        gsap.to(containerRef.current, {
            y: -50,
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
        <div ref={containerRef} className="grid-bg w-full flex flex-col items-center justify-center gap-4 text-center py-24 px-4 relative overflow-hidden">
            <span ref={badgeRef} className="flex items-center gap-2 text-xs text-foreground/60 py-1 px-3 rounded-lg border bg-secondary">
                <i className="text-primary"><BsStars /></i> 
                Secure <BsDot /> Temporary <BsDot /> Effortless
            </span>
            <h1 ref={titleRef} className="text-3xl md:text-5xl font-bold">
                Temporary file sharing, <span className="gradient-text">made effortless.</span>
            </h1>
            <p ref={descRef} className="text-foreground/60 text-center w-full max-w-xl text-sm md:text-base">
                Upload any file, share a secure link, and let DropBin automatically remove it when it's no longer needed. 
                No accounts. No clutter. No permanence.
            </p>

            <div ref={buttonsRef} className="flex flex-wrap justify-center items-center gap-2 w-full max-w-content text-sm">
                <Link href="/drop"
                className="px-4 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold
                flex items-center gap-2
                hover:bg-accent hover:text-accent-foreground">
                    <BsCloudUpload /> Drop a file 
                </Link>
                <Link href="/pricing"
                className="px-4 py-3 rounded-2xl border font-semibold
                flex items-center gap-2
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
    const cardRef = useRef(null)
    const progressRef = useRef(null)
    const detailsRef = useRef(null)

    useGSAP(() => {
        // Card entrance animation
        gsap.from(cardRef.current, {
            opacity: 0,
            y: 80,
            duration: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: cardRef.current,
                start: "top 85%",
                end: "top 60%",
                toggleActions: "play none none reverse"
            }
        })

        // Progress bar animation
        gsap.from(progressRef.current, {
            width: "0%",
            duration: 2,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: progressRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        })

        // Details animation with stagger
        gsap.from(detailsRef.current.children, {
            opacity: 0,
            x: -20,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: detailsRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        })

    }, [])

    return(
        <div ref={cardRef} className="max-w-xl mx-auto mb-12 w-[90%] flex flex-col rounded-lg border bg-secondary text-xs shadow-lg shadow-shadow">
            <div className="flex border-b p-4 gap-4 justify-between items-center w-full text-primary">
                <BsCircleFill />
                <span className="text-foreground/60 mono-font">dropbin/d/k7s2...</span>
            </div>
            <div className="flex flex-col gap-3 p-4 w-full">
                <FileCard f={file} />               

                <div className="flex flex-col w-full gap-2">
                    <div className="flex items-center justify-between w-full">                            
                        <span>Encrypting & uploading</span>
                        <span className="mono-font text-primary">100%</span>
                    </div>
                    <div className="w-full rounded-xl gradient-bg p-1">
                        <div ref={progressRef} className="h-1 rounded-xl bg-primary/30 w-[100%]">
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
                        <span className="ml-auto text-foreground/60 mono-font">3 of 5</span>
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
    const containerRef = useRef(null)
    const stepsRef = useRef([])

    useGSAP(() => {
        // Header animation
        gsap.from(containerRef.current.children, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.2,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        })

        // Steps animation with stagger and 3D rotation
        stepsRef.current.forEach((step, i) => {
            gsap.from(step, {
                opacity: 0,
                y: 60,
                rotationY: 30,
                duration: 0.8,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: step,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            })
        })

        // Hover animation setup
        stepsRef.current.forEach((step) => {
            step.addEventListener('mouseenter', () => {
                gsap.to(step, {
                    y: -8,
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                })
            })
            step.addEventListener('mouseleave', () => {
                gsap.to(step, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                })
            })
        })

    }, [])

    return(
        <div ref={containerRef} id="how" className="w-full flex flex-col items-center justify-center gap-4 text-center py-24 px-4">
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
                    <div key={i} ref={el => stepsRef.current[i] = el} className="flex items-start flex-col p-4 gap-4 bg-secondary border rounded-lg
                        shadow-lg hover:border-primary hover:shadow-primary/10">
                        <div className="flex w-full justify-between items-center text-xl">
                            <i className="p-4 rounded-sm text-primary bg-primary/10">{s.icon}</i>
                            <span className="text-foreground/25 mono-font text-4xl">{s.num}</span>
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
    const containerRef = useRef(null)
    const featuresRef = useRef([])

    useGSAP(() => {
        // Header animation
        gsap.from(containerRef.current.children, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.2,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        })

        // Features grid animation with staggered entrance
        featuresRef.current.forEach((feature, i) => {
            gsap.from(feature, {
                opacity: 0,
                scale: 0.8,
                duration: 0.6,
                delay: i * 0.1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: feature,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            })
        })

        // Hover animations
        featuresRef.current.forEach((feature) => {
            feature.addEventListener('mouseenter', () => {
                gsap.to(feature, {
                    y: -8,
                    scale: 1.03,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    duration: 0.3,
                    ease: "power2.out"
                })
            })
            feature.addEventListener('mouseleave', () => {
                gsap.to(feature, {
                    y: 0,
                    scale: 1,
                    boxShadow: "0 0 0 rgba(0,0,0,0)",
                    duration: 0.3,
                    ease: "power2.out"
                })
            })
        })

    }, [])

    return(
        <div ref={containerRef} id="features" className="w-full flex flex-col items-center justify-center gap-4 text-center py-24 px-4 
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
                    <div key={i} ref={el => featuresRef.current[i] = el} className="flex items-start flex-col p-4 gap-4 bg-secondary border rounded-lg
                        shadow-lg hover:border-primary hover:shadow-primary/10">
                        <div className="flex w-full justify-between items-center text-xl">
                            <i className="p-4 rounded-sm text-primary bg-primary/10">{f.icon}</i>
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
    const containerRef = useRef(null)
    const tableRef = useRef(null)
    const rowsRef = useRef([])

    useGSAP(() => {
        // Header animation
        gsap.from(containerRef.current.children, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.2,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        })

        // Table entrance with reveal effect
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
                x: -30,
                duration: 0.4,
                delay: i * 0.08,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: row,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            })
        })

    }, [])

    return(
        <div ref={containerRef} id="why" className="w-full flex flex-col items-center justify-center gap-4 text-center py-24 px-4">
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

            <div ref={tableRef} className="w-full max-w-6xl border overflow-hidden rounded-2xl my-8">
                <table className="w-full">
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
                            <tr key={i} ref={el => rowsRef.current[i] = el} className="p-4 w-full border-t">
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
            stagger: 0.2,
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
        })

    }, [])

    // Animate FAQ content when toggled
    useEffect(() => {
        if (que !== -1) {
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
                Questions, answered.
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
        // CTA section animation
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

        // Inner elements animation
        gsap.from(ctaRef.current.children, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ctaRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        })

        // Pulsing animation for the button
        gsap.to(ctaRef.current.querySelector('a'), {
            scale: 1.05,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        })

    }, [])

    return(
        <div ref={containerRef} className="w-full flex flex-col items-center justify-center py-20 px-4">
            <div ref={ctaRef} className="w-full max-w-6xl bg-primary/20 rounded-2xl border flex flex-col gradient-bg text-primary-foreground
                items-center justify-center gap-4 text-center py-20 px-4">
                <h1 className="text-2xl md:text-4xl font-bold">
                    Ready to share?
                </h1>
                <p className="text-foreground/60 text-center text-sm md:text-base">
                    No account. No commitment. Just drop your file and send the link.
                </p>

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