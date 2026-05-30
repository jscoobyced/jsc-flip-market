import { query } from "../db/index";
import type { PageType } from "../services/i18nService";

interface TranslationValues {
  en: string;
  es: string;
}

type TranslationGroup = Record<string, TranslationValues>;

export const translationGroups: Record<PageType, TranslationGroup> = {
  // ==================== COMMON ====================
  common: {
    brand: { en: "FlipMarket", es: "FlipMarket" },
    browse: { en: "Browse properties", es: "Explorar propiedades" },
    dashboard: { en: "Dashboard", es: "Panel" },
    logout: { en: "Log out", es: "Cerrar sesión" },
    login: { en: "Log in", es: "Iniciar sesión" },
    register: { en: "Register", es: "Registrarse" },
    loading: { en: "Loading...", es: "Cargando..." },
    save: { en: "Save changes", es: "Guardar cambios" },
    saving: { en: "Saving...", es: "Guardando..." },
    cancel: { en: "Cancel", es: "Cancelar" },
    next: { en: "Next", es: "Siguiente" },
    back: { en: "Back", es: "Atrás" },
    submit: { en: "Submit", es: "Enviar" },
    search: { en: "Search", es: "Buscar" },
    viewDetails: { en: "View details", es: "Ver detalles" },
    retry: { en: "Retry", es: "Intentar de nuevo" },
    empty: { en: "Nothing to show yet.", es: "Todavía no hay contenido." },
    previous: { en: "Previous", es: "Anterior" },
    signingIn: { en: "Signing in...", es: "Iniciando sesión..." },
    creatingAccount: { en: "Creating account...", es: "Creando cuenta..." },
    loadingAccount: { en: "Loading account...", es: "Cargando cuenta..." },
    savingProfile: { en: "Saving profile...", es: "Guardando perfil..." },
    viewProfile: { en: "View profile", es: "Ver perfil" },
    editProfile: { en: "Edit profile", es: "Editar perfil" },
    ownerOnly: {
      en: "Only owners can manage listings.",
      es: "Solo los propietarios pueden gestionar anuncios.",
    },
    signInToContinue: {
      en: "Log in as a flipper to send an enquiry.",
      es: "Inicia sesión como flipper para enviar una consulta.",
    },
    contactDetails: { en: "Contact details", es: "Datos de contacto" },
    message: { en: "Message", es: "Mensaje" },
    sendEnquiry: { en: "Send enquiry", es: "Enviar consulta" },
    sending: { en: "Sending...", es: "Enviando..." },
    enquirySent: {
      en: "Enquiry sent successfully. The owner has been notified.",
      es: "Consulta enviada correctamente. El propietario ha sido notificado.",
    },
    enquirySentError: {
      en: "Unable to send enquiry",
      es: "No se pudo enviar la consulta",
    },
    email: { en: "Email", es: "Correo electrónico" },
    phone: { en: "Phone", es: "Teléfono" },
    name: { en: "Name", es: "Nombre" },
    bio: { en: "Bio", es: "Biografía" },
    saveProfile: { en: "Save profile", es: "Guardar perfil" },
    contact: { en: "Contact", es: "Contacto" },
    noEnquiriesYet: { en: "No enquiries yet", es: "Sin consultas aún" },
    noEnquiriesDescription: {
      en: "Create a listing and interested flippers will start appearing here with their contact details.",
      es: "Crea un anuncio y los flippers interesados aparecerán aquí con sus datos de contacto.",
    },
    recentEnquiries: { en: "Recent enquiries", es: "Consultas recientes" },
    reviewEnquiries: {
      en: "Review buyer messages, contact details, and the listing each enquiry belongs to.",
      es: "Revisa los mensajes de los compradores, sus datos de contacto y el anuncio de cada consulta.",
    },
    trackEnquiries: {
      en: "Track enquiries across your listings",
      es: "Seguimiento de consultas en tus anuncios",
    },
    totalEnquiries: {
      en: "Total enquiries received",
      es: "Total de consultas recibidas",
    },
    pendingFollowUps: {
      en: "Pending follow-ups",
      es: "Seguimientos pendientes",
    },
    listingsWithEnquiries: {
      en: "Listings with enquiries",
      es: "Anuncios con consultas",
    },
    ownerProfileView: {
      en: "View owner profile",
      es: "Ver perfil del propietario",
    },
    ownerListingsView: { en: "View listings", es: "Ver anuncios" },
    loadingOwner: { en: "Loading...", es: "Cargando..." },
    loadingEnquiries: { en: "Loading...", es: "Cargando..." },
  },

  // ==================== HOME ====================
  home: {
    pageTitle: { en: "Home", es: "Inicio" },
    heroEyebrow: {
      en: "Marketplace for value-add deals",
      es: "Marketplace para oportunidades con potencial",
    },
    heroTitle: {
      en: "Find distressed properties ready for their next chapter.",
      es: "Encuentra propiedades listas para su próxima transformación.",
    },
    heroText: {
      en: "Connect owners who are ready to sell with flippers searching for renovation-ready opportunities.",
      es: "Conecta propietarios listos para vender con flippers que buscan oportunidades para renovar.",
    },
    heroPrimary: { en: "Explore listings", es: "Explorar anuncios" },
    heroSecondary: { en: "List your property", es: "Publicar propiedad" },
    featuredTitle: {
      en: "Featured opportunities",
      es: "Oportunidades destacadas",
    },
    featuredEyebrow: { en: "Featured", es: "Destacado" },
    featuredText: {
      en: "Fresh listings with strong upside, detailed owner profiles, and instant enquiry tools.",
      es: "Nuevos anuncios con gran potencial, perfiles detallados y contacto inmediato.",
    },
    statsTitle: {
      en: "Why teams use FlipMarket",
      es: "Por qué usan FlipMarket",
    },
    listedHomes: { en: "Properties listed", es: "Propiedades publicadas" },
    activeBuyers: { en: "Active flippers", es: "Flippers activos" },
    closingRate: {
      en: "Owner enquiry response rate",
      es: "Tasa de respuesta del propietario",
    },
    workflowEyebrow: {
      en: "Marketplace workflow",
      es: "Flujo del marketplace",
    },
    workflowDescription: {
      en: "Flexible profiles, role-aware dashboards, and listing workflows designed for off-market inventory.",
      es: "Perfiles flexibles, paneles por rol y flujos de anuncios pensados para inventario fuera de mercado.",
    },
    workflowOwnerTitle: {
      en: "Owners list faster",
      es: "Los propietarios publican mas rapido",
    },
    workflowOwnerBody: {
      en: "Publish pricing, condition notes, and image galleries in a guided two-step form.",
      es: "Publica precio, notas de condicion y galerias de imagenes en un formulario guiado de dos pasos.",
    },
    workflowFlipperTitle: {
      en: "Flippers compare faster",
      es: "Los flippers comparan mas rapido",
    },
    workflowFlipperBody: {
      en: "Use filters, detailed owner cards, and polished listing pages to evaluate each opportunity.",
      es: "Usa filtros, tarjetas detalladas del propietario y fichas pulidas para evaluar cada oportunidad.",
    },
    workflowEnquiryTitle: {
      en: "Enquiries stay focused",
      es: "Las consultas se mantienen enfocadas",
    },
    workflowEnquiryBody: {
      en: "Send deal-specific messages with contact preferences directly from the property detail page.",
      es: "Envia mensajes especificos por operacion con preferencias de contacto desde la pagina de detalle.",
    },
    nextStepsEyebrow: { en: "Next steps", es: "Siguientes pasos" },
    ctaTitle: {
      en: "Ready to move your next deal faster?",
      es: "¿Listo para acelerar tu próxima operación?",
    },
    ctaText: {
      en: "Owners can list in minutes. Flippers can search, compare, and contact sellers instantly.",
      es: "Los propietarios publican en minutos y los flippers comparan y contactan al instante.",
    },
    joinAsOwner: { en: "Join as owner", es: "Únete como propietario" },
    joinAsFlipper: { en: "Join as flipper", es: "Únete como flipper" },
    stats: { en: "Stats", es: "Estadísticas" },
  },

  // ==================== AUTH ====================
  auth: {
    loginPageTitle: { en: "Log in", es: "Iniciar sesion" },
    registerPageTitle: { en: "Register", es: "Registrarse" },
    authenticationEyebrow: { en: "Authentication", es: "Autenticacion" },
    onboardingEyebrow: {
      en: "Marketplace onboarding",
      es: "Registro en el marketplace",
    },
    registerTitle: {
      en: "Create your marketplace account",
      es: "Crea tu cuenta",
    },
    loginTitle: { en: "Welcome back", es: "Bienvenido de nuevo" },
    loginSubtitle: {
      en: "Sign in to manage enquiries, listings, and profile details.",
      es: "Inicia sesión para gestionar anuncios y consultas.",
    },
    registerSubtitle: {
      en: "Choose the role that matches how you use the marketplace.",
      es: "Elige el rol que mejor describe cómo usarás la plataforma.",
    },
    full_name: { en: "Full name", es: "Nombre completo" },
    email: { en: "Email address", es: "Correo electrónico" },
    phone: { en: "Phone number", es: "Teléfono" },
    password: { en: "Password", es: "Contraseña" },
    confirmPassword: { en: "Confirm password", es: "Confirmar contraseña" },
    role: { en: "I am joining as", es: "Me registro como" },
    owner: { en: "Property owner", es: "Propietario" },
    flipper: { en: "Real-estate flipper", es: "Flipper" },
    bio: { en: "Bio", es: "Biografía" },
    companyName: { en: "Company name", es: "Empresa" },
    taxId: { en: "Tax ID", es: "ID fiscal" },
    specializations: { en: "Specializations", es: "Especialidades" },
    submitRegister: { en: "Create account", es: "Crear cuenta" },
    submitLogin: { en: "Log in", es: "Iniciar sesión" },
    passwordTooShort: {
      en: "Password must be at least 8 characters long.",
      es: "La contraseña debe tener al menos 8 caracteres.",
    },
    passwordMismatch: {
      en: "Password confirmation does not match.",
      es: "La confirmación de contraseña no coincide.",
    },
    passwordRequirements: {
      en: "Password must be at least 8 characters long.",
      es: "La contraseña debe tener al menos 8 caracteres.",
    },
    helperCopyOwner: {
      en: "Highlight the types of properties you are ready to list and how buyers can reach you.",
      es: "Indica los tipos de propiedades que deseas publicar y cómo contactarte.",
    },
    helperCopyFlipper: {
      en: "Share your buying criteria and rehab strengths so owners understand your fit.",
      es: "Comparte tus criterios de compra y especialidades para que los propietarios te conozcan.",
    },
    specializationHint: {
      en: "Comma separated values",
      es: "Valores separados por comas",
    },
    defaultSpecializations: {
      en: "single-family, multi-family",
      es: "unifamiliar, multifamiliar",
    },
    alreadyRegistered: { en: "Already registered?", es: "¿Ya tienes cuenta?" },
    needAccount: { en: "Need an account?", es: "¿Necesitas una cuenta?" },
    unableToSignIn: {
      en: "Unable to sign in",
      es: "No se pudo iniciar sesion",
    },
    passwordError: {
      en: "Unable to create account",
      es: "No se pudo crear la cuenta",
    },
  },

  // ==================== SEARCH ====================
  search: {
    pageTitle: {
      en: "Search properties",
      es: "Buscar propiedades",
    },
    eyebrow: { en: "Discovery", es: "Descubrimiento" },
    title: {
      en: "Search renovation-ready properties",
      es: "Busca propiedades para renovar",
    },
    subtitle: {
      en: "Filter by location, price, property type, and condition.",
      es: "Filtra por ubicación, precio, tipo y condición.",
    },
    results: { en: "results", es: "resultados" },
    noResults: {
      en: "No properties matched your filters. Try broadening the search.",
      es: "Ninguna propiedad coincide con los filtros. Intenta ampliar la búsqueda.",
    },
    noResultsTitle: { en: "No results", es: "Sin resultados" },
    grid: { en: "Grid", es: "Cuadrícula" },
    list: { en: "List", es: "Lista" },
    keyword: { en: "Keyword", es: "Palabra clave" },
    city: { en: "City", es: "Ciudad" },
    state: { en: "State", es: "Estado" },
    propertyType: { en: "Property type", es: "Tipo de propiedad" },
    anyType: { en: "Any type", es: "Cualquier tipo" },
    condition: { en: "Condition", es: "Condición" },
    anyCondition: { en: "Any condition", es: "Cualquier condición" },
    minPrice: { en: "Min price", es: "Precio mínimo" },
    maxPrice: { en: "Max price", es: "Precio máximo" },
    anyConditionPlaceholder: {
      en: "City, asset, or opportunity",
      es: "Ciudad, activo u oportunidad",
    },
    propertyTypeSingleFamily: {
      en: "Single-family",
      es: "Unifamiliar",
    },
    propertyTypeMultiFamily: {
      en: "Multi-family",
      es: "Multifamiliar",
    },
    propertyTypeCommercial: {
      en: "Commercial",
      es: "Comercial",
    },
    propertyTypeLand: {
      en: "Land",
      es: "Terreno",
    },
    conditionPoor: { en: "Poor", es: "Malo" },
    conditionFair: { en: "Fair", es: "Regular" },
    conditionNeedsWork: { en: "Needs work", es: "Necesita trabajo" },
    conditionGoodBones: { en: "Good bones", es: "Buena base" },
    page: { en: "Page", es: "Página" },
    of: { en: "of", es: "de" },
    anyPropertyType: { en: "Any type", es: "Cualquier tipo" },
  },

  // ==================== PROPERTY ====================
  property: {
    details: { en: "Property details", es: "Detalles de la propiedad" },
    ownerDetails: { en: "Owner profile", es: "Perfil del propietario" },
    enquire: { en: "Send enquiry", es: "Enviar consulta" },
    enquireHelp: {
      en: "Introduce yourself, your buying criteria, and how you would like the owner to respond.",
      es: "Preséntate, indica tus criterios de compra y cómo deseas recibir respuesta.",
    },
    created: {
      en: "Property created successfully.",
      es: "Propiedad creada correctamente.",
    },
    updated: {
      en: "Property updated successfully.",
      es: "Propiedad actualizada correctamente.",
    },
    viewProperty: { en: "View property", es: "Ver propiedad" },
    viewPropertyArrow: { en: "View property", es: "Ver propiedad" },
    meetTheOwner: { en: "Meet the owner", es: "Conoce al propietario" },
    editListing: { en: "Edit listing", es: "Editar anuncio" },
    editThisListing: { en: "Edit this listing", es: "Editar este anuncio" },
    locationCity: { en: "City", es: "Ciudad" },
    locationState: { en: "State", es: "Estado" },
    propertyType: { en: "Property type", es: "Tipo de propiedad" },
    condition: { en: "Condition", es: "Condición" },
    squareFootage: { en: "Square footage", es: "Superficie" },
    yearBuilt: { en: "Year built", es: "Año de construcción" },
    status: { en: "Status", es: "Estado" },
    address: { en: "Address", es: "Dirección" },
    zip: { en: "ZIP", es: "Código postal" },
    listed: { en: "Listed", es: "Publicado" },
    sqFt: { en: "Sq ft", es: "m²" },
    independentOwner: {
      en: "Independent owner",
      es: "Propietario independiente",
    },
    ownerDetailsUnavailable: {
      en: "Owner details unavailable",
      es: "Datos del propietario no disponibles",
    },
    ownerDetailsLoading: {
      en: "Loading owner details...",
      es: "Cargando datos del propietario...",
    },
    unableToLoad: {
      en: "Unable to load property",
      es: "No se pudo cargar la propiedad",
    },
    viewOwnerProfile: {
      en: "View owner profile",
      es: "Ver perfil del propietario",
    },
    loadingEnquiry: { en: "Sending...", es: "Enviando..." },
    unableToSendEnquiry: {
      en: "Unable to send enquiry",
      es: "No se pudo enviar la consulta",
    },
    title: { en: "Title", es: "Título" },
    description: { en: "Description", es: "Descripción" },
    owner: { en: "Owner", es: "Propietario" },
    flipper: { en: "Flipper", es: "Flipper" },
    profile: { en: "Profile", es: "Perfil" },
  },

  // ==================== PROFILE ====================
  profile: {
    about: { en: "About", es: "Acerca de" },
    specialties: { en: "Specializations", es: "Especialidades" },
    contact: { en: "Contact", es: "Contacto" },
    edit: { en: "Edit profile", es: "Editar perfil" },
    buyerProfile: { en: "Buyer profile", es: "Perfil del comprador" },
    portfolioProjects: { en: "Portfolio projects", es: "Proyectos en cartera" },
    averageRating: { en: "Average rating", es: "Valoración media" },
    specializationCount: { en: "Specializations", es: "Especialidades" },
    ownerProfile: { en: "Owner profile", es: "Perfil del propietario" },
    flipperProfile: { en: "Flipper profile", es: "Perfil del flipper" },
    companyOverview: {
      en: "Company overview",
      es: "Descripción de la empresa",
    },
    viewDashboard: { en: "View dashboard", es: "Ver panel" },
    providedOnRequest: {
      en: "Provided on request",
      es: "Disponible bajo solicitud",
    },
    unableToLoadOwner: {
      en: "Unable to load owner profile",
      es: "No se pudo cargar el perfil del propietario",
    },
    unableToLoadFlipper: {
      en: "Unable to load flipper profile",
      es: "No se pudo cargar el perfil del flipper",
    },
    editProfileTitle: {
      en: "Edit your owner profile",
      es: "Editar tu perfil de propietario",
    },
    editProfileTitleFlipper: {
      en: "Edit your profile",
      es: "Editar tu perfil",
    },
    profileUpdated: {
      en: "Profile updated successfully.",
      es: "Perfil actualizado correctamente.",
    },
    specializationHint: {
      en: "Comma separated values",
      es: "Valores separados por comas",
    },
    specializationHintFlipper: {
      en: "Comma separated",
      es: "Separados por comas",
    },
  },

  // ==================== LEGAL ====================
  legal: {
    eyebrow: { en: "Legal", es: "Legal" },
    termsTitle: { en: "Terms of Use", es: "Términos de uso" },
    privacyTitle: { en: "Privacy Policy", es: "Política de privacidad" },
    termsSubtitle: {
      en: "These terms govern access to the FlipMarket frontend experience and the information shared by marketplace users.",
      es: "Estos términos regulan el acceso a la experiencia de FlipMarket y la información compartida por los usuarios.",
    },
    privacySubtitle: {
      en: "This policy describes how the frontend handles marketplace data while the project is in MVP mode.",
      es: "Esta política describe cómo se gestionan los datos del marketplace mientras el proyecto está en modo MVP.",
    },
    marketplaceAccess: {
      en: "Marketplace access",
      es: "Acceso al marketplace",
    },
    marketplaceAccessBody: {
      en: "FlipMarket connects property owners and flippers. By using the service you confirm that profile, listing, and contact details are accurate and lawfully provided.",
      es: "FlipMarket conecta propietarios y flippers. Al usar el servicio confirmas que los datos de perfil, anuncio y contacto son precisos y legítimos.",
    },
    listingResponsibilities: {
      en: "Listing responsibilities",
      es: "Responsabilidades del anuncio",
    },
    listingResponsibilitiesBody: {
      en: "Owners are responsible for the accuracy of pricing, condition notes, imagery, and any disclosures related to a property. Flippers remain responsible for their own diligence.",
      es: "Los propietarios son responsables de la exactitud del precio, notas de condición, imágenes y divulgaciones de la propiedad. Los flippers son responsables de su propia diligencia debida.",
    },
    enquiryConduct: { en: "Enquiry conduct", es: "Conducta en las consultas" },
    enquiryConductBody: {
      en: "Users agree to communicate professionally, avoid spam, and respect the confidentiality of contact information exchanged through the platform.",
      es: "Los usuarios se comprometen a comunicarse profesionalmente, evitar el spam y respetar la confidencialidad de los datos de contacto intercambiados.",
    },
    futureUpdates: { en: "Future updates", es: "Actualizaciones futuras" },
    futureUpdatesBody: {
      en: "These terms may evolve as the marketplace expands. Continued use of the platform constitutes acceptance of the latest published terms.",
      es: "Estos términos pueden evolucionar a medida que el marketplace crezca. El uso continuado implica la aceptación de los términos vigentes.",
    },
    informationWeCollect: {
      en: "Information we collect",
      es: "Información que recopilamos",
    },
    informationWeCollectBody: {
      en: "Account details, property listings, enquiry messages, language preference, and authentication tokens are used to operate the marketplace experience.",
      es: "Los datos de cuenta, anuncios, mensajes de consulta, preferencia de idioma y tokens de autenticación se usan para operar la experiencia del marketplace.",
    },
    howInformationIsUsed: {
      en: "How information is used",
      es: "Cómo se usa la información",
    },
    howInformationIsUsedBody: {
      en: "Your data powers role-aware navigation, listing management, buyer enquiries, and future backend integrations such as notifications and analytics.",
      es: "Tus datos impulsan la navegación por roles, la gestión de anuncios, las consultas y futuras integraciones como notificaciones y analíticas.",
    },
    dataRetention: { en: "Data retention", es: "Retención de datos" },
    dataRetentionBody: {
      en: "In this MVP, browser storage may be used to simulate backend persistence until production APIs are available. Production retention policies should be defined by the backend team.",
      es: "En este MVP, se puede usar el almacenamiento del navegador para simular la persistencia hasta que las APIs de producción estén disponibles.",
    },
    yourChoices: { en: "Your choices", es: "Tus opciones" },
    yourChoicesBody: {
      en: "Users can update their profile information, change language preferences, and request listing changes through their marketplace account.",
      es: "Los usuarios pueden actualizar su perfil, cambiar el idioma y solicitar cambios en anuncios desde su cuenta.",
    },
  },

  // ==================== ERRORS ====================
  errors: {
    generic: {
      en: "Something went wrong. Please try again.",
      es: "Algo salió mal. Vuelve a intentarlo.",
    },
    unauthorized: {
      en: "Please sign in to continue.",
      es: "Inicia sesión para continuar.",
    },
    forbidden: {
      en: "You do not have access to that area.",
      es: "No tienes acceso a esta sección.",
    },
    notFound: {
      en: "We could not find that page.",
      es: "No encontramos esa página.",
    },
    unableToLoad: { en: "Unable to load", es: "No se pudo cargar" },
    unableToSendEnquiry: {
      en: "Unable to send enquiry",
      es: "No se pudo enviar la consulta",
    },
    unableToCreateAccount: {
      en: "Unable to create account",
      es: "No se pudo crear la cuenta",
    },
  },

  // ==================== DASHBOARD ====================
  dashboard: {
    pageTitle: { en: "Owner dashboard", es: "Panel del propietario" },
    trackEnquiries: {
      en: "Track enquiries across your listings",
      es: "Seguimiento de consultas en tus anuncios",
    },
    dashboardDescription: {
      en: "See how many enquiries you have received and review the buyers who are reaching out on each property.",
      es: "Consulta cuántas solicitudes has recibido y revisa los compradores que contactan en cada propiedad.",
    },
    viewListings: { en: "View listings", es: "Ver anuncios" },
    listProperty: { en: "List property", es: "Publicar propiedad" },
    totalEnquiries: {
      en: "Total enquiries received",
      es: "Total de consultas recibidas",
    },
    pendingFollowUps: {
      en: "Pending follow-ups",
      es: "Seguimientos pendientes",
    },
    listingsWithEnquiries: {
      en: "Listings with enquiries",
      es: "Anuncios con consultas",
    },
    recentEnquiries: { en: "Recent enquiries", es: "Consultas recientes" },
    reviewEnquiries: {
      en: "Review buyer messages, contact details, and the listing each enquiry belongs to.",
      es: "Revisa los mensajes, los datos de contacto y el anuncio de cada consulta.",
    },
    ownerOnly: {
      en: "Only owners can view the dashboard.",
      es: "Solo los propietarios pueden ver el panel.",
    },
    unableToLoad: {
      en: "Unable to load dashboard",
      es: "No se pudo cargar el panel",
    },
    statusPending: { en: "Pending", es: "Pendiente" },
    statusContacted: { en: "Contacted", es: "Contactado" },
    statusAccepted: { en: "Accepted", es: "Aceptado" },
    statusRejected: { en: "Rejected", es: "Rechazado" },
    receivedLabel: { en: "Received", es: "Recibido" },
    fromLabel: { en: "from", es: "de" },
    propertyTitle: { en: "Property title", es: "Título de la propiedad" },
    status: { en: "Status", es: "Estado" },
    receivedFrom: { en: "Received from", es: "Recibido de" },
    contactName: { en: "Contact name", es: "Nombre de contacto" },
    contactEmail: { en: "Contact email", es: "Correo de contacto" },
    contactPhone: { en: "Contact phone", es: "Teléfono de contacto" },
    enquiryMessage: { en: "Enquiry message", es: "Mensaje de consulta" },
  },

  // ==================== OWNER LISTINGS ====================
  "owner-listings": {
    pageTitle: { en: "Owner listings", es: "Anuncios del propietario" },
    inventoryEyebrow: {
      en: "Owner inventory",
      es: "Inventario del propietario",
    },
    description: {
      en: "Browse active listings for this owner.",
      es: "Explora los anuncios activos de este propietario.",
    },
    createNewListing: { en: "Create new listing", es: "Crear nuevo anuncio" },
    noListings: { en: "No listings yet", es: "Sin anuncios aún" },
    noListingsDescription: {
      en: "Create the first property to start attracting enquiries.",
      es: "Crea la primera propiedad para empezar a recibir consultas.",
    },
    unableToLoad: {
      en: "Unable to load listings",
      es: "No se pudieron cargar los anuncios",
    },
    listProperty: { en: "List property", es: "Publicar propiedad" },
  },

  // ==================== EMPTY STATE ====================
  "empty-state": {
    noListings: { en: "No listings yet", es: "Sin anuncios aún" },
    noListingsDescription: {
      en: "Create the first property to start attracting enquiries.",
      es: "Crea la primera propiedad para empezar a recibir consultas.",
    },
    noEnquiries: { en: "No enquiries yet", es: "Sin consultas aún" },
    noEnquiriesDescription: {
      en: "Create a listing and interested flippers will start appearing here with their contact details.",
      es: "Crea un anuncio y los flippers interesados aparecerán aquí con sus datos de contacto.",
    },
    noProperties: {
      en: "No properties found",
      es: "No se encontraron propiedades",
    },
    noPropertiesDescription: {
      en: "Try adjusting your search filters or broaden your criteria.",
      es: "Intenta ajustar los filtros o ampliar los criterios de búsqueda.",
    },
  },

  // ==================== NOT FOUND ====================
  "not-found": {
    pageTitle: { en: "Not found", es: "No encontrado" },
    notFoundTitle: {
      en: "That page is out of bounds.",
      es: "Esa página no existe.",
    },
    notFoundSubtitle: {
      en: "The link may be outdated, or the property might have been removed.",
      es: "El enlace puede estar desactualizado o la propiedad puede haber sido eliminada.",
    },
    notFoundReturnHome: { en: "Return home", es: "Volver al inicio" },
  },

  // ==================== PROPERTY CREATE ====================
  "property-create": {
    title: { en: "Create property listing", es: "Crear anuncio de propiedad" },
    newListingEyebrow: { en: "New listing", es: "Nuevo anuncio" },
    description: {
      en: "Create a new listing to showcase your property to potential buyers.",
      es: "Crea un nuevo anuncio para mostrar tu propiedad a posibles compradores.",
    },
    propertyType: { en: "Property type", es: "Tipo de propiedad" },
    address: { en: "Address", es: "Dirección" },
    city: { en: "City", es: "Ciudad" },
    state: { en: "State", es: "Estado" },
    zip: { en: "ZIP", es: "Código postal" },
    squareFootage: { en: "Square footage", es: "Superficie" },
    yearBuilt: { en: "Year built", es: "Año de construcción" },
    condition: { en: "Condition", es: "Condición" },
    askingPrice: { en: "Asking price", es: "Precio solicitado" },
    status: { en: "Status", es: "Estado" },
    propertyDetails: { en: "Property details", es: "Detalles de la propiedad" },
    location: { en: "Location", es: "Ubicación" },
    propertySpecs: {
      en: "Property specifications",
      es: "Especificaciones de la propiedad",
    },
    pricing: { en: "Pricing", es: "Precio" },
    addImages: { en: "Add images", es: "Añadir imágenes" },
    addImage: { en: "Add image", es: "Añadir imagen" },
    removeImage: { en: "Remove image", es: "Eliminar imagen" },
    imageRemoved: { en: "Image removed", es: "Imagen eliminada" },
    imageUploadError: {
      en: "Failed to upload image",
      es: "Error al subir la imagen",
    },
    imageUploadSuccess: {
      en: "Image uploaded successfully",
      es: "Imagen subida correctamente",
    },
    imagePreview: { en: "Image preview", es: "Vista previa de la imagen" },
    imagePreviewError: {
      en: "Failed to load image preview",
      es: "Error al cargar la vista previa",
    },
    createListing: { en: "Create listing", es: "Crear anuncio" },
    cancel: { en: "Cancel", es: "Cancelar" },
  },

  // ==================== PROPERTY EDIT ====================
  "property-edit": {
    title: { en: "Edit property listing", es: "Editar anuncio de propiedad" },
    description: {
      en: "Update your property listing to keep it current.",
      es: "Actualiza tu anuncio para mantenerlo al día.",
    },
    propertyType: { en: "Property type", es: "Tipo de propiedad" },
    address: { en: "Address", es: "Dirección" },
    city: { en: "City", es: "Ciudad" },
    state: { en: "State", es: "Estado" },
    zip: { en: "ZIP", es: "Código postal" },
    squareFootage: { en: "Square footage", es: "Superficie" },
    yearBuilt: { en: "Year built", es: "Año de construcción" },
    condition: { en: "Condition", es: "Condición" },
    askingPrice: { en: "Asking price", es: "Precio solicitado" },
    status: { en: "Status", es: "Estado" },
    propertyDetails: { en: "Property details", es: "Detalles de la propiedad" },
    location: { en: "Location", es: "Ubicación" },
    propertySpecs: {
      en: "Property specifications",
      es: "Especificaciones de la propiedad",
    },
    pricing: { en: "Pricing", es: "Precio" },
    addImages: { en: "Add images", es: "Añadir imágenes" },
    addImage: { en: "Add image", es: "Añadir imagen" },
    removeImage: { en: "Remove image", es: "Eliminar imagen" },
    imageRemoved: { en: "Image removed", es: "Imagen eliminada" },
    imageUploadError: {
      en: "Failed to upload image",
      es: "Error al subir la imagen",
    },
    imageUploadSuccess: {
      en: "Image uploaded successfully",
      es: "Imagen subida correctamente",
    },
    imagePreview: { en: "Image preview", es: "Vista previa de la imagen" },
    imagePreviewError: {
      en: "Failed to load image preview",
      es: "Error al cargar la vista previa",
    },
    updateListing: { en: "Update listing", es: "Actualizar anuncio" },
    cancel: { en: "Cancel", es: "Cancelar" },
    deleteListing: { en: "Delete listing", es: "Eliminar anuncio" },
    deleteConfirmation: {
      en: "Are you sure you want to delete this listing?",
      es: "¿Seguro que quieres eliminar este anuncio?",
    },
    deleteListingWarning: {
      en: "This action cannot be undone.",
      es: "Esta acción no se puede deshacer.",
    },
  },
};

export const seedTranslations = async (): Promise<void> => {
  // Clear existing translations
  await query("DELETE FROM page_translations");

  // Flatten groups into INSERT rows for every language
  for (const [pageType, keys] of Object.entries(translationGroups)) {
    for (const [key, values] of Object.entries(keys)) {
      for (const [lang, value] of Object.entries(values)) {
        await query(
          `
            INSERT INTO page_translations (id, page_type, lang, key, value)
            VALUES ($1, $2, $3, $4, $5)
          `,
          [`${pageType}_${lang}_${key}`, pageType, lang, key, value],
        );
      }
    }
  }
};
