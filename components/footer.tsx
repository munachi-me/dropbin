// "use client"
import Link from 'next/link'
import {
    BsTwitterX, 
    BsGithub, 
    BsInstagram,
    BsLinkedin,
    BsCCircle,
}  from 'react-icons/bs'


const product = [
    {name: "Home", url: "/"},
    {name: "About", url: "/about"},
    {name: "Pricing", url: "/pricing"},
    {name: "Drop", url: "/drop"},
]
const resources = [
    {name: "How it works", url: "/#how"},
    {name: "Features", url: "/#features"},
    {name: "FAQs", url: "/#faqs"},
]
const legal = [
    {name: "Privacy", url: "/about"},
    {name: "Terms", url: "/about"},
    {name: "Security", url: "/about"},
]
const links = [
    {name: "Product", array: product},
    {name: "Resources", array: resources},
    {name: "Legal", array: legal},
]
const socials = [
    {name: "X (Twitter)", lk: "#", icon: <BsTwitterX />},
    {name: "Instagram", lk: "#", icon: <BsInstagram />},
    {name: "LinkedIn", lk: "#", icon: <BsLinkedin/>},
    {name: "Github", lk: "https://munachi-prime/dropbin.git", icon: <BsGithub />},
]


export default function Footer(){
    return(
        <footer className="w-full border-t px-4 pt-12 pb-8 mt-auto flex flex-col gap-8 text-sm">
            <div className="w-full max-w-6xl mx-auto grid grid-cols-3 lg:grid-cols-6 gap-8">
                <div className="flex flex-col gap-4 font-md col-span-3">
                    <Link href="/" className="flex items-center gap-2 text-primary">
                        <img src='/dropbin_icon.png' alt="DropBin Logo" className="w-auto h-xs" />
                        <span className="text-foreground font-bold">DropBin</span>
                    </Link>
                    <p className="text-foreground/60 max-w-lg">
                        Share files in seconds. Fast, temporary file sharing, made effortless. 
                        Upload any file via drag or drop, and get a shareable secure link instantly. 
                        Files auto-delete so you never have to clean up.
                    </p>
                    <div className="flex gap-2 items-center text-foreground/60">
                        {socials.map((s, i) => (
                            <Link href={s.lk} key={i} title={s.name}
                            className="flex items-center justify-center p-2 rounded-full border
                            hover:text-primary hover:bg-foreground">
                                {s.icon}
                            </Link>
                        ))}
                    </div>
                </div>

                {links.map((l, i)=>(
                    <div key={i} className="flex flex-col gap-4 items-start">
                        <span className="font-semibold">{l.name}</span>
                        {l.array.map((a, index)=>(
                            <Link key={index} href={a.url} 
                            className="text-foreground/60 hover:text-primary hover:underline">
                                {a.name}
                            </Link>
                        ))}
                    </div>
                ))}
            </div>

            <div className="w-full max-w-6xl mx-auto flex flex-wrap gap-6 border-t py-4 
            text-foreground/60 justify-between mono-font text-xs">
                <p className="min-w-content flex items-center gap-2">
                   <BsCCircle /> 2026 DropBin. All rights reserved. 
                </p>
                <p className="min-w-content">
                    Drop. Share. Done.
                </p>
            </div>
        </footer>
    )
}
