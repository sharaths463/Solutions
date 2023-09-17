if (typeof (TFL) === "undefined") {
    TFL = {
        __namespace: true
    };
}

if (typeof (TFL.scripts) === "undefined") {
    TFL.scripts = {
        __namespace: true
    };
}

if (typeof (TFL.scripts.Case) === "undefined") {
    TFL.scripts.Case = {
        __namespace: true
    };
}

TFL.scripts.Case.Events = (function () {
    "use strict"
    var showHideResolveButton = function (formContext) {        
            var showResolveButton = TFL.scripts.Case.Business.CheckIfUserIsCustomerServiceManager(formContext);
            return showResolveButton;
    };

    var onChangeOfCreateFollowUp = function (executionContext) {
        TFL.scripts.Case.Business.OnChangeOfCreateFollowUp(executionContext);
    }

    var onLoad = function (executionContext) {
        TFL.scripts.Case.Business.LockFieldsonBPF(executionContext);
    }

    var onSave = function (executionContext) {
        TFL.scripts.Case.Business.LockFieldsonBPF(executionContext);
    }

    return {
        ShowHideResolveButton: showHideResolveButton,
        OnChangeOfCreateFollowUp: onChangeOfCreateFollowUp,
        OnLoad: onLoad,
        OnSave: onSave
    };
})();