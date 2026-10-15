import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, HeartHandshake, Leaf, PackageCheck, Pill, Recycle, ShieldCheck, Sparkles } from "lucide-react";
import communityImage from "@/assets/medicycle-community.jpg";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Recycle, title: "Reduce medicine waste", description: "Help usable, unopened medicines find a meaningful next chapter in your community." },
  { icon: HeartHandshake, title: "Bring people together", description: "Connect local pharmacies with the community organizations doing the work on the ground." },
  { icon: ShieldCheck, title: "Keep every request clear", description: "See what is offered, what is requested, and where each donation stands." },
];

const steps = [
  { number: "01", title: "Shops share what’s available", description: "Add medicines with clear quantities and expiry dates to your donation list." },
  { number: "02", title: "Organizations find a match", description: "Browse local listings and request the supplies your community needs." },
  { number: "03", title: "Donations find a new home", description: "Review requests and keep every hand-off visible, from pending to fulfilled." },
];

export function LandingPage() {
  return (
    <main>
      <header className="page-wrap flex h-[76px] items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" aria-label="MediCycle home">
          <span className="brand-mark"><Pill size={19} strokeWidth={2.2} /></span>
          <span className="brand-word">MediCycle</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex" aria-label="Main navigation">
          <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#our-impact" className="transition-colors hover:text-foreground">Our impact</a>
          <Link to="/login" className="transition-colors hover:text-foreground">Sign in</Link>
        </nav>
        <Button asChild className="h-10 rounded-md px-4">
          <Link to="/login">Get started <ArrowUpRight size={15} /></Link>
        </Button>
      </header>

      <section className="page-wrap grid min-h-[610px] items-center gap-12 pb-16 pt-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:pb-20 lg:pt-12">
        <div className="relative z-10 max-w-[560px]">
          <div className="eyebrow mb-6 inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-teal" />Better care, less waste</div>
          <h1 className="font-display max-w-[560px] text-[clamp(3.2rem,5.2vw,5.2rem)] font-semibold leading-[1.01] text-forest">Give medicines a <span className="text-teal">second chance.</span></h1>
          <p className="mt-6 max-w-[460px] text-lg leading-8 text-muted-foreground">We help pharmacies share surplus medicines with community organizations that need them—bringing more good to the places closest to home.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-md px-5"><Link to="/login">Get started <ArrowRight size={16} /></Link></Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-md border-border bg-card px-5"><a href="#how-it-works">How it works <ArrowDown size={15} /></a></Button>
          </div>
          <div className="mt-11 flex items-center gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
            <div className="flex -space-x-2" aria-hidden="true">
              <span className="grid size-8 place-items-center rounded-full border-2 border-background bg-mint text-forest"><Pill size={14} /></span>
              <span className="grid size-8 place-items-center rounded-full border-2 border-background bg-secondary text-teal"><HeartHandshake size={14} /></span>
              <span className="grid size-8 place-items-center rounded-full border-2 border-background bg-positive-soft text-positive"><Check size={14} /></span>
            </div>
            <span><strong className="font-semibold text-foreground">A little care goes further.</strong> Built for local impact.</span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[650px] lg:ml-auto">
          <div className="absolute -left-5 top-10 hidden h-[72%] w-[70%] rounded-[7px] bg-mint lg:block" />
          <div className="hero-photo relative overflow-hidden rounded-[8px]">
            <img src={communityImage} alt="Community volunteers carefully sorting medicine donations" width={1536} height={1024} className="h-[360px] w-full object-cover object-[62%_center] sm:h-[450px] lg:h-[510px]" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 rounded-[7px] border border-border/70 bg-card/95 p-4 backdrop-blur-sm sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-[7px] bg-mint text-forest"><PackageCheck size={19} /></span>
                <div><p className="text-sm font-semibold text-foreground">Small acts, shared well</p><p className="mt-0.5 text-xs text-muted-foreground">A community-first way to give</p></div>
              </div>
              <span className="hidden items-center gap-1.5 text-xs font-semibold text-positive sm:flex"><span className="size-1.5 rounded-full bg-positive" />Local impact</span>
            </div>
          </div>
          <div className="absolute -right-3 -top-3 grid size-12 place-items-center rounded-full border border-border bg-card text-teal shadow-sm sm:-right-5 sm:-top-5 sm:size-14"><Sparkles size={21} /></div>
        </div>
      </section>

      <section id="our-impact" className="border-y border-border bg-mint-pale">
        <div className="page-wrap grid gap-9 py-11 md:grid-cols-[0.68fr_1.32fr] md:items-center md:py-14">
          <div><p className="eyebrow">Why MediCycle</p><h2 className="mt-3 max-w-[340px] font-display text-2xl font-semibold leading-snug text-forest">Good medicine should go further.</h2></div>
          <div className="grid gap-7 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => <article key={title} className="border-l border-border pl-4 sm:pl-5"><Icon className="mb-4 text-teal" size={20} strokeWidth={1.8} /><h3 className="text-sm font-semibold text-foreground">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></article>)}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="page-wrap py-16 sm:py-20">
        <div className="grid gap-10 md:grid-cols-[0.72fr_1.28fr] md:items-end">
          <div><p className="eyebrow">A simple cycle</p><h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-forest sm:text-4xl">From extra stock<br className="hidden sm:block" /> to extra care.</h2></div>
          <p className="max-w-[450px] pb-1 text-base leading-7 text-muted-foreground md:justify-self-end">A clear, considered process helps useful supplies reach organizations serving neighbors in need.</p>
        </div>
        <div className="mt-10 grid border-y border-border sm:grid-cols-3">
          {steps.map((step, index) => <article key={step.number} className={`py-7 sm:py-9 ${index > 0 ? "border-t border-border sm:border-l sm:border-t-0 sm:pl-7" : "sm:pr-7"} ${index < 2 ? "sm:pr-7" : ""}`}>
            <p className="font-display text-sm font-semibold text-teal">{step.number}</p><h3 className="mt-4 font-display text-lg font-semibold text-forest">{step.title}</h3><p className="mt-2 max-w-[290px] text-sm leading-6 text-muted-foreground">{step.description}</p>
          </article>)}
        </div>
        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 rounded-[7px] bg-forest px-6 py-6 text-primary-foreground sm:px-8">
          <div><p className="text-lg font-semibold">Make the most of what’s already here.</p><p className="mt-1 text-sm text-primary-foreground/75">Start with your shop or your organization.</p></div>
          <Button asChild variant="secondary" className="h-10 rounded-md"><Link to="/register">Join MediCycle <ArrowRight size={15} /></Link></Button>
        </div>
      </section>

      <footer className="border-t border-border bg-mint-pale">
        <div className="page-wrap flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-2"><span className="brand-mark size-8 rounded-[9px]"><Pill size={16} /></span><span className="brand-word text-base">MediCycle</span></Link>
          <p className="text-xs text-muted-foreground">A prototype for connecting medicine donations with community care.</p>
          <Link to="/login" className="text-sm font-medium text-forest hover:text-teal">Sign in <ArrowRight className="ml-1 inline" size={14} /></Link>
        </div>
      </footer>
    </main>
  );
}