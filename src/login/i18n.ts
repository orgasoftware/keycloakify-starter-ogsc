import { createUseI18n } from "keycloakify/login";

export const { useI18n, ofTypeI18n } = createUseI18n({
    en: {
        loginAccountTitle: 'Welcome to the SRM demo platform.',
        usernameOrEmail: 'Email address'
    },
    fr: {
        loginAccountTitle: 'Bienvenue sur la plateforme de démonstration SRM.',
        usernameOrEmail: 'Adresse email'
    }
});

export type I18n = typeof ofTypeI18n;
