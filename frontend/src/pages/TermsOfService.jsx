import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();

  const sections = [
    {
      num: "1",
      titleEs: "Aceptación de los Términos",
      titleEn: "Acceptance of Terms",
      es: "Al registrarse y utilizar la plataforma de Prudente Torres & Asociados A.C. (en adelante \"la Plataforma\"), usted acepta quedar vinculado por los presentes Términos de Servicio. Si no está de acuerdo con alguno de estos términos, no utilice la Plataforma.",
      en: "By registering and using the Prudente Torres & Asociados A.C. platform (hereinafter \"the Platform\"), you agree to be bound by these Terms of Service. If you do not agree with any of these terms, do not use the Platform.",
    },
    {
      num: "2",
      titleEs: "Descripción del Servicio",
      titleEn: "Description of Service",
      es: "La Plataforma facilita la conexión entre clientes y abogados para la prestación de servicios de asesoría legal mediante consultas en línea. Prudente Torres & Asociados A.C. actúa como intermediario tecnológico y no garantiza resultados legales específicos.",
      en: "The Platform facilitates the connection between clients and attorneys for legal advisory services through online consultations. Prudente Torres & Asociados A.C. acts as a technology intermediary and does not guarantee specific legal outcomes.",
    },
    {
      num: "3",
      titleEs: "Registro y Cuentas de Usuario",
      titleEn: "Registration and User Accounts",
      es: "Para utilizar la Plataforma debe registrarse con información veraz y actualizada. Usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades realizadas bajo su cuenta. Notifíquenos inmediatamente sobre cualquier uso no autorizado.",
      en: "To use the Platform you must register with truthful and up-to-date information. You are responsible for maintaining the confidentiality of your password and all activities carried out under your account. Notify us immediately of any unauthorized use.",
    },
    {
      num: "4",
      titleEs: "Servicios Legales y Limitación de Responsabilidad",
      titleEn: "Legal Services and Limitation of Liability",
      es: "Las consultas realizadas a través de la Plataforma constituyen asesoría legal general y no reemplazan la representación legal formal. Prudente Torres & Asociados A.C. no se hace responsable por decisiones tomadas con base en la asesoría recibida sin la correspondiente contratación formal de servicios legales.",
      en: "Consultations conducted through the Platform constitute general legal advice and do not replace formal legal representation. Prudente Torres & Asociados A.C. is not responsible for decisions made based on advice received without the formal engagement of legal services.",
    },
    {
      num: "5",
      titleEs: "Pagos y Reembolsos",
      titleEn: "Payments and Refunds",
      es: "Los pagos por consultas se procesan de forma segura a través de nuestro proveedor de pagos. Las tarifas son las establecidas por cada abogado en su perfil. Los reembolsos se evaluarán caso por caso y deberán solicitarse dentro de las 24 horas posteriores a la consulta programada.",
      en: "Payments for consultations are processed securely through our payment provider. Fees are those set by each attorney in their profile. Refunds will be evaluated on a case-by-case basis and must be requested within 24 hours after the scheduled consultation.",
    },
    {
      num: "6",
      titleEs: "Confidencialidad",
      titleEn: "Confidentiality",
      es: "Toda la información compartida durante las consultas está sujeta al secreto profesional conforme a la legislación mexicana aplicable. La Plataforma utiliza cifrado y medidas de seguridad para proteger la confidencialidad de las comunicaciones.",
      en: "All information shared during consultations is subject to professional secrecy in accordance with applicable Mexican law. The Platform uses encryption and security measures to protect the confidentiality of communications.",
    },
    {
      num: "7",
      titleEs: "Conducta del Usuario",
      titleEn: "User Conduct",
      es: "Los usuarios se comprometen a utilizar la Plataforma de manera lícita y ética. Queda prohibido utilizar la Plataforma para actividades ilegales, compartir información falsa, acosar a otros usuarios o intentar vulnerar la seguridad del sistema.",
      en: "Users agree to use the Platform in a lawful and ethical manner. It is prohibited to use the Platform for illegal activities, share false information, harass other users, or attempt to compromise the security of the system.",
    },
    {
      num: "8",
      titleEs: "Cancelaciones y Citas",
      titleEn: "Cancellations and Appointments",
      es: "Las citas pueden cancelarse hasta 2 horas antes de la hora programada sin cargo. Las cancelaciones tardías o inasistencias pueden estar sujetas a cargos según la política del abogado. Los abogados también pueden cancelar citas con aviso previo razonable.",
      en: "Appointments may be cancelled up to 2 hours before the scheduled time at no charge. Late cancellations or no-shows may be subject to charges according to the attorney's policy. Attorneys may also cancel appointments with reasonable prior notice.",
    },
    {
      num: "9",
      titleEs: "Propiedad Intelectual",
      titleEn: "Intellectual Property",
      es: "Todo el contenido de la Plataforma, incluyendo diseño, logotipos, textos y software, es propiedad de Prudente Torres & Asociados A.C. y está protegido por las leyes de propiedad intelectual aplicables. No se permite su reproducción sin autorización expresa.",
      en: "All content on the Platform, including design, logos, text and software, is the property of Prudente Torres & Asociados A.C. and is protected by applicable intellectual property laws. Reproduction without express authorization is not permitted.",
    },
    {
      num: "10",
      titleEs: "Modificaciones y Terminación",
      titleEn: "Modifications and Termination",
      es: "Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de la Plataforma. El uso continuado de la Plataforma tras los cambios constituye aceptación de los nuevos términos. Podemos suspender o terminar cuentas que violen estos términos.",
      en: "We reserve the right to modify these terms at any time. Changes will be notified through the Platform. Continued use of the Platform after changes constitutes acceptance of the new terms. We may suspend or terminate accounts that violate these terms.",
    },
    {
      num: "11",
      titleEs: "Ley Aplicable y Jurisdicción",
      titleEn: "Applicable Law and Jurisdiction",
      es: "Estos Términos de Servicio se rigen por las leyes de los Estados Unidos Mexicanos. Para cualquier controversia derivada del uso de la Plataforma, las partes se someten a la jurisdicción de los tribunales competentes de Acapulco, Guerrero, México.",
      en: "These Terms of Service are governed by the laws of the United Mexican States. For any dispute arising from the use of the Platform, the parties submit to the jurisdiction of the competent courts of Acapulco, Guerrero, Mexico.",
    },
    {
      num: "12",
      titleEs: "Contacto",
      titleEn: "Contact",
      es: "Para preguntas sobre estos Términos de Servicio contáctenos en: prudentetorres@hotmail.com · Tel. (01744) 135-5072 · Calle Hidalgo No 10, Edificio Muller, Despacho 206, Acapulco, Guerrero.",
      en: "For questions about these Terms of Service contact us at: prudentetorres@hotmail.com · Tel. (01744) 135-5072 · Calle Hidalgo No 10, Edificio Muller, Office 206, Acapulco, Guerrero.",
    },
  ];

  return (
    <div style={s.wrapper}>
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
        <div style={s.titleBlock}>
          <div className="ornament" style={{ marginBottom: "1rem" }}>Términos de Servicio · Terms of Service</div>
          <h1 style={s.title}>Términos de Servicio</h1>
          <h2 style={s.titleEn}>Terms of Service</h2>
          <p style={s.meta}>Última actualización · Last updated: {new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>

        <div style={s.card} className="card">
          {sections.map(({ num, titleEs, titleEn, es, en }) => (
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
          <br />
          <a href="/privacidad" style={{ color: "var(--gold)", fontSize: "0.7rem" }}>Aviso de Privacidad · Privacy Policy</a>
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
