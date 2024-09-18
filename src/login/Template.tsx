import {useEffect} from "react";
import {assert} from "keycloakify/tools/assert";
import {clsx} from "keycloakify/tools/clsx";
import type {TemplateProps} from "keycloakify/login/TemplateProps";
import {getKcClsx} from "keycloakify/login/lib/kcClsx";
import {useSetClassName} from "keycloakify/tools/useSetClassName";
import {useStylesAndScripts} from "keycloakify/login/Template.useStylesAndScripts";
import type {I18n} from "./i18n";
import type {KcContext} from "./KcContext";

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

    useEffect(() => {
        document.title = 'Démo OGSC';//documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
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
                <div className="backgroundColLeft">

                </div>
            </div>

            <div className="col-xs-12 col-sm-6 colRight">
                <div className={kcClsx("kcLoginClass")}>
                    <div className={'loginBody'}>
                        <div id="kc-header" className={kcClsx("kcHeaderClass")}>
                            <img src={`${import.meta.env.BASE_URL}logo-header-demo.png`} width="100%"
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
                                    const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                                        <div id="kc-page-title">{headerNode}</div>
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
                                                <div className="col-md-10">{node}</div>
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
                    <img className={'logoFooter'} src={`${import.meta.env.BASE_URL}logo-orgasoftware.svg`}></img>
                    <div>
                        <a href="" className="">Apply</a>
                        <span className="separatorFooter">|</span>
                        <span>Version 4.3.0 - KC</span>
                        <span className="separatorFooter">|</span>
                        <a href="" className="">Privacy policy</a>
                        <span className="separatorFooter">|</span>
                        <a href="">Legal terms</a>
                        <span className="separatorFooter" ng-if="mentions_legales">|</span>
                        <span>© All right reserved ORGASOFTWARE</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
