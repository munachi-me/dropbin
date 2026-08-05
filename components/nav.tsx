"use client"

import {usePathname} from 'next/navigation'
import Link from 'next/link'
import {
    BsCircleFill, BsMoon, BsSun, BsX, BsList,
}  from 'react-icons/bs'
import {useState, useEffect} from 'react'


const links = [
    {name: "Home", url: "/"},
    {name: "About", url: "/about"},
    {name: "Pricing", url: "/pricing"},
    {name: "Drop", url: "/drop"},
]
export default function Nav(){
    const path = usePathname();
    const [scroll, setScroll] = useState<boolean>(false);
    const [dark, setDark] = useState(false);
    const [nav, setNav] = useState(false);

    useEffect(()=>{
        window.addEventListener('scroll', ()=>{
            const isScroll: boolean = window.scrollY > 20;
            setScroll(isScroll);
        })
    }, [scroll])

    return(
        <nav className={`flex w-full fixed z-5 top-0 left-0 p-4 ${scroll ? 'border-b backdrop-blur-lg bg-background/60' : ''}`}>
            <div className="flex w-full max-w-6xl items-center justify-between mx-auto my-0">
                <Link href="/" className="flex items-center gap-2 text-primary">
                    <BsCircleFill />
                    <h3 className="text-foreground font-bold">DropBin</h3>
                </Link>

                <div className={`flex flex-col items-center justify-center gap-2 absolute w-full left-0 p-4 bg-background border-b
                z-2 ${nav ? 'top-[100%]' : 'top-[-1000%]'} md:flex-row md:static md:${nav ? 'top-0' : 'top-0'}
                md:p-0 md:border-0 md:bg-transparent md:max-w-content`}>
                    {links.map((l, i) => (
                        <Link href={l.url} key={i} 
                        className={`text-sm rounded-4xl py-2 px-4 hover:text-secondary-foreground hover:bg-secondary
                        ${path == l.url ? 'bg-primary text-primary-foreground' : 'text-foreground/60'}`}>
                            {l.name}
                        </Link>
                    ))}                    
                </div>

                
                 <div className="flex items-center gap-2">
                    <label htmlFor="theme" onClick={()=> setDark(!dark)} className="p-2 text-sm border rounded-full text-foreground/60
                     hover:bg-accent hover:text-accent-foreground">
                        {dark ? <BsMoon /> : <BsSun />}                        
                    </label>

                    <button type="button" onClick={()=> setNav(!nav)} className="flex md:hidden p-2 text-sm border rounded-full text-foreground/60
                     hover:bg-accent hover:text-accent-foreground">
                        {nav ? <BsX /> : <BsList />}                        
                    </button>

                    <Link href="/drop" 
                    className="hidden md:block text-sm px-4 py-2 rounded-2xl bg-primary text-primary-foreground font-medium 
                    hover:bg-accent hover:text-accent-foreground " style={{whiteSpace: 'nowrap'}}>
                        Drop a file
                    </Link>
                </div> 
            </div>
        </nav>
    )
}
