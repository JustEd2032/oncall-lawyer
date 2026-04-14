import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div style={s.wrapper}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.brand} onClick={() => navigate("/")}>
            <div style={s.brandMain}>PRUDENTE TORRES &amp; ASOCIADOS A.C.</div>
            <div style={s.brandSub}>Abogados · English Spoken</div>
          </div>
          <button className="btn-secondary" style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }} onClick={() => navigate("/")}>
            ← Regresar · Back
          </button>
        </div>
      </header>

      <div style={s.content}>
        {/* Title */}
        <div style={s.titleBlock}>
          <div className="ornament" style={{ marginBottom: "1rem" }}>Aviso de Privacidad · Privacy Notice</div>
          <h1 style={s.title}>Aviso de Privacidad</h1>
          <h2 style={s.titleEn}>Privacy Policy</h2>
          <p style={s.meta}>Última actualización · Last updated: {new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>

        <div style={s.card} className="card">
          {[
            {
              num: "1",
              titleEs: "Identidad y Domicilio del Responsable",
              titleEn: "Identity and Address of the Data Controller",
              es: "Prudente Torres & Asociados A.C., con domicilio en Calle Hidalgo No 10, Edificio Muller, Despacho 206, Segundo Piso, Col. Centro, C.P. 39300, Acapulco, Guerrero, México, es responsable del uso y protección de sus datos personales.",
              en: "Prudente Torres & Asociados A.C., located at Calle Hidalgo No 10, Edificio Muller, Office 206, Second Floor, Col. Centro, C.P. 39300, Acapulco, Guerrero, Mexico, is responsible for the use and protection of your personal data.",
            },
            {
              num: "2",
              titleEs: "Datos Personales Recabados",
              titleEn: "Personal Data Collected",
              es: "Recabamos los siguientes datos personales: nombre, dirección de correo electrónico, número de teléfono, y datos de uso de la plataforma. No recabamos datos personales sensibles.",
              en: "We collect the following personal data: name, email address, phone number, and platform usage data. We do not collect sensitive personal data.",
            },
            {
              num: "3",
              titleEs: "Finalidades del Tratamiento",
              titleEn: "Purposes of Data Processing",
              es: "Sus datos personales serán utilizados para: (a) gestionar su cuenta y citas en la plataforma; (b) enviarle notificaciones sobre sus consultas; (c) comunicarle información relacionada con nuestros servicios legales; (d) cumplir con obligaciones legales.",
              en: "Your personal data will be used to: (a) manage your account and appointments on the platform; (b) send you notifications about your consultations; (c) communicate information related to our legal services; (d) comply with legal obligations.",
            },
            {
              num: "4",
              titleEs: "Transferencia de Datos",
              titleEn: "Data Transfer",
              es: "No realizamos transferencias de datos personales a terceros sin su consentimiento, salvo las excepciones previstas en el artículo 37 de la LFPDPPP, incluyendo autoridades competentes cuando sea requerido por ley.",
              en: "We do not transfer personal data to third parties without your consent, except as provided under Article 37 of the LFPDPPP, including competent authorities when required by law.",
            },
            {
              num: "5",
              titleEs: "Derechos ARCO",
              titleEn: "ARCO Rights",
              es: "Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales (derechos ARCO). Para ejercer estos derechos, envíe una solicitud a prudentetorres@hotmail.com o al Tel. (01744) 135-5072.",
              en: "You have the right to Access, Rectify, Cancel, or Object to the processing of your personal data (ARCO rights). To exercise these rights, send a request to prudentetorres@hotmail.com or call (01744) 135-5072.",
            },
            {
              num: "6",
              titleEs: "Uso de Cookies",
              titleEn: "Use of Cookies",
              es: "Nuestro sitio web utiliza cookies y tecnologías similares para mejorar su experiencia de usuario y el funcionamiento de la plataforma. Puede desactivar las cookies en la configuración de su navegador.",
              en: "Our website uses cookies and similar technologies to improve your user experience and platform functionality. You may disable cookies in your browser settings.",
            },
            {
              num: "7",
              titleEs: "Cambios al Aviso de Privacidad",
              titleEn: "Changes to This Privacy Policy",
              es: "Nos reservamos el derecho de efectuar modificaciones a este aviso de privacidad. Cualquier cambio será notificado a través de nuestra plataforma en prudentetorres.lat.",
              en: "We reserve the right to make changes to this privacy policy. Any changes will be notified through our platform at prudentetorres.lat.",
            },
            {
              num: "8",
              titleEs: "Contacto",
              titleEn: "Contact",
              es: "Para cualquier duda o comentario sobre este aviso de privacidad, contáctenos en: prudentetorres@hotmail.com · Tel. (01744) 135-5072 · Calle Hidalgo No 10, Edificio Muller, Despacho 206, Acapulco, Guerrero.",
              en: "For any questions or comments about this privacy policy, contact us at: prudentetorres@hotmail.com · Tel. (01744) 135-5072 · Calle Hidalgo No 10, Edificio Muller, Despacho 206, Acapulco, Guerrero.",
            },
          ].map(({ num, titleEs, titleEn, es, en }) => (
            <div key={num} style={s.section}>
              <div style={s.sectionNum}>{num}</div>
              <div style={s.sectionBody}>
                <h3 style={s.sectionTitle}>{titleEs}</h3>
                <h4 style={s.sectionTitleEn}>{titleEn}</h4>
                <p style={s.sectionEs}>{es}</p>
                <p style={s.sectionEn}>{en}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={s.footer}>
          © {new Date().getFullYear()} Prudente Torres &amp; Asociados A.C. · Todos los derechos reservados · All rights reserved
        </p>
      </div>
    </div>
  );
}

const s = {
  wrapper: { minHeight: "100vh", background: "var(--ivory)" },
  header: { background: "var(--cream)", borderBottom: "2px solid var(--gold)", padding: "0 2.5rem", position: "sticky", top: 0, zIndex: 100, boxShadow: "var(--shadow-sm)" },
  headerInner: { maxWidth: "900px", margin: "0 auto", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  brand: { cursor: "pointer" },
  brandMain: { fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: "700", color: "var(--brown-deep)", letterSpacing: "0.05em" },
  brandSub: { fontFamily: "var(--font-body)", fontSize: "0.6rem", color: "var(--brown-light)", letterSpacing: "0.2em", textTransform: "uppercase" },
  content: { maxWidth: "900px", margin: "0 auto", padding: "3rem 2rem" },
  titleBlock: { textAlign: "center", marginBottom: "3rem" },
  title: { fontFamily: "var(--font-display)", fontSize: "2.5rem", color: "var(--brown-deep)", fontWeight: "400", marginBottom: "0.25rem" },
  titleEn: { fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--brown-light)", fontWeight: "300", fontStyle: "italic", marginBottom: "1rem" },
  meta: { fontSize: "0.8rem", color: "var(--gray-warm)", letterSpacing: "0.05em" },
  card: { padding: "2.5rem", marginBottom: "2rem" },
  section: { display: "flex", gap: "1.5rem", paddingBottom: "2rem", marginBottom: "2rem", borderBottom: "1px solid var(--parchment)" },
  sectionNum: { fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--gold)", fontWeight: "700", minWidth: "2rem", lineHeight: 1 },
  sectionBody: { flex: 1 },
  sectionTitle: { fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "var(--brown-deep)", marginBottom: "0.1rem", fontWeight: "600" },
  sectionTitleEn: { fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "var(--brown-light)", fontWeight: "300", fontStyle: "italic", marginBottom: "0.75rem" },
  sectionEs: { fontSize: "0.9rem", color: "var(--brown-mid)", lineHeight: "1.8", marginBottom: "0.5rem" },
  sectionEn: { fontSize: "0.85rem", color: "var(--gray-warm)", lineHeight: "1.8", fontStyle: "italic" },
  footer: { textAlign: "center", fontSize: "0.75rem", color: "var(--gray-warm)", padding: "1rem 0" },
};
