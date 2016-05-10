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
var mdSteppersTpl = "<div ng-class=\"{'vertical':stepper.vertical,'horizontal':!stepper.vertical,'mobile-step': stepper.mobileStepText }\" \n        layout=\"column\">\n    <md-toolbar flex=\"none\" class=\"step-bar md-whiteframe-1dp\" style=\"background: #f6f6f6 !important; color: #202020 !important;\">\n        <div class=\"md-toolbar-tools\">\n            <h3>\n                <span>Step {{stepper.currentStep+1}} of {{stepper.steps.length}}</span>\n            </h3>\n        </div>\n    </md-toolbar>\n    <div flex=\"none\" ng-hide=\"stepper.vertical\" layout=\"row\" class=\"step-header-bar\">\n        <div class=\"step-header\" ng-repeat=\"step in stepper.steps\" \n            md-ink-ripple layout=\"row\" flex layout-align=\"center center\" \n            ng-class=\"{'flex-none':$last, 'active':step.active}\" \n            ng-click=\"stepper.setActiveStep(step)\">\n        <div class=\"step-circle\" flex-none>{{$index+1}}</div>\n            <span class=\"label\" flex-none>{{step.label}}</span>\n            <div class=\"line\" flex></div>\n        </div>\n    </div>\n    <div class=\"steps-wrapper\" flex ng-transclude></div>\n    <div flex=\"none\" class=\"md-whiteframe-1dp step-bar\" style=\"background: #f6f6f6 !important; color: #202020 !important;\" layout=\"row\" layout-align=\"space-around\">\n        <md-button ng-click=\"stepper.previousStep()\">Back</md-button>\n        <span flex></span>\n        <md-button ng-click=\"stepper.nextStep()\">Next</md-button>\n    </div>\n</div>";
var mdStepTpl = "<div>\n      <div class=\"step-header\" md-ink-ripple layout=\"row\" ng-class=\"{'flex-none':$last, 'active':active}\">\n        <div class=\"step-circle\"></div>\n        <span class=\"label\">{{label}}</span>\n      </div>\n      <div class=\"step-content\" ng-show=\"active\">\n        <div ng-transclude></div>\n        <div class=\"step-actions\" layout=\"row\">\n          <md-button class=\"md-raised md-primary\" ng-click=\"nextStep()\">Continue</md-button>\n          <md-button class=\"md-raised\">Reset</md-button>\n          <span flex></span>\n          <md-button class=\"md-raised\">Skip</md-button>\n        </div>\n      </div>\n    </div>";
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
        template: mdSteppersTpl
    };
})
    .directive('mdStep', function () {
    return {
        require: '^^mdStepper',
        restrict: 'E',
        transclude: true,
        scope: {
            label: '@'
        },
        link: function (scope, element, attrs, mdStepper) {
            mdStepper.addStep(scope);
            scope.nextStep = mdStepper.nextStep.bind(mdStepper);
        },
        template: mdStepTpl
    };
});
