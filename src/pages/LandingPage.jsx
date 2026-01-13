import { Link } from 'react-router-dom';
import {
    Building2, ArrowRight, CheckCircle2, Clock,
    TrendingDown, BarChart3, ShieldCheck, FileText,
    Users, Bell, Lock, Menu, X, Check
} from 'lucide-react';
import { useState } from 'react';

// --- COMPONENTES UI INTERNOS ---

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

    const variants = {
        primary: "bg-slate-900 text-white hover:bg-slate-900/90 shadow",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
        ghost: "hover:bg-slate-100 hover:text-slate-900",
        link: "text-slate-900 underline-offset-4 hover:underline"
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

const Badge = ({ children, color = "blue" }) => {
    const colors = {
        blue: "bg-blue-100 text-blue-700",
        green: "bg-emerald-100 text-emerald-700",
        amber: "bg-amber-100 text-amber-700",
        slate: "bg-slate-100 text-slate-700"
    };
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${colors[color]}`}>
            {children}
        </span>
    );
};

// --- SUB-COMPONENTES DE LA LANDING ---

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">Zerium</span>
                </div>

                <nav className="hidden items-center gap-8 md:flex">
                    {/* ENLACES DE ANCLAJE (SCROLL) */}
                    <a href="#features" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
                        Características
                    </a>
                    <a href="#pricing" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
                        Precios
                    </a>
                </nav>

                <div className="hidden items-center gap-3 md:flex">
                    <Link to="/login">
                        <Button variant="ghost">Iniciar Sesión</Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="primary">Comenzar Gratis</Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X className="w-6 h-6 text-slate-600" /> : <Menu className="w-6 h-6 text-slate-600" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4">
                    <Link to="/login" className="block w-full"><Button variant="outline" className="w-full">Iniciar Sesión</Button></Link>
                    <Link to="/register" className="block w-full"><Button variant="primary" className="w-full">Registrarse</Button></Link>
                </div>
            )}
        </header>
    );
}

function DashboardMockup() {
    const totalDebt = 5000;
    const paid = 3200;
    const percentPaid = (paid / totalDebt) * 100;

    return (
        <div className="relative mx-auto max-w-[500px] lg:max-w-none animate-in slide-in-from-right duration-1000">
            {/* Glow effect */}
            <div className="absolute -inset-4 rounded-3xl bg-blue-500/20 blur-3xl" />

            {/* Main glassmorphic card */}
            <div className="relative rounded-2xl border border-white/20 bg-white/70 p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Panel del Inquilino</p>
                        <h3 className="mt-1 text-lg font-bold text-slate-900">Maria García</h3>
                    </div>
                    <Badge color="green">
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Activo
                    </Badge>
                </div>

                <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900">Estado del Contrato</span>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Verificado
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">Apt 4B - Torre Central</p>
                            <p className="text-xs text-slate-500">Ene 2026 → Dic 2026</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900">Valor Global del Contrato</span>
                        <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                            <TrendingDown className="h-3.5 w-3.5" />
                            Deuda bajando
                        </div>
                    </div>

                    <div className="mb-3 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000"
                            style={{ width: `${percentPaid}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div>
                            <span className="font-bold text-emerald-600">${paid.toLocaleString()}</span>
                            <span className="text-slate-500"> pagado</span>
                        </div>
                        <div>
                            <span className="font-bold text-slate-900">${(totalDebt - paid).toLocaleString()}</span>
                            <span className="text-slate-500"> restante</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-slate-50 pb-20 pt-16 sm:pb-28 sm:pt-24">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <div className="max-w-xl animate-in fade-in slide-in-from-bottom-10 duration-700">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                            <ShieldCheck className="h-4 w-4" />
                            <span>Plataforma #1 en Gestión Segura</span>
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                            Gestión inmobiliaria, <br />
                            <span className="text-blue-600">finalmente organizada.</span>
                        </h1>

                        <p className="mt-6 text-lg leading-relaxed text-slate-600">
                            Reemplaza las hojas de cálculo y el caos de WhatsApp con un panel centralizado y seguro. Rastrea pagos, verifica inquilinos y gestiona contratos en un solo lugar.
                        </p>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                            <Link to="/register">
                                <Button className="w-full sm:w-auto h-12 px-8 text-base gap-2">
                                    Comenzar Prueba Gratis <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
                                    Ver Demo
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 text-sm text-slate-500 font-medium">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <span>Sin tarjeta de crédito</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <span>Prueba de 14 días</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative lg:pl-8">
                        <DashboardMockup />
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ icon: Icon, title, description, highlight, mockupType }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg">
            <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                    <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {highlight}
                </span>
            </div>

            <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-500">{description}</p>

            {/* Dynamic Mockup Area */}
            <div className="mt-auto">
                {mockupType === "progress" && (
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                        <div className="mb-2 flex justify-between text-xs">
                            <span className="text-slate-500">Valor Contrato</span>
                            <span className="font-bold text-emerald-600">64%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full w-[64%] rounded-full bg-emerald-500" />
                        </div>
                    </div>
                )}
                {mockupType === "badges" && (
                    <div className="flex flex-wrap gap-2">
                        <Badge color="green"><CheckCircle2 className="w-3 h-3 mr-1" /> Cédula OK</Badge>
                        <Badge color="amber">Récord Pendiente</Badge>
                    </div>
                )}
                {mockupType === "lifecycle" && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <span className="bg-slate-100 px-2 py-1 rounded">Borrador</span>
                        <span className="h-px w-2 bg-slate-300"></span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Firmado</span>
                        <span className="h-px w-2 bg-slate-300"></span>
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Activo</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function FeatureGrid() {
    const features = [
        {
            icon: BarChart3,
            title: "Rastreo Financiero Inteligente",
            description: "Rastrea el Valor Global del Contrato. Mira cómo la deuda total baja con cada pago parcial.",
            highlight: "Control de Deuda",
            mockupType: "progress"
        },
        {
            icon: ShieldCheck,
            title: "Verificación y Confianza (KYC)",
            description: "Los inquilinos suben ID y antecedentes. Los dueños verifican antes de firmar. Cero riesgo.",
            highlight: "Seguridad Primero",
            mockupType: "badges"
        },
        {
            icon: FileText,
            title: "Ciclo de Vida Completo",
            description: "Maneja todo: Borrador → Firmado → Activo (Ocupado) → Terminado (Vacante).",
            highlight: "Gestión Total",
            mockupType: "lifecycle"
        },
        {
            icon: Users,
            title: "Portales Separados",
            description: "Dashboards específicos para dueños e inquilinos. Cada quien ve solo lo que necesita.",
            highlight: "Roles Claros",
        },
        {
            icon: Bell,
            title: "Notificaciones Inteligentes",
            description: "Recordatorios automáticos de pagos y renovaciones de contrato.",
            highlight: "Alertas",
        },
        {
            icon: Lock,
            title: "Seguridad Bancaria",
            description: "Encriptación de datos y documentos. Tu información está segura.",
            highlight: "Encriptado",
        }
    ];

    return (
        <section id="features" className="bg-white py-20 sm:py-28">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Todo lo que necesitas para gestionar
                    </h2>
                    <p className="mt-4 text-lg text-slate-500">
                        Un kit de herramientas completo diseñado para propietarios modernos.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- NUEVA SECCIÓN DE PRECIOS ---
function PricingSection() {
    const plans = [
        {
            name: "Inicial",
            price: "Gratis",
            description: "Perfecto para propietarios con 1-2 unidades.",
            features: ["Hasta 2 unidades", "Contratos Ilimitados", "Verificación de Inquilinos", "Soporte por email"],
            buttonText: "Comenzar Gratis",
            popular: false
        },
        {
            name: "Pro",
            price: "$15",
            period: "/mes",
            description: "Para propietarios en crecimiento que necesitan más control.",
            features: ["Hasta 10 unidades", "Reportes Financieros", "Alertas de WhatsApp", "Soporte Prioritario", "Gestión de Tickets"],
            buttonText: "Prueba Gratis 14 días",
            popular: true
        },
        {
            name: "Empresarial",
            price: "Personalizado",
            description: "Gestión masiva para inmobiliarias y edificios.",
            features: ["Unidades Ilimitadas", "API Access", "Manager Dedicado", "Contratos Personalizados", "Migración de Datos"],
            buttonText: "Contactar Ventas",
            popular: false
        }
    ];

    return (
        <section id="pricing" className="bg-slate-50 py-20 border-t border-slate-200">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Planes simples y transparentes</h2>
                    <p className="mt-4 text-lg text-slate-500">Empieza gratis y crece a tu ritmo.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {plans.map((plan, index) => (
                        <div key={index} className={`relative flex flex-col rounded-2xl bg-white p-8 shadow-sm border ${plan.popular ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-slate-200'}`}>
                            {plan.popular && (
                                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Más Popular
                                </div>
                            )}
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                                <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
                            </div>
                            <div className="mb-6 flex items-baseline">
                                <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                                {plan.period && <span className="text-slate-500 ml-1">{plan.period}</span>}
                            </div>
                            <ul className="mb-8 space-y-4 flex-1">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                        <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register" className="mt-auto">
                                <Button variant={plan.popular ? 'primary' : 'outline'} className="w-full">
                                    {plan.buttonText}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTASection() {
    return (
        <section className="py-20 bg-white border-t border-slate-200">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 text-center sm:px-16">
                    <div className="relative mx-auto max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            ¿Listo para modernizar tu gestión?
                        </h2>
                        <p className="mt-4 text-lg text-slate-300">
                            Únete a los propietarios que han simplificado su vida con Zerium.
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                            <Link to="/register">
                                <Button variant="secondary" className="h-12 px-8 text-base w-full sm:w-auto">
                                    Crear Cuenta Gratis
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-slate-50 py-12">
            <div className="mx-auto max-w-6xl px-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <span className="text-lg font-bold text-slate-900">Zerium</span>
                </div>
                <p className="text-sm text-slate-500">© 2026 Zerium Platform. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

// --- COMPONENTE PRINCIPAL EXPORTADO ---

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Header />
            <main>
                <HeroSection />
                <FeatureGrid />
                <PricingSection /> {/* <--- SECCIÓN NUEVA AGREGADA */}
                <CTASection />
            </main>
            <Footer />
        </div>
    );
}