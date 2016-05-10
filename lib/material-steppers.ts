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

let mdSteppersTpl = `<div ng-class="{'vertical':stepper.vertical,'horizontal':!stepper.vertical,'mobile-step': stepper.mobileStepText }">
      <md-toolbar ng-if="stepper.mobileStepText" class="md-whiteframe-1dp" style="background: #f6f6f6 !important; color: #202020 !important;">
        <div class="md-toolbar-tools">
          <h3>
        <span>Step {{stepper.currentStep+1}} of {{stepper.steps.length}}</span>
      </h3>
        </div>
      </md-toolbar>
      <div ng-if="!stepper.mobileStepText" ng-hide="stepper.vertical" layout="row">
        <div class="step-header" ng-repeat="step in stepper.steps" md-ink-ripple layout="row" flex layout-align="center center" ng-class="{'flex-none':$last, 'active':step.active}" ng-click="stepper.setActiveStep(step)">
          <div class="step-circle" flex-none>{{$index+1}}</div>
          <span class="label" flex-none>{{step.label}}</span>
          <div class="line" flex></div>
        </div>
      </div>
      <div ng-transclude></div>
      <div ng-if="stepper.mobileStepText" class="md-whiteframe-1dp" style="background: #f6f6f6 !important; color: #202020 !important;" layout="row" layout-align="space-around">
          <md-button ng-click="stepper.previousStep()">Back</md-button>
          <span flex></span>
          <md-button ng-click="stepper.nextStep()">Next</md-button>
        </div>
    </div>`;

let mdStepTpl = `<div>
      <div class="step-header" md-ink-ripple layout="row" ng-class="{'flex-none':$last, 'active':active}">
        <div class="step-circle"></div>
        <span class="label">{{label}}</span>
      </div>
      <div class="step-content" ng-show="active">
        <div ng-transclude></div>
        <div class="step-actions" layout="row">
          <md-button class="md-raised md-primary" ng-click="nextStep()">Continue</md-button>
          <md-button class="md-raised">Reset</md-button>
          <span flex></span>
          <md-button class="md-raised">Skip</md-button>
        </div>
      </div>
    </div>`;

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
            template: mdSteppersTpl
        }
    })
    .directive('mdStep', () => {
        return {
            require: '^^mdStepper',
            restrict: 'E',
            transclude: true,
            scope: {
                label: '@'
            },
            link: function (scope, element, attrs, mdStepper: Stepper) {
                mdStepper.addStep(scope);
                scope.nextStep = mdStepper.nextStep;
            },
            template: mdStepTpl
        }
    });