<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('password','password-confirm'); section>
    <#if section = "header">
        ${msg("updatePasswordTitle")}
    <#elseif section = "form">
        <form id="kc-passwd-update-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcLabelWrapperClass!}">
                    <label for="password-new" class="${properties.kcLabelClass!}">${msg("passwordTitle")}</label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <div class="${properties.kcInputGroup!}">
                        <input type="password" id="password-new" name="password-new" class="${properties.kcInputClass!}"
                               autofocus autocomplete="new-password"
                               aria-invalid="<#if messagesPerField.existsError('password','password-confirm')>true</#if>"
                        />
                        <div class="${properties.kcInputShowPasswordClass!} show-password">
                            <input type="checkbox" id="showPassword" name="showPassword" class="${properties.kcInputPasswordCheckbox!}" />
                            <span>${msg("displayPassword")}</span>
                        </div>
                    </div>

                    <#if messagesPerField.existsError('password')>
                        <span id="input-error-password" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                            ${kcSanitize(messagesPerField.get('password'))?no_esc}
                        </span>
                    </#if>

                    <span id="input-error-password-requirements" class="${properties.kcInputErrorMessageClass!}" aria-live="polite" style="display:none;">
                        ${msg("passwordFormat")}
                    </span>
                </div>
            </div>

            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcLabelWrapperClass!}">
                    <label for="password-confirm" class="${properties.kcLabelClass!}">${msg("confirmPasswordTitle")}</label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <div class="${properties.kcInputGroup!}">
                        <input type="password" id="password-confirm" name="password-confirm"
                               class="${properties.kcInputClass!}"
                               autocomplete="new-password"
                               aria-invalid="<#if messagesPerField.existsError('password-confirm')>true</#if>"
                        />
                        <div class="${properties.kcInputShowPasswordClass!} show-password">
                            <input type="checkbox" id="showConfirmPassword" name="showConfirmPassword" class="${properties.kcInputPasswordCheckbox!}" />
                            <span>${msg("displayConfirmPassword")}</span>
                        </div>
                    </div>

                    <#if messagesPerField.existsError('password-confirm')>
                        <span id="input-error-password-confirm" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                            ${kcSanitize(messagesPerField.get('password-confirm'))?no_esc}
                        </span>
                    </#if>

                </div>
            </div>

            <div class="${properties.kcFormGroupClass!}">
                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <input id="submit-button" type="submit" value="${msg("doSubmit")}" />
                </div>
            </div>
        </form>

    <script lang="js">
    const showConfirmPasswordInput = document.getElementById("showConfirmPassword");
    const passwordConfirmInput = document.getElementById("password-confirm");
    const showPasswordInput = document.getElementById("showPassword");
    const passwordInput = document.getElementById("password-new");

    showPasswordInput.addEventListener("change", function () {
        if (showPasswordInput.checked) {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }
    });

    showConfirmPasswordInput.addEventListener("change", function () {
        if (showConfirmPasswordInput.checked) {
            passwordConfirmInput.type = "text";
        } else {
            passwordConfirmInput.type = "password";
        }
    });
    </script>
    </#if>
</@layout.registrationLayout>
