var StepperDemoController = (function () {
    function StepperDemoController($mdStepper, $timeout) {
        this.$mdStepper = $mdStepper;
        this.$timeout = $timeout;
        this.isVertical = false;
        this.isLinear = true;
        this.isAlternative = true;
        this.isMobileStepText = true;
        this.campaign = false;
    }
    StepperDemoController.prototype.selectCampaign = function () {
        var _this = this;
        var steppers = this.$mdStepper('stepper-demo');
        steppers.showFeedback('Checking, please wait ...');
        this.$timeout(function () {
            if (_this.campaign) {
                steppers.clearError();
                steppers.next();
            }
            else {
                _this.campaign = !_this.campaign;
                steppers.error('Wrong campaign');
            }
        }, 3000);
    };
    StepperDemoController.prototype.previousStep = function () {
        var steppers = this.$mdStepper('stepper-demo');
        steppers.back();
    };
    StepperDemoController.prototype.cancel = function () {
        var steppers = this.$mdStepper('stepper-demo');
        steppers.back();
    };
    StepperDemoController.prototype.nextStep = function () {
        var steppers = this.$mdStepper('stepper-demo');
        steppers.next();
    };
    StepperDemoController.prototype.toggleMobileStepText = function () {
        this.isMobileStepText = !this.isMobileStepText;
    };
    StepperDemoController.prototype.toggleLinear = function () {
        this.isLinear = !this.isLinear;
    };
    StepperDemoController.prototype.toggleAlternative = function () {
        this.isAlternative = !this.isAlternative;
    };
    StepperDemoController.prototype.toggleVertical = function () {
        this.isVertical = !this.isVertical;
    };
    StepperDemoController.prototype.showError = function () {
        var steppers = this.$mdStepper('stepper-demo');
        steppers.error('Wrong campaign');
    };
    StepperDemoController.prototype.clearError = function () {
        var steppers = this.$mdStepper('stepper-demo');
        steppers.clearError();
    };
    StepperDemoController.prototype.showFeedback = function () {
        var steppers = this.$mdStepper('stepper-demo');
        steppers.showFeedback('Step 1 looks great! Step 2 is comming up.');
    };
    StepperDemoController.prototype.clearFeedback = function () {
        var steppers = this.$mdStepper('stepper-demo');
        steppers.clearFeedback();
    };
    StepperDemoController.$inject = [
        '$mdStepper',
        '$timeout'
    ];
    return StepperDemoController;
}());


angular.module('SteppersApp', [
    'ngMaterial',
    'mdSteppers'
]).controller('SteppersDemoCtrl', StepperDemoController);

