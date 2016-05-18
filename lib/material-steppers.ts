class Stepper {

    public steps = [];
    public currentStep = 0;

    constructor() {
        this.steps;
    }

    getActiveStep() {
        return this.steps.filter((step) => step.active)[0];
    }

    setActiveStep(step) {
        this.steps.forEach((_step, index) => {
            _step.active = false;
            if (_step === step) {
                this.currentStep = index;
            }
        });
        step.active = true;
    }
    nextStep() {
        let activeStep = this.getActiveStep();
        let nextStep = this.steps[this.steps.indexOf(activeStep) + 1];
        if (nextStep) {
            activeStep.active = false;
            nextStep.active = true;
            this.currentStep++;
        }
    }
    previousStep() {
        let activeStep = this.getActiveStep();
        let previousStep = this.steps[this.steps.indexOf(activeStep) - 1];
        if (previousStep) {
            activeStep.active = false;
            previousStep.active = true;
            this.currentStep--;
        }
    };

    addStep(step) {
        if (this.steps.length === 0) {
            this.setActiveStep(step);
        }
        this.steps.push(step);
    }
}

angular.module('mdSteppers', ['ngMaterial'])
    .directive('mdStepper', () => {
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
    .directive('mdStep', () => {
        return {
            require: '^^mdStepper',
            restrict: 'E',
            transclude: true,
            scope: {
                label: '@',
                next: '&onNext'
            },
            link: function (scope, element, attrs, mdStepper: Stepper) {
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
