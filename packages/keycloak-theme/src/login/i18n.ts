import countries from "i18n-iso-countries";
import de from "i18n-iso-countries/langs/de.json";
import en from "i18n-iso-countries/langs/en.json";
import { createUseI18n } from "keycloakify/login";

countries.registerLocale(en);
countries.registerLocale(de);

export const { useI18n } = createUseI18n({
  en: {
    alphanumericalCharsOnly: "Only alphanumerical characters",
    gender: "Gender",
    doForgotPassword: "I forgot my password",
    doLogIn: "Log in",
    doRegister: "Create account",
    noAccount: "New user?",
    alreadyHaveAccount: "Already have an account?",
    or: "Or",
    then: "Then",
    next: "Next",
    back: "Back",
    goBack: "Go back",
    continue: "Continue",
    getStarted: "Get started!",
    accept: "I accept the ",
    terms: "Terms & conditions",
    subscribeToNewsletter: "Subscribe to our newsletter",
    formNotFilledProperly: "Form not filled properly",
    allowedEmailDomains: "allowed email domains",
    minimumLength: "Minimum length",
    mustRespectPattern: "Must respect the pattern",
    profession: "Profession",
    student: "Student",
    employee: "Employee",
    self_employed: "Self-employed",
    transport_planning: "Transport planning",
    urban_planning: "Urban planning",
    gis: "GIS",
    domain: "Domain",
    architecture: "Architecture",
    location_planning: "Location planning",
    civil_engineering: "Civil engineering",
    politics: "Politics",
    other: "Other",
    // Email Verify
    verifyEmail: "Verify your email address",
    resendEmail: "Resend Email",
    emailVerifyInstruction:
      'To get started, click on the activation link in the email we have sent you. If you haven\'t received the verification email, please check your "spam" folder.',
    proceedWithAction: "Click here to proceed",
    emailForgotInstruction:
      "Simply enter the email address associated with your account below, and we’ll email you a link to reset your password",
    loginTotpScanBarcode:
      "Scan the QR Code below using your preferred authenticator app and then enter the provided one-time code below.",
    scanQrCode: "Scan QR Code",
    loginToptConfigureManually: "Use the following configuration settings and code to manually configure your authenticator app.",
    changeLanguage: "Change language",
    changeTheme: "Change theme color",
    switchToV1: "You are using the new GOAT v2. You can still access the legacy GOAT v1 <a href='https://v1.goat.plan4better.de' style='cursor: pointer; color: #2BB381; font-weight: bold; text-decoration: none;'>here</a>, but please note that v1 and v2 are not linked, and you'll need a new account for GOAT v2."
  },
  de: {
    alphanumericalCharsOnly: "Nur alphanumerische Zeichen",
    gender: "Geschlecht",
    doForgotPassword: "Ich habe mein Passwort vergessen",
    doLogIn: "Anmelden",
    doRegister: "Benutzerkonto erstellen",
    alreadyHaveAccount: "Haben Sie bereits ein Konto?",
    noAccount: "Neuer Benutzer?",
    or: "Oder",
    then: "Dann",
    next: "Weiter",
    back: "Zurück",
    goBack: "Zurück",
    continue: "Weiter",
    getStarted: "Los geht's!",
    accept: "Ich akzeptiere die ",
    terms: "Nutzungsbedingungen",
    subscribeToNewsletter: "Abonnieren Sie unseren Newsletter",
    formNotFilledProperly: "Formular nicht richtig ausgefüllt",
    allowedEmailDomains: "erlaubte E-Mail-Domains",
    minimumLength: "Mindestlänge",
    mustRespectPattern: "Muss dem Muster entsprechen",
    profession: "Beruf",
    student: "Student",
    employee: "Angestellter",
    self_employed: "Selbstständig",
    transport_planning: "Verkehrsplanung",
    urban_planning: "Stadtplanung",
    gis: "GIS",
    domain: "Domain",
    architecture: "Architektur",
    location_planning: "Standortplanung",
    civil_engineering: "Bauingenieurwesen",
    politics: "Politik",
    other: "Andere",
    // Email Verify
    verifyEmail: "Bestätigen Sie Ihre E-Mail-Adresse",
    resendEmail: "E-Mail erneut senden",
    emailVerifyInstruction:
      'Um loszulegen, klicken Sie auf den Aktivierungslink in der E-Mail, die wir Ihnen geschickt haben. Wenn Sie die Bestätigungs-E-Mail nicht erhalten haben, überprüfen Sie bitte Ihren "Spam"-Ordner.',
    proceedWithAction: "Klicken Sie hier, um fortzufahren",
    emailForgotInstruction:
      "Geben Sie einfach die E-Mail-Adresse ein, die mit Ihrem Konto verbunden ist, und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts zu.",
    loginTotpScanBarcode:
      "Scannen Sie den QR-Code unten mit Ihrer bevorzugten Authenticator-App und geben Sie dann den bereitgestellten Einmalcode ein.",
    scanQrCode: "QR-Code scannen",
    loginToptConfigureManually: "Verwenden Sie die folgenden Konfigurationseinstellungen und den Code, um Ihre Authenticator-App manuell zu konfigurieren.",
    changeLanguage: "Sprache ändern",
    changeTheme: "Themenfarbe ändern",
    switchToV1: "Sie verwenden die neue GOAT-Version (v2). Klicken Sie <a href='https://v1.goat.plan4better.de' style='cursor: pointer; color: #2BB381; font-weight: bold; text-decoration: none;'>hier</a>, um GOAT v1 zu nutzen. Bitte beachten Sie, dass v1 und v2 nicht miteinander verbunden sind und Sie für v2 ein neues Konto benötigen."
  },
});

export const getCountries = (locale: string) => {
  return Object.entries(countries.getNames(locale, { select: "official" })).map(
    (entry) => {
      return {
        value: entry[0],
        label: entry[1],
      };
    },
  );
};

export type I18n = NonNullable<ReturnType<typeof useI18n>>;
export type Countries = ReturnType<typeof getCountries>;
