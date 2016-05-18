var Stepper = (function () {
    function Stepper() {
        this.steps = [];
        this.currentStep = 0;
        this.steps;
    }
    Stepper.prototype.getActiveStep = function () {
        return this.steps.filter(function (step) { return step.active; })[0];
    };
    Stepper.prototype.setActiveStep = function (step) {
        var _this = this;
        this.steps.forEach(function (_step, index) {
            _step.active = false;
            if (_step === step) {
                _this.currentStep = index;
            }
        });
        step.active = true;
    };
    Stepper.prototype.nextStep = function () {
        var activeStep = this.getActiveStep();
        var nextStep = this.steps[this.steps.indexOf(activeStep) + 1];
        if (nextStep) {
            activeStep.active = false;
            nextStep.active = true;
            this.currentStep++;
        }
    };
    Stepper.prototype.previousStep = function () {
        var activeStep = this.getActiveStep();
        var previousStep = this.steps[this.steps.indexOf(activeStep) - 1];
        if (previousStep) {
            activeStep.active = false;
            previousStep.active = true;
            this.currentStep--;
        }
    };
    ;
    Stepper.prototype.addStep = function (step) {
        if (this.steps.length === 0) {
            this.setActiveStep(step);
        }
        this.steps.push(step);
    };
    return Stepper;
}());
angular.module('mdSteppers', ['ngMaterial'])
    .directive('mdStepper', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            vertical: '=',
            mobileStepText: '@'
        },
        controller: Stepper,
        bindToController: true,
        controllerAs: 'stepper',
        templateUrl: 'mdSteppers/mdStepper.tpl.html'
    };
})
    .directive('mdStep', function () {
    return {
        require: '^^mdStepper',
        restrict: 'E',
        transclude: true,
        scope: {
            label: '@',
            next: '&onNext'
        },
        link: function (scope, element, attrs, mdStepper) {
            mdStepper.addStep(scope);
            scope.nextStep = function () {
                var isValid = scope.next();
                if (isValid) {
                    mdStepper.nextStep();
                }
            };
        },
        templateUrl: 'mdSteppers/mdStep.tpl.html'
    };
});
