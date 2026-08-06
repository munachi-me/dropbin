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

        // Parallax effect on scroll - gentle movement
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

        // Floating particles effect (subtle background animation)
        const particles = containerRef.current?.querySelectorAll('.particle')
        if (particles) {
            particles.forEach((particle, i) => {
                gsap.to(particle, {
                    y: gsap.utils.random(-30, 30),
                    x: gsap.utils.random(-20, 20),
                    duration: gsap.utils.random(3, 6),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: i * 0.5
                })
            })
        }

    }, [])

    return(
        <div ref={containerRef} className="grid-bg w-full flex flex-col items-center justify-center gap-4 text-center py-24 px-4 relative overflow-hidden">
            {/* Background decorative particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="particle absolute w-2 h-2 bg-primary/10 rounded-full top-[20%] left-[10%]"></div>
                <div className="particle absolute w-3 h-3 bg-primary/10 rounded-full top-[60%] right-[15%]"></div>
                <div className="particle absolute w-2 h-2 bg-primary/10 rounded-full bottom-[30%] left-[20%]"></div>
                <div className="particle absolute w-4 h-4 bg-primary/10 rounded-full top-[40%] right-[25%]"></div>
            </div>

            <span ref={badgeRef} className="flex items-center gap-2 text-xs text-foreground/60 py-1 px-3 rounded-lg border bg-secondary relative z-10">
                <i className="text-primary"><BsStars /></i> 
                Our Story
            </span>
            <h1 ref={titleRef} className="text-3xl md:text-5xl font-bold relative z-10">
                We didn't need another storage app.
            </h1>
            <p ref={descRef} className="text-foreground/60 text-center w-full max-w-xl text-sm md:text-base relative z-10">
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
        // Container entrance animation with parallax
        if (containerRef.current) {
            gsap.from(containerRef.current, {
                opacity: 0,
                y: 60,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            })
        }

        // Text content with staggered entrance from left
        if (textRef.current) {
            const textElements = textRef.current.children
            gsap.from(textElements, {
                opacity: 0,
                x: -50,
                duration: 0.7,
                stagger: 0.12,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: textRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            })
        }

        // Image reveal with 3D flip effect
        if (imageRef.current) {
            gsap.from(imageRef.current, {
                opacity: 0,
                scale: 0.7,
                rotationY: 30,
                duration: 1,
                ease: "back.out(1.8)",
                scrollTrigger: {
                    trigger: imageRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            })

            // Image hover animations with 3D tilt
            imageRef.current.addEventListener('mouseenter', () => {
                gsap.to(imageRef.current, {
                    scale: 1.03,
                    rotationY: 5,
                    rotationX: 3,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    duration: 0.5,
                    ease: "power2.out"
                })
            })
            imageRef.current.addEventListener('mouseleave', () => {
                gsap.to(imageRef.current, {
                    scale: 1,
                    rotationY: 0,
                    rotationX: 0,
                    boxShadow: "0 0 0 rgba(0,0,0,0)",
                    duration: 0.5,
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
        // Title animation with glow effect
        if (titleRef.current) {
            gsap.from(titleRef.current, {
                opacity: 0,
                y: 40,
                scale: 0.9,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            })
        }

        // Features grid animation with staggered entrance
        featuresRef.current.forEach((feature, i) => {
            if (feature) {
                gsap.from(feature, {
                    opacity: 0,
                    scale: 0.7,
                    y: 50,
                    rotation: 5,
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: "back.out(1.8)",
                    scrollTrigger: {
                        trigger: feature,
                        start: "top 88%",
                        toggleActions: "play none none reverse"
                    }
                })

                // Enhanced hover animations
                feature.addEventListener('mouseenter', () => {
                    gsap.to(feature, {
                        y: -12,
                        scale: 1.05,
                        boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)",
                        borderColor: "rgba(99, 102, 241, 0.3)",
                        duration: 0.4,
                        ease: "power3.out"
                    })
                    
                    const icon = feature.querySelector('i')
                    if (icon) {
                        gsap.to(icon, {
                            scale: 1.3,
                            rotation: 15,
                            duration: 0.4,
                            ease: "back.out(1.8)"
                        })
                    }
                    
                    // Animate description text
                    const desc = feature.querySelector('p')
                    if (desc) {
                        gsap.to(desc, {
                            color: "rgba(99, 102, 241, 0.8)",
                            duration: 0.3,
                            ease: "power2.out"
                        })
                    }
                })
                
                feature.addEventListener('mouseleave', () => {
                    gsap.to(feature, {
                        y: 0,
                        scale: 1,
                        boxShadow: "0 0 0 rgba(0,0,0,0)",
                        borderColor: "transparent",
                        duration: 0.4,
                        ease: "power3.out"
                    })
                    
                    const icon = feature.querySelector('i')
                    if (icon) {
                        gsap.to(icon, {
                            scale: 1,
                            rotation: 0,
                            duration: 0.4,
                            ease: "power3.out"
                        })
                    }
                    
                    const desc = feature.querySelector('p')
                    if (desc) {
                        gsap.to(desc, {
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
        <div ref={containerRef} id="features" className="w-full flex flex-col items-center justify-center gap-4 text-center py-8 px-4 
            bg-secondary">
            <h1 ref={titleRef} className="text-xl md:text-2xl font-bold">
                Key features
            </h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl my-8">
                {features.map((f, i) => (
                    <div 
                        key={i} 
                        ref={el => { featuresRef.current[i] = el; }} 
                        className="flex items-start flex-col p-4 gap-4 bg-secondary border rounded-lg
                            shadow-lg hover:border-primary hover:shadow-primary/10 transition-all"
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
        // Title and description animation with slide-up
        if (titleRef.current) {
            gsap.from(titleRef.current.children, {
                opacity: 0,
                y: 40,
                duration: 0.7,
                stagger: 0.15,
                ease: "power3.out",
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
                // Main card entrance
                gsap.from(stage, {
                    opacity: 0,
                    x: 60,
                    duration: 0.7,
                    delay: i * 0.12,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: stage,
                        start: "top 88%",
                        toggleActions: "play none none reverse"
                    }
                })

                // Animate the dot marker with bounce
                const dot = stage.querySelector('i')
                if (dot) {
                    gsap.from(dot, {
                        scale: 0,
                        rotation: 360,
                        duration: 0.8,
                        delay: i * 0.12 + 0.2,
                        ease: "back.out(2)",
                        scrollTrigger: {
                            trigger: stage,
                            start: "top 88%",
                            toggleActions: "play none none reverse"
                        }
                    })

                    // Animate the timeline line
                    const line = stage.querySelector('hr')
                    if (line) {
                        gsap.from(line, {
                            scaleY: 0,
                            transformOrigin: "top",
                            duration: 0.6,
                            delay: i * 0.12 + 0.3,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: stage,
                                start: "top 88%",
                                toggleActions: "play none none reverse"
                            }
                        })
                    }

                    // Enhanced hover animations
                    stage.addEventListener('mouseenter', () => {
                        gsap.to(stage, {
                            x: 15,
                            backgroundColor: "rgba(99, 102, 241, 0.05)",
                            duration: 0.4,
                            ease: "power3.out"
                        })
                        gsap.to(dot, {
                            scale: 1.5,
                            backgroundColor: "rgba(99, 102, 241, 0.2)",
                            borderColor: "rgba(99, 102, 241, 0.4)",
                            duration: 0.4,
                            ease: "back.out(1.7)"
                        })
                        // Animate the stage title
                        const title = stage.querySelector('h3')
                        if (title) {
                            gsap.to(title, {
                                color: "rgba(99, 102, 241, 0.9)",
                                x: 5,
                                duration: 0.3,
                                ease: "power2.out"
                            })
                        }
                    })
                    
                    stage.addEventListener('mouseleave', () => {
                        gsap.to(stage, {
                            x: 0,
                            backgroundColor: "transparent",
                            duration: 0.4,
                            ease: "power3.out"
                        })
                        gsap.to(dot, {
                            scale: 1,
                            backgroundColor: "transparent",
                            borderColor: "",
                            duration: 0.4,
                            ease: "power3.out"
                        })
                        const title = stage.querySelector('h3')
                        if (title) {
                            gsap.to(title, {
                                color: "",
                                x: 0,
                                duration: 0.3,
                                ease: "power2.out"
                            })
                        }
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
                        ref={el => { stagesRef.current[i] = el; }} 
                        className="flex flex-col gap-2 py-4 pr-4 pl-12 hover:bg-secondary rounded-lg relative transition-colors"
                    >
                        <span className="text-xs text-primary mono-font uppercase">{s.one}</span>
                        <h3 className="text-xl font-semibold transition-colors">{s.two}</h3>
                        <p className="text-sm text-foreground/60">{s.three}</p>
                        <i className="absolute left-2 top-2 text-lg p-1 border rounded-full transition-all">
                            <BsDot />
                        </i>
                        <hr className="h-full absolute left-5 top-6 border rounded-lg transition-transform" />
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

            // Animated gradient background
            gsap.to(ctaRef.current, {
                backgroundPosition: "200% 200%",
                duration: 12,
                repeat: -1,
                ease: "sine.inOut"
            })

            // Subtle floating effect for the entire section
            gsap.to(ctaRef.current, {
                y: -10,
                duration: 3,
                repeat: -1,
                yoyo: true,
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