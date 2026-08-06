"use client"
import { useRef, RefObject } from 'react'
import Link from "next/link"
import { BsCloudUpload,
    BsLock,
    BsBullseye, BsEye,
    BsStars,
    BsLightning,
    BsShieldCheck, BsArrowRepeat,
    BsPinMap,
    BsDot,
} from "react-icons/bs"
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export default function About() {
  return (
    <>
      <Hero />
      <Problem />
      <Features />
      <RoadMap />
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

        // Animate badge
        tl.from(badgeRef.current, {
            opacity: 0,
            y: -30,
            duration: 0.6
        })
        // Animate title with split effect
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
        if (containerRef.current) {
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
        }

    }, [])

    return(
        <div ref={containerRef} className="grid-bg w-full flex flex-col items-center justify-center gap-4 text-center py-24 px-4 relative overflow-hidden">
            <span ref={badgeRef} className="flex items-center gap-2 text-xs text-foreground/60 py-1 px-3 rounded-lg border bg-secondary">
                <i className="text-primary"><BsStars /></i> 
                Our Story
            </span>
            <h1 ref={titleRef} className="text-3xl md:text-5xl font-bold">
                We didn't need another storage app.
            </h1>
            <p ref={descRef} className="text-foreground/60 text-center w-full max-w-xl text-sm md:text-base">
                DropBin exists for the moment between "I need to send this" and "they've got it." A high-speed conduit for files that were never meant to stay.
            </p>            
        </div>
    )
}

function Problem(){
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        // Container entrance animation
        if (containerRef.current) {
            gsap.from(containerRef.current, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            })
        }

        // Text content with stagger
        if (textRef.current) {
            gsap.from(textRef.current.children, {
                opacity: 0,
                x: -30,
                duration: 0.6,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: textRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            })
        }

        // Image reveal with scale and rotation
        if (imageRef.current) {
            gsap.from(imageRef.current, {
                opacity: 0,
                scale: 0.8,
                rotationY: 20,
                duration: 0.8,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: imageRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            })

            // Image hover animation
            imageRef.current.addEventListener('mouseenter', () => {
                gsap.to(imageRef.current, {
                    scale: 1.02,
                    rotationY: 5,
                    duration: 0.4,
                    ease: "power2.out"
                })
            })
            imageRef.current.addEventListener('mouseleave', () => {
                gsap.to(imageRef.current, {
                    scale: 1,
                    rotationY: 0,
                    duration: 0.4,
                    ease: "power2.out"
                })
            })
        }

    }, [])

    return(
        <div ref={containerRef} id="problem" className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8 py-24 px-4">
            <div ref={textRef} className="flex flex-col gap-6 items-start">
                <span className="flex items-center gap-2 text-xs text-foreground/60 py-1 px-3 rounded-lg border bg-secondary">
                    <i className="text-primary"><BsBullseye /></i> 
                    The Problem
                </span>
                <h1 className="text-2xl md:text-4xl font-bold">
                    People don't always need permanent cloud storage.
                </h1>
                <p className="text-foreground/60 w-full">
                    Sometimes they simply need to send a file — a contract, a recording, a build, a dataset. They don't want to create a folder, manage sync, or leave a permanent copy sitting on a server somewhere.
                </p>
                <p className="text-foreground/60 w-full">
                    Yet the tools available force permanence. They encourage accumulation. They turn a five-second task into account creation, folder hierarchies, and storage management.
                </p>
                <p className="text-foreground w-full font-semibold">
                    DropBin solves this by doing one thing exceptionally well: moving a file from you to someone else, then erasing the evidence.
                </p>
            </div> 

            <div ref={imageRef} className="rounded-xl" style={{width: '100%', aspectRatio: '3/2', overflow: 'hidden'}}>
                <img src='/block.jpg' alt="image" style={{objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%',}} />
            </div>
        </div>
    )
}

interface Feature {
    icon: React.ReactNode;
    name: string;
    desc: string;
}

const features: Feature[] = [
    {icon: <BsLock />, name: "Privacy", desc: "Your files are not our data. We don't index, profile, or monetize what passes through DropBin."},
    {icon: <BsLightning />, name: "Speed", desc: "Every millisecond is engineered away. Sharing should feel instantaneous, not procedural."},
    {icon: <BsShieldCheck />, name: "Security", desc: "Encryption in transit and at rest, on hardened infrastructure built for fleeting data."},
    {icon: <BsEye />, name: "Transparency", desc: "Clear expiration. Clear limits. No hidden retention, no quiet copies, no surprises."},
    {icon: <BsArrowRepeat />, name: "Reliability", desc: "When you share a link, it works — every time, on every device, in every browser."},
]

function Features(){
    const containerRef = useRef<HTMLDivElement>(null)
    const featuresRef = useRef<(HTMLDivElement | null)[]>([])
    const titleRef = useRef<HTMLHeadingElement>(null)

    useGSAP(() => {
        // Title animation
        if (titleRef.current) {
            gsap.from(titleRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            })
        }

        // Features grid animation with staggered entrance
        featuresRef.current.forEach((feature, i) => {
            if (feature) {
                gsap.from(feature, {
                    opacity: 0,
                    scale: 0.8,
                    y: 40,
                    duration: 0.6,
                    delay: i * 0.12,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: feature,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                })

                // Hover animations with floating effect
                feature.addEventListener('mouseenter', () => {
                    gsap.to(feature, {
                        y: -8,
                        scale: 1.03,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        duration: 0.3,
                        ease: "power2.out"
                    })
                    // Animate icon on hover
                    const icon = feature.querySelector('i')
                    if (icon) {
                        gsap.to(icon, {
                            scale: 1.2,
                            rotation: 10,
                            duration: 0.3,
                            ease: "back.out(1.7)"
                        })
                    }
                })
                feature.addEventListener('mouseleave', () => {
                    gsap.to(feature, {
                        y: 0,
                        scale: 1,
                        boxShadow: "0 0 0 rgba(0,0,0,0)",
                        duration: 0.3,
                        ease: "power2.out"
                    })
                    const icon = feature.querySelector('i')
                    if (icon) {
                        gsap.to(icon, {
                            scale: 1,
                            rotation: 0,
                            duration: 0.3,
                            ease: "power2.out"
                        })
                    }
                })
            }
        })

    }, [])

    return(
        <div ref={containerRef} id="features" className="w-full flex flex-col items-center justify-center gap-4 text-center py-8 px-4 
            bg-secondary">
            <h1 ref={titleRef} className="text-xl md:text-2xl font-bold">
                Key features
            </h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl my-8">
                {features.map((f, i) => (
                    <div 
                        key={i} 
                        ref={el => featuresRef.current[i] = el} 
                        className="flex items-start flex-col p-4 gap-4 bg-secondary border rounded-lg
                            shadow-lg hover:border-primary hover:shadow-primary/10"
                    >
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

interface Stage {
    one: string;
    two: string;
    three: string;
}

const stages: Stage[] = [
    {
        one: "Now live",
        two: "The Core Conduit",
        three: "Fast, secure, temporary file drops with passwords, expiration, and download limits."
    },
    {
        one: "Next",
        two: "Encrypted Vaults",
        three: "End-to-end encrypted drops where even DropBin can't read the payload — keys stay with you."
    },
    {
        one: "Soon",
        two: "Smart Delivery",
        three: "Email delivery receipts, scheduled drops, and expiring links that adapt to recipient behavior."
    },
    {
        one: "Later",
        two: "Team Channels",
        three: "Shared transient workspaces for teams that need ephemeral file pipelines, not storage."
    }
]

function RoadMap(){
    const containerRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLDivElement>(null)
    const stagesRef = useRef<(HTMLDivElement | null)[]>([])

    useGSAP(() => {
        // Title and description animation
        if (titleRef.current) {
            gsap.from(titleRef.current.children, {
                opacity: 0,
                y: 30,
                duration: 0.6,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            })
        }

        // Stages animation with timeline effect
        stagesRef.current.forEach((stage, i) => {
            if (stage) {
                gsap.from(stage, {
                    opacity: 0,
                    x: 50,
                    duration: 0.6,
                    delay: i * 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: stage,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                })

                // Animate the dot marker
                const dot = stage.querySelector('i')
                if (dot) {
                    gsap.from(dot, {
                        scale: 0,
                        rotation: 360,
                        duration: 0.6,
                        delay: i * 0.15 + 0.2,
                        ease: "back.out(1.7)",
                        scrollTrigger: {
                            trigger: stage,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    })

                    // Hover animation for stages
                    stage.addEventListener('mouseenter', () => {
                        gsap.to(stage, {
                            x: 10,
                            duration: 0.3,
                            ease: "power2.out"
                        })
                        gsap.to(dot, {
                            scale: 1.3,
                            backgroundColor: "rgba(99, 102, 241, 0.2)",
                            duration: 0.3,
                            ease: "power2.out"
                        })
                    })
                    stage.addEventListener('mouseleave', () => {
                        gsap.to(stage, {
                            x: 0,
                            duration: 0.3,
                            ease: "power2.out"
                        })
                        gsap.to(dot, {
                            scale: 1,
                            backgroundColor: "transparent",
                            duration: 0.3,
                            ease: "power2.out"
                        })
                    })
                }
            }
        })

    }, [])

    return(
        <div ref={containerRef} id="problem" className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 items-start justify-start gap-8 py-24 px-4">
            <div ref={titleRef} className="flex flex-col gap-4 col-span-1 lg:col-span-2 items-start">
                <span className="flex items-center gap-2 text-xs text-foreground/60 py-1 px-3 rounded-lg border bg-secondary">
                    <i className="text-primary"><BsPinMap /></i> 
                    Roadmap
                </span>
                <h1 className="text-2xl md:text-4xl font-bold">
                    Where we're headed.
                </h1>
                <p className="text-foreground/60 w-full max-w-xl">
                    DropBin is just getting started. Here's the direction we're moving — always centered on transience, speed, and trust.
                </p>
            </div> 

            <div className="col-span-1 lg:col-span-3 flex flex-col gap-4">
                {stages.map((s, i) => (
                    <div 
                        key={i} 
                        ref={el => stagesRef.current[i] = el} 
                        className="flex flex-col gap-2 py-4 pr-4 pl-12 hover:bg-secondary rounded-lg relative"
                    >
                        <span className="text-xs text-primary mono-font uppercase">{s.one}</span>
                        <h3 className="text-xl font-semibold">{s.two}</h3>
                        <p className="text-sm text-foreground/60">{s.three}</p>
                        <i className="absolute left-2 top-2 text-lg p-1 border rounded-full">
                            <BsDot />
                        </i>
                        <hr className="h-full absolute left-5 top-6 border rounded-lg" />
                    </div>
                ))}                
            </div>
        </div>
    )
}

function Cta(){
    const containerRef = useRef<HTMLDivElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        // CTA section animation with floating effect
        if (ctaRef.current) {
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
            if (button) {
                gsap.to(button, {
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
                    duration: 1.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                })
            }

            // Background gradient animation
            gsap.to(ctaRef.current, {
                backgroundPosition: "200% 200%",
                duration: 10,
                repeat: -1,
                ease: "sine.inOut"
            })
        }

    }, [])

    return(
        <div ref={containerRef} className="w-full flex flex-col items-center justify-center py-20 px-4">
            <div ref={ctaRef} className="w-full max-w-6xl bg-primary/20 rounded-2xl border flex flex-col gradient-bg text-primary-foreground
                items-center justify-center gap-4 text-center py-20 px-4"
                style={{backgroundSize: "200% 200%"}}>
                <h1 className="text-2xl md:text-4xl font-bold">
                    Try the conduit.
                </h1>
                <p className="text-foreground/60 text-center text-sm md:text-base">
                    Drop a file. Watch it vanish. That's the whole product.
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