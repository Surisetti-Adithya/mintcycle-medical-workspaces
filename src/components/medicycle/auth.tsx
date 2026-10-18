import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, HeartHandshake, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMediCycle, type MediCycleRole } from "@/lib/medicycle-state";

type AuthPageProps = { mode: "login" | "register" };

export function AuthPage({ mode }: AuthPageProps) {
  const isRegister = mode === "register";
  const { signIn } = useMediCycle();
  const navigate = useNavigate();
  const [role, setRole] = useState<MediCycleRole>("shop");
  const [accountName, setAccountName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signIn(role, accountName || (role === "shop" ? "Greenway Pharmacy" : "Hopewell Community Care"));
    void navigate({ to: role === "shop" ? "/shop" : "/organization" });
  }

  return (
    <main className="min-h-screen bg-mint-pale">
      <div className="page-wrap flex min-h-screen flex-col py-6 sm:py-8">
        <Link to="/" className="flex w-fit items-center gap-2.5" aria-label="MediCycle home">
          <span className="brand-mark"><Pill size={19} strokeWidth={2.2} /></span>
          <span className="brand-word">MediCycle</span>
        </Link>
        <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <section className="hidden max-w-lg lg:block">
            <p className="eyebrow">A better cycle of care</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-forest">
              Good medicine goes further together.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Connect pharmacy donations with community organizations, and keep every request visible along the way.
            </p>
            <div className="mt-10 flex items-center gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
              <span className="grid size-9 place-items-center rounded-md bg-mint text-forest"><HeartHandshake size={18} /></span>
              Community care, made easier to coordinate.
            </div>
          </section>
          <section className="mx-auto w-full max-w-[480px] rounded-lg border border-border bg-card p-6 shadow-sm sm:p-9">
            <Link to="/" className="mb-7 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
              <ArrowLeft size={15} /> Back to home
            </Link>
            <p className="eyebrow">{isRegister ? "Join the community" : "Welcome back"}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-forest">
              {isRegister ? "Create your account" : "Sign in to MediCycle"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {isRegister ? "Choose your workspace to get started." : "Choose a workspace to open its demo."}
            </p>

            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              <fieldset>
                <legend className="field-label">I’m joining as</legend>
                <div className="grid grid-cols-2 gap-2">
                  {(["shop", "organization"] as const).map((value) => {
                    const selected = value === role;
                    const Icon = value === "shop" ? Pill : HeartHandshake;
                    return (
                      <Button
                        key={value}
                        type="button"
                        variant={selected ? "secondary" : "outline"}
                        aria-pressed={selected}
                        onClick={() => setRole(value)}
                        className={`h-12 justify-start ${selected ? "border-primary/30 bg-mint text-forest" : "bg-background"}`}
                      >
                        <Icon size={16} /> {value === "shop" ? "Medical shop" : "Organization"}
                      </Button>
                    );
                  })}
                </div>
              </fieldset>
              <div>
                <label htmlFor="accountName" className="field-label">{role === "shop" ? "Shop name" : "Organization name"}</label>
                <Input id="accountName" autoComplete="organization" value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder={role === "shop" ? "Greenway Pharmacy" : "Hopewell Community Care"} />
              </div>
              <div>
                <label htmlFor="email" className="field-label">Email address</label>
                <Input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.org" />
              </div>
              <div>
                <label htmlFor="password" className="field-label">Password</label>
                <Input id="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" />
              </div>
              <Button type="submit" className="h-11 w-full">
                {isRegister ? "Create demo workspace" : "Continue to workspace"} <ArrowRight size={16} />
              </Button>
            </form>
            <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
              Demo only: credentials are not checked or stored, and the sample medicines are fictional.
            </p>
            <p className="mt-5 text-sm text-muted-foreground">
              {isRegister ? "Already have an account?" : "New to MediCycle?"}{" "}
              <Link to={isRegister ? "/login" : "/register"} className="font-semibold text-forest underline-offset-4 hover:underline">
                {isRegister ? "Sign in" : "Create an account"}
              </Link>
            </p>
          </section>
        </div>
        <p className="text-xs text-muted-foreground">A MediCycle prototype for community medicine donations.</p>
      </div>
    </main>
  );
}