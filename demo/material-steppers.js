var StepperCtrl = (function () {
    function StepperCtrl($mdComponentRegistry, $attrs, $log) {
        this.$mdComponentRegistry = $mdComponentRegistry;
        this.$attrs = $attrs;
        this.$log = $log;
        this.labelStep = 'Step';
        this.labelOf = 'of';
        /* End of bindings */
        this.steps = [];
        this.currentStepNumber = 0;
        this.activeStepNumber = 0;
    }
    Object.defineProperty(StepperCtrl.prototype, "currentStep", {
        get: function () { return this.steps[this.currentStepNumber]; },
        enumerable: true,
        configurable: true
    });
    StepperCtrl.prototype.$onInit = function () {
        if (this.$attrs.mdMobileStepText === '') {
            this.mobileStepText = true;
        }
        if (this.$attrs.mdLinear === '') {
            this.linear = true;
        }
        if (this.$attrs.mdAlternative === '') {
            this.alternative = true;
        }
    };
    StepperCtrl.prototype.$postLink = function () {
        if (!this.$attrs.id) {
            this.$log.warn('You must set an id attribute to your stepper');
        }
        this.registeredStepper = this.$mdComponentRegistry.register(this, this.$attrs.id);
    };
    StepperCtrl.prototype.$onDestroy = function () {
        this.registeredStepper && this.registeredStepper();
    };
    /**
     * Register component step to this stepper.
     *
     * @param {StepCtrl} step The step to add.
     * @returns number - The step number.
     */
    StepperCtrl.prototype.$addStep = function (step) {
        var number = this.steps.push(step) - 1;
        if (number === 0 && step.onActivate) {
            step.onActivate();
        }
        return number;
    };
    /**
     * Complete the current step and move one to the next.
     * Using this method on editable steps (in linear stepper)
     * it will search by the next step without "completed" state to move.
     * When invoked it dispatch the event onstepcomplete to the step element.
     *
     * @returns boolean - True if move and false if not move (e.g. On the last step)
     */
    StepperCtrl.prototype.next = function () {
        if (this.currentStepNumber < this.steps.length) {
            this.completeStep();
            if (this.currentStep.onDeactivate) {
                this.currentStep.onDeactivate();
            }
            this.currentStepNumber++;
            this.activeStepNumber = this.currentStepNumber;
            this.clearFeedback();
            if (this.currentStep.onActivate) {
                this.currentStep.onActivate();
            }
            return true;
        }
        return false;
    };
    /**
     * Move to the previous step without change the state of current step.
     * Using this method in linear stepper it will check if previous step is editable to move.
     *
     * @returns boolean - True if move and false if not move (e.g. On the first step)
     */
    StepperCtrl.prototype.back = function () {
        if (this.currentStepNumber > 0) {
            this.clearError();
            if (this.currentStep.onDeactivate) {
                this.currentStep.onDeactivate();
            }
            this.currentStepNumber--;
            this.activeStepNumber = this.currentStepNumber;
            this.currentStep.completed = false;
            this.clearFeedback();
            if (this.currentStep.onActivate) {
                this.currentStep.onActivate();
            }
            return true;
        }
        return false;
    };
    /**
     * Move to the next step without change the state of current step.
     * This method works only in optional steps.
     *
     * @returns boolean - True if move and false if not move (e.g. On non-optional step)
     */
    StepperCtrl.prototype.skip = function () {
        if (!this.linear || this.currentStep.optional) {
            if (this.currentStep.onDeactivate) {
                this.currentStep.onDeactivate();
            }
            this.currentStepNumber++;
            this.clearFeedback();
            if (this.currentStep.onActivate) {
                this.currentStep.onActivate();
            }
            return true;
        }
        return false;
    };
    /**
     * Defines the current step state to "error" and shows the message parameter on
     * title message element.When invoked it dispatch the event onsteperror to the step element.
     *
     * @param {string} message The error message
     */
    StepperCtrl.prototype.error = function (message) {
        this.currentStep.hasError = true;
        this.currentStep.message = message;
        this.clearFeedback();
    };
    /**
     * Defines the current step state to "normal" and removes the message parameter on
     * title message element.
     */
    StepperCtrl.prototype.clearError = function () {
        this.currentStep.hasError = false;
    };
    StepperCtrl.prototype.completeStep = function () {
        for (var stepNumber = this.currentStepNumber; stepNumber < this.steps.length; stepNumber++) {
            this.steps[stepNumber].completed = false;
        }
        this.currentStep.hasError = false;
        this.currentStep.completed = true;
    };
    /**
     * Move "active" to specified step id parameter.
     * The id used as reference is the integer number shown on the label of each step (e.g. 2).
     *
     * @param {number} stepNumber (description)
     * @returns boolean - True if move and false if not move (e.g. On id not found)
     */
    StepperCtrl.prototype.goto = function (stepNumber) {
        if (0 <= stepNumber && stepNumber < this.steps.length) {
            if (this.currentStep.onDeactivate) {
                this.currentStep.onDeactivate();
            }
            this.currentStepNumber = stepNumber;
            this.clearFeedback();
            if (this.currentStep.onActivate) {
                this.currentStep.onActivate();
            }
            return true;
        }
        return false;
    };
    /**
     * Shows a feedback message and a loading indicador.
     *
     * @param {string} [message] The feedbackMessage
     */
    StepperCtrl.prototype.showFeedback = function (message) {
        this.hasFeedback = true;
        this.feedbackMessage = message;
    };
    /**
     * Removes the feedback.
     */
    StepperCtrl.prototype.clearFeedback = function () {
        this.hasFeedback = false;
    };
    Object.defineProperty(StepperCtrl.prototype, "stepperClasses", {
        get: function () {
            return {
                'md-steppers-linear': this.linear,
                'md-steppers-alternative': this.alternative,
                'md-steppers-vertical': this.vertical,
                'md-steppers-mobile-step-text': this.mobileStepText,
                'md-steppers-has-feedback': this.hasFeedback
            };
        },
        enumerable: true,
        configurable: true
    });
    StepperCtrl.$inject = [
        '$mdComponentRegistry',
        '$attrs',
        '$log'
    ];
    return StepperCtrl;
}());
var StepCtrl = (function () {
    function StepCtrl($attrs) {
        this.$attrs = $attrs;
        /* End of bindings */
        this.completed = false;
        this.hasError = false;
    }
    Object.defineProperty(StepCtrl.prototype, "isCurrent", {
        get: function () { return this.stepNumber === this.$stepper.currentStepNumber; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StepCtrl.prototype, "isDisabled", {
        get: function () { return this.$stepper.linear && !(this.isCompleted && this.isEditable) && !this.isActive || (this.isCurrent && this.isActive); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StepCtrl.prototype, "isCompleted", {
        get: function () { return this.completed; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StepCtrl.prototype, "isActive", {
        get: function () { return this.stepNumber === this.$stepper.activeStepNumber; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StepCtrl.prototype, "isEditable", {
        get: function () { return this.editable; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StepCtrl.prototype, "isEditing", {
        get: function () { return this.isCompleted && this.isEditable && this.isCurrent; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StepCtrl.prototype, "isBetweenAC", {
        get: function () { return this.$stepper.currentStepNumber < this.stepNumber && this.stepNumber < this.$stepper.activeStepNumber; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StepCtrl.prototype, "hasOptional", {
        get: function () { return Boolean(this.optional || this.hasError); },
        enumerable: true,
        configurable: true
    });
    StepCtrl.prototype.$onInit = function () {
        if (this.$attrs.mdEditable === '') {
            this.editable = true;
        }
    };
    StepCtrl.prototype.$postLink = function () {
        this.stepNumber = this.$stepper.$addStep(this);
    };
    Object.defineProperty(StepCtrl.prototype, "buttonClasses", {
        get: function () {
            return {
                'md-active': this.isCurrent,
                'md-completed': this.isCompleted && !this.isBetweenAC,
                'md-error': this.hasError,
                'md-stepper-optional': this.hasOptional,
                'md-editable': this.isEditable,
                'md-hoverable': !this.isEditing && (this.isActive || this.isEditable && this.isCompleted),
            };
        },
        enumerable: true,
        configurable: true
    });
    StepCtrl.prototype.activate = function () {
        this.$stepper.goto(this.stepNumber);
    };
    StepCtrl.$inject = [
        '$attrs'
    ];
    return StepCtrl;
}());
var StepperServiceFactory = ['$mdComponentRegistry',
    function ($mdComponentRegistry) {
        return function (handle) {
            var instance = $mdComponentRegistry.get(handle);
            if (!instance) {
                $mdComponentRegistry.notFoundError(handle);
            }
            return instance;
        };
    }];
angular.module('mdSteppers', ['material.components.icon'])
    .factory('$mdStepper', StepperServiceFactory)
    .directive('mdStepper', function () {
    return {
        transclude: true,
        scope: {
            linear: '<?mdLinear',
            alternative: '<?mdAlternative',
            vertical: '<?mdVertical',
            mobileStepText: '<?mdMobileStepText',
            labelStep: '@?mdLabelStep',
            labelOf: '@?mdLabelOf'
        },
        bindToController: true,
        controller: StepperCtrl,
        controllerAs: 'stepper',
        templateUrl: 'mdSteppers/mdStepper.tpl.html'
    };
})
    .directive('mdStep', ['$compile', function ($compile) {
        return {
            require: '^^mdStepper',
            transclude: true,
            scope: {
                label: '@mdLabel',
                optional: '@?mdOptional',
                editable: '<?mdEditable',
                onActivate: '&?onActivate',
                onDeactivate: '&?onDeactivate',
            },
            bindToController: true,
            controller: StepCtrl,
            controllerAs: '$ctrl',
            link: function (scope, iElement, iAttrs, stepperCtrl) {
                function addOverlay() {
                    var hasOverlay = !!iElement.find('.md-step-body-overlay')[0];
                    if (!hasOverlay) {
                        var overlay = angular.element("\n                            <div class=\"md-step-body-overlay\"></div>\n                            <div class=\"md-step-body-loading\">\n                                <md-progress-circular md-mode=\"indeterminate\"></md-progress-circular>\n                            </div>\n                        ");
                        $compile(overlay)(scope);
                        iElement.find('md-steppers-scope').append(overlay);
                    }
                }
                scope.$ctrl.$stepper = stepperCtrl;
                scope.$watch(function () {
                    return scope.$ctrl.isCurrent;
                }, function (isCurrent) {
                    if (isCurrent) {
                        iElement.addClass('md-active');
                        addOverlay();
                    }
                    else {
                        iElement.removeClass('md-active');
                    }
                });
            },
            templateUrl: 'mdSteppers/mdStep.tpl.html'
        };
    }])
    .directive('mdStepButton', function () {
    return {
        scope: {
            $step: '<step',
        },
        replace: true,
        templateUrl: 'mdSteppers/mdStepButton.tpl.html'
    };
})
    .config(['$mdIconProvider', function ($mdIconProvider) {
        $mdIconProvider.icon('steppers-check', 'mdSteppers/ic_check_24px.svg');
        $mdIconProvider.icon('steppers-warning', 'mdSteppers/ic_warning_24px.svg');
        $mdIconProvider.icon('steppers-edit', 'mdSteppers/ic_edit_24px.svg');
    }])
    .run(["$templateCache", function ($templateCache) {
        $templateCache.put("mdSteppers/ic_check_24px.svg", "<svg height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\">\r\n    <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\r\n    <path d=\"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z\"/>\r\n</svg>");
        $templateCache.put("mdSteppers/ic_warning_24px.svg", "<svg height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\">\r\n    <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\r\n    <path d=\"M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z\"/>\r\n</svg>");
        $templateCache.put("mdSteppers/ic_edit_24px.svg", "<svg height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\">\r\n    <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\r\n    <path d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z\"/>\r\n</svg>");
    }]);

angular.module("mdSteppers").run(["$templateCache", function($templateCache) {$templateCache.put("mdSteppers/mdStep.tpl.html","<div class=\"md-stepper\" ng-class=\"{ \'md-active\'  : $ctrl.isCurrent }\">\n    <md-steppers-header class=\"md-steppers-header md-steppers-vertical\">\n        <md-step-button step=\"$ctrl\"></md-step-button>\n\n        <div class=\"md-stepper-feedback-message\" ng-show=\"$ctrl.$stepper.hasFeedback\">\n            {{$ctrl.$stepper.feedbackMessage}}\n        </div>\n    </md-steppers-header>\n    <md-steppers-scope layout=\"column\" class=\"md-steppers-scope\" ng-if=\"$ctrl.isCurrent\" ng-transclude></md-steppers-scope>\n</div>\n");
$templateCache.put("mdSteppers/mdStepButton.tpl.html","<button\n    class=\"md-stepper-indicator\"\n    ng-class=\"$step.buttonClasses\"\n    ng-click=\"$step.activate()\"\n    ng-disabled=\"$step.isDisabled\"\n>\n    <div class=\"md-stepper-indicator-wrapper\">\n        <div class=\"md-stepper-number\" ng-hide=\"$step.hasError\">\n            <span ng-if=\"!$step.isCompleted || ($step.isCurrent && !$step.isEditing)\">{{ ::$step.stepNumber + 1 }}</span>\n            <md-icon\n                md-svg-icon=\"{{ $step.isEditing ? \'steppers-edit\' : \'steppers-check\' }}\"\n                class=\"md-stepper-icon\"\n                ng-if=\"$step.isCompleted && (!$step.isCurrent || $step.isEditing)\"\n            ></md-icon>\n        </div>\n\n        <div class=\"md-stepper-error-indicator\" ng-show=\"$step.hasError\">\n            <md-icon md-svg-icon=\"steppers-warning\"></md-icon>\n        </div>\n\n        <div class=\"md-stepper-title\">\n            <span>{{ $step.label }}</span>\n            <small ng-if=\"$step.optional && !$step.hasError\">{{ $step.optional }}</small>\n            <small class=\"md-stepper-error-message\" ng-show=\"$step.hasError\">\n                {{ $step.message }}\n            </small>\n        </div>\n    </div>\n</button>\n");
$templateCache.put("mdSteppers/mdStepper.tpl.html","<div\n    flex\n    class=\"md-steppers\"\n    ng-class=\"stepper.stepperClasses\"\n>\n    <div class=\"md-steppers-header-region\">\n        <md-steppers-header class=\"md-steppers-header md-steppers-horizontal md-whiteframe-1dp\">\n            <md-step-button ng-repeat=\"$step in stepper.steps\" step=\"$step\"></md-step-button>\n        </md-steppers-header>\n\n        <md-steppers-mobile-header class=\"md-steppers-mobile-header\">\n            <md-toolbar flex=\"none\" class=\"md-whiteframe-1dp\" style=\"background: #f6f6f6 !important; color: #202020 !important;\">\n                <div class=\"md-toolbar-tools\">\n                    <h3>\n                        <span>{{stepper.labelStep}} {{stepper.currentStepNumber+1}} {{stepper.labelOf}} {{stepper.steps.length}}</span>\n                    </h3>\n                </div>\n            </md-toolbar>\n        </md-steppers-mobile-header>\n\n        <div class=\"md-stepper-feedback-message\" ng-show=\"stepper.hasFeedback\">\n            {{stepper.feedbackMessage}}\n        </div>\n    </div>\n    <md-steppers-content class=\"md-steppers-content\" ng-transclude></md-steppers-content>\n    <div class=\"md-steppers-overlay\"></div>\n</div>\n");}]);