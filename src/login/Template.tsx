import {useState, useEffect} from "react";
import {assert} from "keycloakify/tools/assert";
import {clsx} from "keycloakify/tools/clsx";
import type {TemplateProps} from "keycloakify/login/TemplateProps";
import {getKcClsx} from "keycloakify/login/lib/kcClsx";
import {useSetClassName} from "keycloakify/tools/useSetClassName";
import {useStylesAndScripts} from "keycloakify/login/Template.useStylesAndScripts";
import type {I18n} from "./i18n";
import type {KcContext} from "./KcContext";
import {v4 as uuidv4} from 'uuid';
import queryString from 'query-string';

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const {kcClsx} = getKcClsx({doUseDefaultCss, classes});

    const {msg, msgStr, getChangeLocaleUrl, labelBySupportedLanguageTag, currentLanguageTag} = i18n;

    const {realm, locale, auth, url, message, isAppInitiatedAction} = kcContext;

    const [backgroundImage, setBackgroundImage] = useState(null);
    const [logoSite, setLogoSite] = useState(null);
    const [logoFooter, setLogoFooter] = useState(null);
    const [loginDescription, setLoginDescription] = useState(null);
    const [footerNavig, setFooterNavig] = useState(null);

    const urlBackOgs = kcContext.client.baseUrlx || 'http://192.168.1.111:3100/';

    const getMentionsLegales = (item) => {

        if (item.click == 'inscription') return;

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    dossier: 'mentions_legales',
                    origine: item.data.origine,
                    fichier: item.data.fichier,
                    id: item.data.id,
                    table: 'fichiers_preferences'
                }
            )
        };

        fetch(urlBackOgs + 'rapi/mentions_legales', requestOptions)
            .then((response) => response.blob())
            .then((blob) => {
                console.log('done')
                // Create blob link to download
                const url = window.URL.createObjectURL(
                    new Blob([blob], {type: 'application/pdf'}),
                );
                const link = document.createElement('a');
                link.href = url;
                /*link.setAttribute(
                    'download',
                    `FileName.txt`,
                );*/
                link.setAttribute(
                    'target',
                    `_blank`,
                );

                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                link.parentNode.removeChild(link);
            });
    }

    const getUrl = (item) => {
        const options = {
            dossier: 'mentions_legales',
            origine: item.data.origine,
            fichier: item.data.fichier,
            id: item.data.id,
            table: 'fichiers_preferences'
        }
        return '/rapi/mentions_legales?' + queryString.stringify(options);
    };

    const mentionsLegalesTemplate = (item) => {
        if (item.data) {
            return (<a key={uuidv4()} href={getUrl(item)} download={item.data.fichier} onClick={() => {
                //getMentionsLegales(item);
            }}>{item.label[locale.currentLanguageTag + '_' + locale.currentLanguageTag]}</a>)
        }
        if (item.label.code == 'login.INSCRIPTION') {
            return (<a key={uuidv4()} href={url.registrationUrl}>{item.label[locale.currentLanguageTag + '_' + locale.currentLanguageTag]}</a>)
        }
        return (
            <span key={uuidv4()}>{item.label[locale.currentLanguageTag + '_' + locale.currentLanguageTag]}</span>
        );
    }

    const navigationFooter = (navig) => {
        if (!navig) {
            return
        }
        return (
            <span>
                {navig.map((item, key) => (
                    <span key={uuidv4()}>{key > 0 && (
                        <span className="separatorFooter">|</span>)}{mentionsLegalesTemplate(item)}</span>
                ))}
            </span>
        );
    }


    useEffect(() => {
        //const url = kcContext.client.baseUrl || 'http://192.168.1.111:3100/';
        console.log(urlBackOgs)
        fetch(urlBackOgs + 'rapi/get_nom_site')
            .then(response => response.json())
            .then(data => {
                setBackgroundImage(data.image_accueil);
                setLogoSite(data.logo_login);
                setLogoFooter(data.logo_pdp);
                //setFooterNavig(data.login_navigation);
                const navig = navigationFooter(data.login_navigation);
                setFooterNavig(navig);
                setLoginDescription(data.login_description[locale.currentLanguageTag + '_' + locale.currentLanguageTag]);
                document.title = data.nom_site;
            });
        //document.title = 'Démo OGSC';//documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const {isReadyToRender} = useStylesAndScripts({kcContext, doUseDefaultCss});

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div className={kcClsx("col-sm-12 colLeft")}>
            <div className="col-sm-6 hidden-xs colLeft">
                <div className="backgroundColLeft" style={{backgroundImage: `url('${backgroundImage}')`}}>

                </div>
            </div>
            <div className="col-xs-12 col-sm-6 colRight">
                <div className={kcClsx("kcLoginClass")}>
                    <div className={'loginBody'}>
                        <div id="kc-header" className={kcClsx("kcHeaderClass")}>
                            <img src={logoSite} width="100%"
                                 className="logoTop"></img>
                        </div>
                        <div className={kcClsx("kcFormCardClass")}>
                            <header className={kcClsx("kcFormHeaderClass")}>
                                {realm.internationalizationEnabled && (assert(locale !== undefined), locale.supported.length > 1) && (
                                    <div className={kcClsx("kcLocaleMainClass")} id="kc-locale">
                                        <div id="kc-locale-wrapper" className={kcClsx("kcLocaleWrapperClass")}>
                                            <div id="kc-locale-dropdown"
                                                 className={clsx("menu-button-links", kcClsx("kcLocaleDropDownClass"))}>
                                                <button
                                                    tabIndex={1}
                                                    id="kc-current-locale-link"
                                                    aria-label={msgStr("languages")}
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                    aria-controls="language-switch1"
                                                >
                                                    {labelBySupportedLanguageTag[currentLanguageTag]}
                                                </button>
                                                <ul
                                                    role="menu"
                                                    tabIndex={-1}
                                                    aria-labelledby="kc-current-locale-link"
                                                    aria-activedescendant=""
                                                    id="language-switch1"
                                                    className={kcClsx("kcLocaleListClass")}
                                                >
                                                    {locale.supported.map(({languageTag}, i) => (
                                                        <li key={languageTag}
                                                            className={kcClsx("kcLocaleListItemClass")}
                                                            role="none">
                                                            <a
                                                                role="menuitem"
                                                                id={`language-${i + 1}`}
                                                                className={kcClsx("kcLocaleItemClass")}
                                                                href={getChangeLocaleUrl(languageTag)}
                                                            >
                                                                {labelBySupportedLanguageTag[languageTag]}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {(() => {
                                    if (kcContext.pageId == 'register.ftl') return null;
                                    const node = !( auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                                        <div id="kc-page-title">{loginDescription}</div>
                                    ) : (
                                        <div id="kc-username" className={kcClsx("kcFormGroupClass")}>
                                            <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                                            <a id="reset-login" href={url.loginRestartFlowUrl}
                                               aria-label={msgStr("restartLoginTooltip")}>
                                                <div className="kc-login-tooltip">
                                                    <i className={kcClsx("kcResetFlowIcon")}></i>
                                                    <span
                                                        className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                                                </div>
                                            </a>
                                        </div>
                                    );

                                    if (displayRequiredFields) {
                                        return (
                                            <div className={kcClsx("kcContentWrapperClass")}>
                                                <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                        <span className="subtitle">
                                            <span className="required">*</span>
                                            {msg("requiredFields")}
                                        </span>
                                                </div>
                                                <div className="col-md-12">{node}</div>
                                            </div>
                                        );
                                    }

                                    return node;
                                })()}
                            </header>
                            <div id="kc-content">
                                <div id="kc-content-wrapper">
                                    {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                                    {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                                        <div
                                            className={clsx(
                                                `alert-${message.type}`,
                                                kcClsx("kcAlertClass"),
                                                `pf-m-${message?.type === "error" ? "danger" : message.type}`
                                            )}
                                        >
                                            <div className="pf-c-alert__icon">
                                                {message.type === "success" &&
                                                    <span className={kcClsx("kcFeedbackSuccessIcon")}></span>}
                                                {message.type === "warning" &&
                                                    <span className={kcClsx("kcFeedbackWarningIcon")}></span>}
                                                {message.type === "error" &&
                                                    <span className={kcClsx("kcFeedbackErrorIcon")}></span>}
                                                {message.type === "info" &&
                                                    <span className={kcClsx("kcFeedbackInfoIcon")}></span>}
                                            </div>
                                            <span
                                                className={kcClsx("kcAlertTitleClass")}
                                                dangerouslySetInnerHTML={{
                                                    __html: message.summary
                                                }}
                                            />
                                        </div>
                                    )}
                                    {children}
                                    {auth !== undefined && auth.showTryAnotherWayLink && (
                                        <form id="kc-select-try-another-way-form" action={url.loginAction}
                                              method="post">
                                            <div className={kcClsx("kcFormGroupClass")}>
                                                <input type="hidden" name="tryAnotherWay" value="on"></input>
                                                <a
                                                    href="#"
                                                    id="try-another-way"
                                                    onClick={() => {
                                                        document.forms["kc-select-try-another-way-form" as never].submit();
                                                        return false;
                                                    }}
                                                >
                                                    {msg("doTryAnotherWay")}
                                                </a>
                                            </div>
                                        </form>
                                    )}
                                    {socialProvidersNode}
                                    {displayInfo && (
                                        <div id="kc-info" className={kcClsx("kcSignUpClass")}>
                                            <div id="kc-info-wrapper" className={kcClsx("kcInfoAreaWrapperClass")}>
                                                {infoNode}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'loginFooter'}>
                    <img className={'logoFooter'} src={logoFooter}></img>
                    <div>
                        {footerNavig}
                    </div>
                </div>
            </div>
        </div>
    );
}
