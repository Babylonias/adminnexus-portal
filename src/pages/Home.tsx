import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
    {
        icon: "map",
        title: "Localisation rapide",
        description: "Trouvez instantanément l'amphithéâtre que vous cherchez avec notre interface intuitive."
    },
    {
        icon: "smartphone",
        title: "Interface intuitive",
        description: "Une application simple à utiliser, conçue spécialement pour les étudiants."
    },
    {
        icon: "bell",
        title: "Notifications campus",
        description: "Restez informé des changements de salles ou des annonces importantes."
    },
    {
        icon: "globe",
        title: "Multi-universités",
        description: "Accédez aux plans de plusieurs universités depuis une seule application."
    }
];

export function Home() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="fixed w-full bg-white shadow-md z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-8 w-8">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                                <span className="ml-2 text-xl font-bold text-gray-800">Campus WA</span>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-primary bg-primary/10">Accueil</Link>
                                <Link to="/classrooms" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-primary transition">Amphithéâtres</Link>
                                <Link to="/universities" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-primary transition">Universités</Link>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <Link to="/dashboard">
                                <Button>Tableau de bord</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center bg-cover bg-center pt-16" style={{ backgroundImage: 'url(/assets/images/groupetu.jpg)' }}>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Bienvenue sur Campus WA</h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-8">Localisez facilement les amphithéâtres dans les universités</p>
                    <Link to="/dashboard">
                        <Button className="px-8 py-6 text-lg bg-white text-primary hover:bg-gray-100" size="lg">
                            Commencer
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos fonctionnalités</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">Découvrez comment Campus WA simplifie votre vie universitaire</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <CardHeader>
                                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-6 w-6">
                                            {feature.icon === 'map' && <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />}
                                            {feature.icon === 'smartphone' && (
                                                <>
                                                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                                    <line x1="12" y1="18" x2="12.01" y2="18" />
                                                </>
                                            )}
                                            {feature.icon === 'bell' && (
                                                <>
                                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                                </>
                                            )}
                                            {feature.icon === 'globe' && (
                                                <>
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="2" y1="12" x2="22" y2="12" />
                                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                                </>
                                            )}
                                        </svg>
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary to-blue-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Prêt à simplifier votre vie universitaire ?</h2>
                    <p className="text-xl text-blue-100 mb-8">Rejoignez des milliers d'étudiants qui utilisent déjà Campus WA</p>
                    <Link to="/dashboard">
                        <Button className="px-8 py-6 text-lg bg-white text-primary hover:bg-gray-100" size="lg">
                            Accéder au tableau de bord
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-8 w-8">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                                <span className="ml-2 text-xl font-bold">Campus WA</span>
                            </div>
                            <p className="mt-4 text-gray-400">L'application qui simplifie votre navigation dans les campus universitaires.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
                            <ul className="space-y-2">
                                <li><Link to="/" className="text-gray-400 hover:text-white transition">Accueil</Link></li>
                                <li><Link to="/classrooms" className="text-gray-400 hover:text-white transition">Amphithéâtres</Link></li>
                                <li><Link to="/universities" className="text-gray-400 hover:text-white transition">Universités</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
                            <div className="flex space-x-4">
                                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                                    <a
                                        key={social}
                                        href="#"
                                        className="text-gray-400 hover:text-white transition"
                                        aria-label={social.charAt(0).toUpperCase() + social.slice(1)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-6 w-6"
                                        >
                                            {social === 'facebook' && (
                                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                            )}
                                            {social === 'twitter' && (
                                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                                            )}
                                            {social === 'instagram' && (
                                                <>
                                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                                </>
                                            )}
                                            {social === 'linkedin' && (
                                                <>
                                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                                    <rect x="2" y="9" width="4" height="12" />
                                                    <circle cx="4" cy="4" r="2" />
                                                </>
                                            )}
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
                        <p>&copy; {new Date().getFullYear()} Campus WA. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}