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

TFL.scripts.Case.Business = (function () {
    "use strict";
    var checkIfUserIsCustomerServiceManager = function (formContext) {        
        try {
            var roles = Xrm.Utility.getGlobalContext().userSettings.roles;
            if (roles === null) return false;
            var isCustomerServiceManager = false;
            roles.forEach(function (item) {
                if (item.name.toLowerCase() === "tfl - customer service manager") {
                    isCustomerServiceManager = true;
                }
            });
            return isCustomerServiceManager;        
                                  
        }
        catch (ex) {
            console.log("Error in showHideResolveButton: " + ex.message);            
        }
       
    };

    var onChangeOfCreateFollowUp = function (executionContext) {
        try {
            var formContext = executionContext.getFormContext();
            var isCreateFollowUp = formContext.getControl("header_process_tfl_createfollowupactivity").getAttribute().getValue();
            if (isCreateFollowUp === true) {
                var confirmStrings = {
                    text: "Are you sure you want to create a follow-up Request",
                    title: "Create Follow Up Request",
                    confirmButtonLabel: "Yes",
                    cancelButtonLabel: "No"
                };
                var confirmOptions = {
                    height: 200,
                    width: 450
                };
                Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(function (success) {
                    if (success.confirmed) {
                        formContext.data.refresh(true);
                    }
                    else {
                        formContext.getControl("header_process_tfl_createfollowupactivity").getAttribute().setValue(false);
                    }
                        
                });
            }
            
        } catch (ex) {
            console.log("Exception message in onChangeOfCreateFollowUp" + ex.message);
        }
    };

    var lockFieldsOnBPF = function (executionContext) {
        try {
            var formContext = executionContext.getFormContext();
            var stageName = formContext.data.process.getActiveStage().getName();
            if (stageName.toLowerCase() !== "new request") {
                formContext.getControl("header_process_tfl_caseclassification").setDisabled(true);
                formContext.getControl("header_process_casetypecode").setDisabled(true);
                formContext.getControl("header_process_tfl_caseclassification_1").setDisabled(true);
                formContext.getControl("header_process_casetypecode_1").setDisabled(true);
            }
            
            
            var createFollowUp = formContext.getControl("header_process_tfl_createfollowupactivity").getAttribute().getValue();
            if (createFollowUp === true) formContext.getControl("header_process_tfl_createfollowupactivity").setDisabled(true);
            
            formContext.getControl("header_process_statecode").setDisabled(true);
        } catch (ex) {
            console.log("Exception message in lockFieldsOnBPF" + ex.message);
        }       
        
    };

    return {
        CheckIfUserIsCustomerServiceManager: checkIfUserIsCustomerServiceManager,
        OnChangeOfCreateFollowUp: onChangeOfCreateFollowUp,
        LockFieldsonBPF:lockFieldsOnBPF
    };
})();