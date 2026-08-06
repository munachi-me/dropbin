"use client"
import { useState } from 'react'
import Link from "next/link"
import { BsCloudUpload, BsTags,
    BsCheck, BsInfoCircle, BsQuestionCircle,
    BsChevronDown, BsChevronUp,
    BsArrowRight, BsStars, BsLightning, BsBuildings,
} from "react-icons/bs"

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
    return(
        <div className="grid-bg w-full flex flex-col items-center justify-center gap-4 text-center pt-24 pb-12 px-4 relative overflow-hidden">
            <span className="flex items-center gap-2 text-xs text-foreground/60 py-1 px-3 rounded-lg border bg-secondary">
                <i className="text-primary"><BsTags /></i> 
                Pricing
            </span>
            <h1 className="text-3xl md:text-5xl font-bold">
                Pay for <span className="gradient-text">power</span>, not for storage.
            </h1>
            <p className="text-foreground/60 text-center w-full max-w-xl text-sm md:text-base">
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
    return(
        <div className="w-full flex flex-col items-center justify-center gap-4 py-24 px-4">
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 p-4 gap-8">
                {tiers.map((t, i) => (
                    <div 
                        key={i} 
                        className={`flex flex-col p-8 gap-8 rounded-2xl border relative shadow-lg bg-secondary/50
                        ${t.special ? 'glow border-primary/30' : ''}`}
                    >
                        {t.special ? 
                            <span className="absolute text-xs py-2 px-4 w-[60%] rounded-lg bg-primary text-primary-foreground
                            text-center font-semibold top-0 left-[50%] translate-[-50%]">
                                ⚡ Popular
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
                        ${t.special ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-background text-foreground border hover:bg-accent hover:text-accent-foreground'}`}>
                            {t.lk_title} <BsArrowRight />
                        </Link>

                        <hr className="w-full border" />

                        <div className="flex flex-col gap-2 text-sm text-foreground/60">
                            {t.specs.map((s, index) => (
                                <span key={index} className="flex items-center gap-2">
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
    return(
        <div id="compare" className="w-full flex flex-col items-center justify-center gap-4 text-center py-24 px-4">
            <span className="flex items-center gap-2 text-xs text-foreground/60 py-1 px-3 rounded-lg border bg-secondary">
                <i className="text-primary"><BsInfoCircle /></i> 
                Compare
            </span>
            <h1 className="text-2xl md:text-4xl font-bold">
                Every detail, side by side.
            </h1>

            <div className="w-full max-w-6xl border overflow-hidden rounded-2xl my-8">
                <table className="w-full">
                    <thead>
                        <tr className="p-4 w-full">
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
                            <tr key={i} className="p-4 w-full border-t hover:bg-primary/5">
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

    return(
        <div id="faqs" className="w-full flex flex-col items-center justify-center gap-4 text-center py-24 px-4
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
                        onClick={() => i == que ? setQue(-1) : setQue(i)}
                        className="flex flex-col w-full border-b hover:bg-background/50"
                    >
                        <p className="flex items-center w-full text-left justify-between p-4 font-semibold">
                            {f.q}
                            <i className="transition-transform duration-300" style={{ transform: i === que ? 'rotate(180deg)' : 'rotate(0)' }}>
                                {i == que ? <BsChevronUp /> : <BsChevronDown />}
                            </i>
                        </p>
                        <p className={`${i == que ? 'block' : 'hidden'} text-left px-4 pb-4 w-full text-foreground/60`}>
                            {f.a}
                        </p>
                    </button>

                ))}
            </div>  
        </div>
    )
}

function Cta(){
    return(
        <div className="w-full flex flex-col items-center justify-center py-20 px-4">
            <div className="w-full max-w-6xl bg-primary/20 rounded-2xl border flex flex-col gradient-bg text-primary-foreground
                items-center justify-center gap-4 text-center py-20 px-4">
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