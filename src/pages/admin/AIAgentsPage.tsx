import { useState, useRef, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Bot, Brain, ShoppingCart, Search, Truck, CreditCard, Send, Loader2, Settings2,
  Sparkles, TrendingUp, MessageSquare, Eye, Shield, Package, BarChart3, FileText,
  AlertTriangle, Repeat, Globe, Calculator, Users, Star, Zap, Megaphone, Mail,
  Target, PenTool, Share2, MousePointer, MapPin, Smartphone, Image, Calendar,
} from "lucide-react";

interface Agent {
  id: string; name: string; description: string; category: string;
  icon: React.ElementType; systemPrompt: string; model: string; enabled: boolean;
}

const defaultAgents: Agent[] = [
  // ── IA & ML ──
  { id: "agent-gen", name: "Générateur d'Agents", description: "Crée de nouveaux agents IA à partir de templates, teste et valide.", category: "ia", icon: Sparkles, systemPrompt: "Tu es un agent qui génère des configurations pour de nouveaux agents IA. Tu crées des scripts, testes et valides les agents. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "optim-model", name: "Optimisation Modèles", description: "Ajuste hyperparamètres, réduit latence, gère le versioning.", category: "ia", icon: Settings2, systemPrompt: "Tu es un agent d'optimisation de modèles ML. Tu ajustes les hyperparamètres, réduis la latence d'inférence et gères le versioning. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "pred-sales", name: "Prédiction Ventes", description: "Anticipe volumes de vente avec séries temporelles et saisonnalité.", category: "ia", icon: TrendingUp, systemPrompt: "Tu es un agent de prédiction des ventes e-commerce. Tu utilises des séries temporelles, intègres la saisonnalité et fournis des intervalles de confiance. Quand on te donne des données réelles, analyse-les et produis des prévisions chiffrées. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "reco-prod", name: "Recommandation Produits", description: "Suggestions personnalisées basées sur l'historique d'achat.", category: "ia", icon: Star, systemPrompt: "Tu es un agent de recommandation produits. Analyse l'historique d'achat et de navigation pour générer des recommandations. Quand on te fournit des données client réelles, propose des produits concrets. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "nlp", name: "Traitement Langage", description: "Analyse avis clients, extrait sentiments et sujets récurrents.", category: "ia", icon: MessageSquare, systemPrompt: "Tu es un agent NLP spécialisé e-commerce BULONET. Tu analyses les avis, extrais les sentiments (positif/négatif/neutre), identifies les sujets récurrents et génères des résumés. Traite les données réelles qu'on te fournit. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "vision", name: "Vision Ordinateur", description: "Analyse images produits, détecte défauts et classe photos.", category: "ia", icon: Eye, systemPrompt: "Tu es un agent de vision par ordinateur. Tu analyses les images de produits, détectes les objets et défauts visuels, classes les photos et génères des descriptions. Réponds en français.", model: "google/gemini-2.5-pro", enabled: true },
  { id: "content-gen", name: "Génération Contenu", description: "Rédige descriptions produits SEO, articles de blog.", category: "ia", icon: FileText, systemPrompt: "Tu es un agent de génération de contenu e-commerce BULONET. Tu rédiges des descriptions produits optimisées SEO, articles de blog et contenu marketing. Adapte le ton à la marque. Quand on te fournit les détails d'un produit réel, génère du contenu prêt à publier. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "chatbot", name: "Chatbot Multilingue", description: "Répond aux clients en FR, EN, AR, PT, ZH, SW.", category: "ia", icon: MessageSquare, systemPrompt: "Tu es un chatbot multilingue pour BULONET. Tu réponds aux questions des clients de manière professionnelle. Tu peux répondre en français, anglais, arabe, portugais, chinois et swahili. Détecte la langue du message et réponds dans cette langue.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "anomaly", name: "Détection Anomalies", description: "Repère comportements inhabituels dans transactions et logs.", category: "ia", icon: AlertTriangle, systemPrompt: "Tu es un agent de détection d'anomalies. Tu analyses les données de transactions et logs pour repérer les comportements inhabituels. Quand on te fournit des données réelles, identifie les patterns suspects et alerte. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "rpa", name: "Automatisation Processus", description: "Identifie tâches automatisables, crée workflows RPA.", category: "ia", icon: Repeat, systemPrompt: "Tu es un agent d'automatisation des processus. Tu identifies les tâches répétitives automatisables, crées des workflows RPA et surveilles leur exécution. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "sentiment", name: "Analyse Sentiments", description: "Détecte émotions (colère, satisfaction) dans les avis.", category: "ia", icon: Brain, systemPrompt: "Tu es un agent d'analyse des sentiments. Tu détectes les émotions (colère, satisfaction, déception) dans les textes. Quand on te donne des avis réels, analyse-les et génère des alertes pour les négatifs. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "classif", name: "Classification Auto", description: "Classe produits dans les bonnes catégories automatiquement.", category: "ia", icon: Package, systemPrompt: "Tu es un agent de classification automatique de produits. Analyse les descriptions et images pour suggérer les catégories pertinentes. Quand on te donne un produit réel, propose une classification. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },

  // ── Marketplace & Vendeurs ──
  { id: "onboard-seller", name: "Onboarding Vendeurs", description: "Accompagne inscription, vérifie documents, guide création boutique.", category: "marketplace", icon: Users, systemPrompt: "Tu es un agent d'onboarding vendeurs BULONET. Tu accompagnes les nouveaux vendeurs, vérifies les documents, guides la création de boutique et envoies des rappels. Avec des données réelles, génère les étapes concrètes. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "score-seller", name: "Scoring Vendeurs", description: "Évalue fiabilité et performance des vendeurs.", category: "marketplace", icon: BarChart3, systemPrompt: "Tu es un agent de scoring vendeurs. Tu analyses délais de livraison, qualité des produits, calcules un score de confiance. Avec des données réelles, produis un scoring chiffré. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "valid-prod", name: "Validation Produits", description: "Vérifie conformité des annonces, détecte produits interdits.", category: "marketplace", icon: Shield, systemPrompt: "Tu es un agent de validation de produits BULONET. Tu contrôles images, descriptions, prix. Tu détectes les produits interdits ou suspects. Avec des données réelles, approuve ou rejette. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "improve-listing", name: "Amélioration Fiches", description: "Optimise titres, descriptions et mots-clés SEO.", category: "marketplace", icon: FileText, systemPrompt: "Tu es un agent d'amélioration des fiches produits BULONET. Tu optimises les titres, descriptions et mots-clés SEO, corriges les fautes et enrichis avec les attributs manquants. Avec un produit réel, génère la fiche améliorée. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "auto-categ", name: "Catégorisation Auto", description: "Place produits dans la bonne catégorie principale et secondaire.", category: "marketplace", icon: Package, systemPrompt: "Tu es un agent de catégorisation automatique. Tu utilises titre et description pour proposer catégorie principale et secondaire. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "data-clean", name: "Nettoyage Données", description: "Élimine doublons, uniformise formats catalogue.", category: "marketplace", icon: Repeat, systemPrompt: "Tu es un agent de nettoyage de données catalogue BULONET. Tu identifies les doublons, uniformises les formats et supprimes les annonces obsolètes. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "review-mgmt", name: "Gestion Avis", description: "Modère avis, filtre spam, met en avant les avis utiles.", category: "marketplace", icon: MessageSquare, systemPrompt: "Tu es un agent de gestion des avis. Tu filtres le spam et les injures, mets en avant les avis utiles et réponds automatiquement aux avis simples. Avec des avis réels, analyse et modère. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "counterfeit", name: "Détection Contrefaçons", description: "Identifie produits suspects, compare avec bases de marques.", category: "marketplace", icon: Shield, systemPrompt: "Tu es un agent de détection de contrefaçons. Tu compares avec des bases de données de marques, analyses les images pour détecter des logos copiés. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "commission", name: "Optimisation Commissions", description: "Simule barèmes, maximise revenus vs concurrence.", category: "marketplace", icon: Calculator, systemPrompt: "Tu es un agent d'optimisation des commissions. Tu simules différents barèmes et suggères des ajustements pour maximiser les revenus. Avec des données réelles, produis des simulations chiffrées. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "promo-mgmt", name: "Gestion Promotions", description: "Crée campagnes promo, calcule réductions optimales.", category: "marketplace", icon: Zap, systemPrompt: "Tu es un agent de gestion des promotions BULONET. Tu sélectionnes les produits éligibles, calcules les réductions optimales et suis les performances. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "seller-claims", name: "Réclamations Vendeurs", description: "Traite litiges vendeurs-plateforme, propose solutions.", category: "marketplace", icon: AlertTriangle, systemPrompt: "Tu es un agent de gestion des réclamations vendeurs. Tu analyses les demandes, proposes des solutions standardisées et escalades si nécessaire. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "seller-satisfaction", name: "Satisfaction Vendeurs", description: "Mesure bien-être vendeurs, analyse rétention.", category: "marketplace", icon: Star, systemPrompt: "Tu es un agent d'analyse de la satisfaction vendeurs. Tu envoies des enquêtes automatiques, analyses les taux de rétention et proposes des améliorations. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },

  // ── Sourcing & Approvisionnement ──
  { id: "scrape-aliex", name: "Scraping AliExpress/Amazon", description: "Extrait données produits, prix, images des fournisseurs.", category: "sourcing", icon: Globe, systemPrompt: "Tu es un agent de scraping e-commerce BULONET. Tu aides à extraire et analyser les données produits d'AliExpress et Amazon : prix, descriptions, images. Quand on te fournit une URL ou des données produit réelles, analyse-les et structure les informations pour import. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "trends", name: "Détection Tendances", description: "Identifie produits émergents via recherches et réseaux sociaux.", category: "sourcing", icon: TrendingUp, systemPrompt: "Tu es un agent de détection de tendances e-commerce. Tu analyses les requêtes de recherche et les réseaux sociaux pour identifier les produits émergents. Avec des données réelles, prédis les futures tendances et génère des rapports. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "compare-suppliers", name: "Comparateur Fournisseurs", description: "Compare offres : prix, délais, fiabilité, coût total.", category: "sourcing", icon: BarChart3, systemPrompt: "Tu es un agent comparateur de fournisseurs. Tu évalues les prix, délais, fiabilité et calcules le coût total (livraison, taxes). Avec des données réelles de fournisseurs, recommande le meilleur. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "auto-negoc", name: "Négociation Automatisée", description: "Rédige devis, analyse réponses, propose contre-offres.", category: "sourcing", icon: MessageSquare, systemPrompt: "Tu es un agent de négociation automatisée. Tu rédiges des demandes de devis, analyses les réponses et proposes des contre-offres. Avec des données réelles, génère les messages de négociation. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "supplier-orders", name: "Commandes Fournisseurs", description: "Génère bons de commande, vérifie délais, relance.", category: "sourcing", icon: ShoppingCart, systemPrompt: "Tu es un agent de gestion des commandes fournisseurs. Tu génères des bons de commande, vérifies les délais et relances en cas de retard. Avec des données réelles, produis les documents. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "import-costs", name: "Coûts Import", description: "Calcule droits douane, taxes via codes HS par pays.", category: "sourcing", icon: Calculator, systemPrompt: "Tu es un agent d'analyse des coûts d'import. Tu utilises les codes HS pour calculer droits de douane et taxes. Tu intègres les frais de transport. Avec des données réelles (produit, pays), calcule le coût total. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "supplier-stock", name: "Rupture Fournisseur", description: "Surveille stocks fournisseurs, alerte et suggère alternatives.", category: "sourcing", icon: AlertTriangle, systemPrompt: "Tu es un agent de détection de rupture fournisseur. Tu surveilles les stocks, alertes en cas de rupture et suggères des alternatives. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "supplier-quality", name: "Qualité Fournisseur", description: "Score qualité basé sur retours clients et fournisseurs.", category: "sourcing", icon: Star, systemPrompt: "Tu es un agent d'évaluation qualité fournisseur. Tu croises les avis clients avec les fournisseurs, calcules un score qualité. Avec des données réelles, produis l'évaluation. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "lot-optim", name: "Optimisation Lots", description: "Quantités d'achat optimales selon prévisions et stockage.", category: "sourcing", icon: Package, systemPrompt: "Tu es un agent d'optimisation des lots d'achat. Tu utilises la prévision des ventes pour minimiser les coûts de stockage. Avec des données réelles, suggère les quantités optimales. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },

  // ── Logistique & Livraison ──
  { id: "route-optim", name: "Optimisation Itinéraires", description: "Calcule trajets efficaces selon trafic et météo.", category: "logistique", icon: Truck, systemPrompt: "Tu es un agent d'optimisation des itinéraires de livraison. Tu prends en compte le trafic, la météo pour réduire les coûts. Avec des adresses réelles, calcule les trajets optimaux. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "parcel-track", name: "Suivi Colis", description: "Informe clients, envoie notifications, gère retards.", category: "logistique", icon: Package, systemPrompt: "Tu es un agent de suivi des colis BULONET. Tu récupères les statuts des transporteurs, envoies des notifications et gères les exceptions. Avec des numéros de suivi réels, fournis le statut. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "stock-mgmt", name: "Gestion Stocks", description: "Optimise niveaux, propose réapprovisionnements.", category: "logistique", icon: Package, systemPrompt: "Tu es un agent de gestion des stocks BULONET. Tu proposes des réapprovisionnements, évites surstocks et ruptures. Avec des données de stock réelles, analyse et recommande. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "stock-predict", name: "Prévision Ruptures", description: "Anticipe ruptures, alerte et suggère commandes urgentes.", category: "logistique", icon: AlertTriangle, systemPrompt: "Tu es un agent de prévision des ruptures de stock. Tu analyses ventes et délais fournisseurs pour alerter avant la rupture. Avec des données réelles, produis des alertes. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "returns", name: "Gestion Retours", description: "Automatise retours, étiquettes, suivi et remboursements.", category: "logistique", icon: Repeat, systemPrompt: "Tu es un agent de gestion des retours. Tu génères des étiquettes de retour, suis les colis retournés et déclenches les remboursements. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "carrier-choice", name: "Choix Transporteur", description: "Sélectionne le meilleur transporteur par commande.", category: "logistique", icon: Truck, systemPrompt: "Tu es un agent de choix du transporteur. Tu compares tarifs et délais en intégrant les contraintes (fragilité, destination). Avec une commande réelle, recommande le transporteur. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "shipping-calc", name: "Frais de Port", description: "Calcule frais selon poids, destination, transporteur.", category: "logistique", icon: Calculator, systemPrompt: "Tu es un agent de calcul des frais de port. Tu calcules dynamiquement selon le poids, la destination et le transporteur. Avec des données réelles, produis un devis. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "warehouse", name: "Planification Entrepôts", description: "Organise stockage, optimise allées et emplacements.", category: "logistique", icon: MapPin, systemPrompt: "Tu es un agent de planification des entrepôts. Tu suggères l'emplacement des produits (fast-movers), optimises les allées. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "intl-orders", name: "Commandes Internationales", description: "Gère formalités douanières et documents.", category: "logistique", icon: Globe, systemPrompt: "Tu es un agent de gestion des commandes internationales. Tu remplis les documents douaniers, calcules les droits et suis les colis. Avec des données réelles, génère les documents. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "lost-parcels", name: "Colis Perdus", description: "Identifie colis en souffrance, déclenche enquête.", category: "logistique", icon: Search, systemPrompt: "Tu es un agent de détection des colis perdus. Tu analyses les données de tracking, alertes les équipes et déclenches une enquête. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "carrier-perf", name: "Performance Transporteurs", description: "Note transporteurs sur délais, casse, satisfaction.", category: "logistique", icon: BarChart3, systemPrompt: "Tu es un agent d'évaluation des performances des transporteurs. Tu mesures délais, casse et satisfaction. Avec des données réelles, produis un classement. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },

  // ── Paiement & Fraude ──
  { id: "pay-valid", name: "Validation Paiements", description: "Vérifie légitimité, détecte anomalies par pays/montant.", category: "paiement", icon: CreditCard, systemPrompt: "Tu es un agent de validation des paiements BULONET. Tu contrôles les coordonnées bancaires, détectes les anomalies (pays à risque, montant). Avec une transaction réelle, approuve ou bloque. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "mobile-money", name: "Mobile Money", description: "Gère M-Pesa, Orange Money, confirme transactions.", category: "paiement", icon: Smartphone, systemPrompt: "Tu es un agent d'intégration Mobile Money BULONET. Tu gères les paiements via M-Pesa, Orange Money etc. Tu confirmes les transactions et gères les échecs. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "fraud-detect", name: "Détection Fraude", description: "Analyse patterns frauduleux par ML, bloque suspects.", category: "paiement", icon: Shield, systemPrompt: "Tu es un agent de détection de fraude BULONET. Tu analyses les transactions pour détecter des patterns frauduleux. Avec des données réelles, identifie et bloque les suspects. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "tx-block", name: "Blocage Transactions", description: "Interrompt paiements frauduleux en temps réel.", category: "paiement", icon: Shield, systemPrompt: "Tu es un agent de blocage de transactions frauduleuses. Tu appliques des règles métier, notifies l'équipe sécurité et tiens un registre. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "refund-mgmt", name: "Remboursements", description: "Automatise remboursements après retour ou litige.", category: "paiement", icon: Repeat, systemPrompt: "Tu es un agent de gestion des remboursements. Tu vérifies l'éligibilité, inities le virement et notifies le client. Avec une demande réelle, traite le remboursement. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "pci-compliance", name: "Conformité PCI-DSS", description: "Audite flux de données, détecte failles.", category: "paiement", icon: Shield, systemPrompt: "Tu es un agent de conformité PCI-DSS. Tu audites les flux de données, détectes les failles et proposes des correctifs. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "currency-mgmt", name: "Gestion Devises", description: "Convertit montants temps réel, frais de conversion.", category: "paiement", icon: Globe, systemPrompt: "Tu es un agent de gestion des devises BULONET. Tu convertis les montants en temps réel, appliques les frais de conversion. Avec des montants réels, effectue les conversions. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "id-fraud", name: "Fraude Identité", description: "Vérifie identité utilisateurs, analyse documents.", category: "paiement", icon: Users, systemPrompt: "Tu es un agent de détection de fraude à l'identité. Tu analyses les documents d'identité et signales les faux. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "chargeback", name: "Litiges Paiement", description: "Traite chargebacks, recueille preuves.", category: "paiement", icon: AlertTriangle, systemPrompt: "Tu es un agent de gestion des litiges paiement. Tu recueilles les preuves, réponds aux banques. Avec un cas réel, génère la réponse. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "pay-conversion", name: "Conversion Paiement", description: "Optimise taux conversion, A/B teste interfaces.", category: "paiement", icon: BarChart3, systemPrompt: "Tu es un agent d'optimisation du taux de conversion paiement. Tu A/B testes les interfaces et analyses les abandons. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },

  // ── Marketing & SEO ──
  { id: "seo-auto", name: "SEO Automatique", description: "Optimise contenu, mots-clés, balises meta, positionnement.", category: "marketing", icon: Search, systemPrompt: "Tu es un agent SEO automatique BULONET. Tu suggères des mots-clés, analyses les balises meta et génères des rapports de positionnement. Avec un contenu réel, optimise-le pour le SEO. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "ads-auto", name: "Publicité Automatisée", description: "Gère Google Ads et Facebook Ads, ajuste enchères, ROI.", category: "marketing", icon: Megaphone, systemPrompt: "Tu es un agent de publicité automatisée. Tu crées des annonces, ajustes les enchères et analyses le ROI. Avec des données de campagne réelles, optimise-les. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "prod-desc", name: "Descriptions Produits", description: "Génère descriptions attractives et SEO, teste plusieurs versions.", category: "marketing", icon: PenTool, systemPrompt: "Tu es un agent de rédaction de descriptions produits. Tu utilises les caractéristiques produit pour générer des descriptions attractives et SEO. Avec un produit réel, génère 3 versions. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "landing-pages", name: "Pages de Vente", description: "Conçoit pages de destination optimisées, CTA et A/B tests.", category: "marketing", icon: MousePointer, systemPrompt: "Tu es un agent de création de pages de vente. Tu rédiges du contenu persuasif, suggères des éléments visuels et testes A/B les CTA. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "social-publish", name: "Publication Réseaux", description: "Planifie et publie sur les réseaux sociaux avec hashtags.", category: "marketing", icon: Share2, systemPrompt: "Tu es un agent de publication sur les réseaux sociaux BULONET. Tu rédiges des posts, ajoutes des hashtags et programmes selon le calendrier. Avec un produit réel, génère les posts. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "engagement", name: "Analyse Engagement", description: "Mesure interactions, identifie meilleurs contenus.", category: "marketing", icon: BarChart3, systemPrompt: "Tu es un agent d'analyse d'engagement. Tu calcules le taux d'engagement, identifies les meilleurs contenus et suggères des améliorations. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "email-mktg", name: "Email Marketing", description: "Segmente listes, rédige newsletters, suit taux d'ouverture.", category: "marketing", icon: Mail, systemPrompt: "Tu es un agent d'email marketing BULONET. Tu segmentes les listes, rédiges les newsletters et suis les taux d'ouverture et de clic. Avec des données réelles, génère la campagne. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "influencer", name: "Marketing d'Influence", description: "Identifie et contacte influenceurs, suit campagnes.", category: "marketing", icon: Users, systemPrompt: "Tu es un agent de marketing d'influence. Tu recherches des profils pertinents, envoies des propositions et suis les campagnes. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "traffic-analysis", name: "Analyse du Trafic", description: "Analyse sources de trafic et comportement visiteurs.", category: "marketing", icon: TrendingUp, systemPrompt: "Tu es un agent d'analyse du trafic. Tu identifies les canaux les plus performants et proposes des optimisations. Avec des données Analytics réelles, analyse-les. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "banners", name: "Bannières Publicitaires", description: "Crée et teste bannières, mesure CTR.", category: "marketing", icon: Image, systemPrompt: "Tu es un agent de gestion des bannières publicitaires. Tu génères des designs, testes tailles et couleurs, mesures le CTR. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "content-mktg", name: "Marketing de Contenu", description: "Calendrier éditorial, articles, optimise partage.", category: "marketing", icon: Calendar, systemPrompt: "Tu es un agent de marketing de contenu BULONET. Tu proposes des sujets d'articles, rédiges des brouillons et optimises pour le partage. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "local-seo", name: "Référencement Local", description: "Optimise recherches locales, Google My Business.", category: "marketing", icon: MapPin, systemPrompt: "Tu es un agent de référencement local. Tu gères les fiches Google My Business, suggères des mots-clés locaux et surveilles les avis. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "sms-campaign", name: "Campagnes SMS", description: "SMS promotionnels segmentés, suit conversions.", category: "marketing", icon: Smartphone, systemPrompt: "Tu es un agent de campagnes SMS BULONET. Tu segmentes la base, rédiges des messages courts et suis les conversions. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
  { id: "retargeting", name: "Retargeting", description: "Reciblage visiteurs non convertis, annonces personnalisées.", category: "marketing", icon: Target, systemPrompt: "Tu es un agent de retargeting. Tu identifies les visiteurs non convertis, crées des annonces personnalisées et optimises les budgets. Réponds en français.", model: "google/gemini-3-flash-preview", enabled: true },
];

const categories = [
  { key: "ia", label: "🧠 IA & ML" },
  { key: "marketplace", label: "🛒 Marketplace" },
  { key: "sourcing", label: "🔍 Sourcing" },
  { key: "logistique", label: "📦 Logistique" },
  { key: "paiement", label: "💳 Paiement" },
  { key: "marketing", label: "📣 Marketing" },
];

const models = [
  "google/gemini-3-flash-preview",
  "google/gemini-2.5-flash",
  "google/gemini-2.5-pro",
  "google/gemini-3.1-pro-preview",
  "openai/gpt-5-mini",
  "openai/gpt-5",
  "openai/gpt-5.2",
];

const AIAgentsPage = () => {
  const [agents, setAgents] = useState<Agent[]>(defaultAgents);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [chatAgent, setChatAgent] = useState<Agent | null>(null);
  const [configAgent, setConfigAgent] = useState<Agent | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  const filtered = agents.filter((a) => {
    const ms = a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
    return ms && (activeCategory === "all" || a.category === activeCategory);
  });

  const toggleAgent = (id: string) => {
    setAgents((p) => p.map((a) => a.id === id ? { ...a, enabled: !a.enabled } : a));
    const ag = agents.find((a) => a.id === id);
    toast.success(ag?.enabled ? `${ag.name} désactivé` : `${ag?.name} activé`);
  };

  const updateAgentConfig = (id: string, updates: Partial<Agent>) => {
    setAgents((p) => p.map((a) => a.id === id ? { ...a, ...updates } : a));
    toast.success("Configuration mise à jour");
    setConfigAgent(null);
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || !chatAgent || isStreaming) return;
    const userMsg = { role: "user", content: chatInput };
    const msgs = [...chatMessages, userMsg];
    setChatMessages(msgs);
    setChatInput("");
    setIsStreaming(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ agentId: chatAgent.id, message: chatInput, systemPrompt: chatAgent.systemPrompt, model: chatAgent.model }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erreur" }));
        if (resp.status === 429) toast.error("Limite de requêtes atteinte, réessayez plus tard.");
        else if (resp.status === 402) toast.error("Crédits insuffisants. Rechargez votre espace.");
        else toast.error(err.error || "Erreur IA");
        setIsStreaming(false);
        return;
      }
      const reader = resp.body?.getReader();
      if (!reader) { setIsStreaming(false); return; }
      const decoder = new TextDecoder();
      let buffer = "", assistantContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const p = JSON.parse(json);
            const d = p.choices?.[0]?.delta?.content;
            if (d) {
              assistantContent += d;
              setChatMessages([...msgs, { role: "assistant", content: assistantContent }]);
            }
          } catch { /* partial JSON */ }
        }
      }
      if (!assistantContent) setChatMessages([...msgs, { role: "assistant", content: "(Pas de réponse)" }]);
    } catch {
      toast.error("Erreur connexion IA");
    } finally {
      setIsStreaming(false);
    }
  };

  const openChat = (agent: Agent) => { setChatAgent(agent); setChatMessages([]); setChatInput(""); };
  const enabledCount = agents.filter((a) => a.enabled).length;

  return (
    <AdminLayout title="Agents IA">
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-card p-4 border border-border"><p className="text-2xl font-bold text-foreground">{agents.length}</p><p className="text-xs text-muted-foreground">Total agents</p></div>
          <div className="rounded-xl bg-card p-4 border border-border"><p className="text-2xl font-bold text-emerald-500">{enabledCount}</p><p className="text-xs text-muted-foreground">Actifs</p></div>
          <div className="rounded-xl bg-card p-4 border border-border"><p className="text-2xl font-bold text-muted-foreground">{agents.length - enabledCount}</p><p className="text-xs text-muted-foreground">Inactifs</p></div>
          <div className="rounded-xl bg-card p-4 border border-border"><p className="text-2xl font-bold text-primary">{categories.length}</p><p className="text-xs text-muted-foreground">Catégories</p></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input placeholder="Rechercher un agent..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-sm" />
          <div className="flex flex-wrap gap-1.5">
            <Button size="sm" variant={activeCategory === "all" ? "default" : "outline"} onClick={() => setActiveCategory("all")}>Tous ({agents.length})</Button>
            {categories.map((c) => (
              <Button key={c.key} size="sm" variant={activeCategory === c.key ? "default" : "outline"} onClick={() => setActiveCategory(c.key)}>
                {c.label} ({agents.filter((a) => a.category === c.key).length})
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((agent) => (
            <div key={agent.id} className="rounded-xl bg-card p-4 border border-border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${agent.enabled ? "bg-primary/10" : "bg-muted"}`}>
                    <agent.icon className={`h-4 w-4 ${agent.enabled ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground leading-tight">{agent.name}</p>
                    <Badge variant="outline" className="text-[9px] mt-0.5">{categories.find((c) => c.key === agent.category)?.label}</Badge>
                  </div>
                </div>
                <Switch checked={agent.enabled} onCheckedChange={() => toggleAgent(agent.id)} />
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{agent.description}</p>
              <div className="flex gap-1.5">
                <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => openChat(agent)} disabled={!agent.enabled}>
                  <Bot className="h-3 w-3 mr-1" /> Tester
                </Button>
                <Button size="sm" variant="ghost" className="text-xs" onClick={() => setConfigAgent(agent)}>
                  <Settings2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">Aucun agent trouvé.</p>}
      </div>

      {/* Chat Dialog */}
      <Dialog open={!!chatAgent} onOpenChange={() => setChatAgent(null)}>
        <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-3 border-b border-border shrink-0">
            <DialogTitle className="flex items-center gap-2">
              {chatAgent && <chatAgent.icon className="h-5 w-5 text-primary" />}
              {chatAgent?.name}
              <Badge variant="outline" className="text-[9px] ml-2">{chatAgent?.model}</Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {chatMessages.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Bot className="mx-auto h-10 w-10 mb-3 text-muted-foreground/40" />
                <p className="text-sm">Envoyez un message pour tester cet agent.</p>
                <p className="text-xs mt-1 text-muted-foreground/60">💡 Vous pouvez lui fournir des données réelles pour qu'il agisse concrètement.</p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isStreaming && chatMessages[chatMessages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start"><div className="bg-secondary rounded-xl px-4 py-2.5"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div></div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="px-6 pb-6 pt-3 border-t border-border shrink-0">
            <div className="flex gap-2">
              <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Votre message ou données réelles..." onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()} disabled={isStreaming} />
              <Button onClick={sendMessage} disabled={isStreaming || !chatInput.trim()} size="icon">
                {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Config Dialog */}
      <Dialog open={!!configAgent} onOpenChange={() => setConfigAgent(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5 text-primary" /> {configAgent?.name}</DialogTitle></DialogHeader>
          {configAgent && <ConfigForm agent={configAgent} onSave={(u) => updateAgentConfig(configAgent.id, u)} />}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

const ConfigForm = ({ agent, onSave }: { agent: Agent; onSave: (u: Partial<Agent>) => void }) => {
  const [sp, setSp] = useState(agent.systemPrompt);
  const [model, setModel] = useState(agent.model);
  const [name, setName] = useState(agent.name);
  const [desc, setDesc] = useState(agent.description);
  return (
    <div className="space-y-4">
      <div className="space-y-2"><Label>Nom</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div className="space-y-2"><Label>Description</Label><Input value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
      <div className="space-y-2">
        <Label>Modèle IA</Label>
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{models.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Prompt système</Label>
        <Textarea value={sp} onChange={(e) => setSp(e.target.value)} rows={6} className="text-xs font-mono" />
        <p className="text-[10px] text-muted-foreground">💡 Personnalisez le prompt pour que l'agent traite des données réelles et agisse concrètement.</p>
      </div>
      <Button className="w-full" onClick={() => onSave({ name, description: desc, systemPrompt: sp, model })}>Enregistrer</Button>
    </div>
  );
};

export default AIAgentsPage;
