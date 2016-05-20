var StepperCtrl = (function () {
    function StepperCtrl($mdComponentRegistry, $attrs, $log) {
        this.$mdComponentRegistry = $mdComponentRegistry;
        this.$attrs = $attrs;
        this.$log = $log;
        /* End of bindings */
        this.steps = [];
        this.currentStep = 0;
    }
    StepperCtrl.prototype.$postLink = function () {
        if (!this.$attrs.id) {
            this.$log.warn('You must set an id attribute to your stepper');
        }
        this.$mdComponentRegistry.register(this, this.$attrs.id);
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
        return this.steps.push(step) - 1;
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
        if (this.currentStep < this.steps.length) {
            this.clearError();
            this.currentStep++;
            this.clearFeedback();
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
        if (this.currentStep > 0) {
            this.clearError();
            this.currentStep--;
            this.clearFeedback();
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
        var step = this.steps[this.currentStep];
        if (step.optional) {
            this.currentStep++;
            this.clearFeedback();
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
        var step = this.steps[this.currentStep];
        step.hasError = true;
        step.message = message;
        this.clearFeedback();
    };
    /**
     * Defines the current step state to "normal" and removes the message parameter on
     * title message element.
     */
    StepperCtrl.prototype.clearError = function () {
        var step = this.steps[this.currentStep];
        step.hasError = false;
    };
    /**
     * Move "active" to specified step id parameter.
     * The id used as reference is the integer number shown on the label of each step (e.g. 2).
     *
     * @param {number} stepNumber (description)
     * @returns boolean - True if move and false if not move (e.g. On id not found)
     */
    StepperCtrl.prototype.goto = function (stepNumber) {
        if (stepNumber < this.steps.length) {
            this.currentStep = stepNumber;
            this.clearFeedback();
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
    StepperCtrl.prototype.isCompleted = function (stepNumber) {
        return this.linear && stepNumber < this.currentStep;
    };
    ;
    StepperCtrl.prototype.isActiveStep = function (step) {
        return this.steps.indexOf(step) === this.currentStep;
    };
    StepperCtrl.$inject = [
        '$mdComponentRegistry',
        '$attrs',
        '$log'
    ];
    return StepperCtrl;
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
var StepCtrl = (function () {
    /**
     *
     */
    function StepCtrl($element, $compile, $scope) {
        this.$element = $element;
        this.$compile = $compile;
        this.$scope = $scope;
    }
    StepCtrl.prototype.$postLink = function () {
        this.stepNumber = this.$stepper.$addStep(this);
    };
    StepCtrl.prototype.isActive = function () {
        var state = this.$stepper.isActiveStep(this);
        return state;
    };
    StepCtrl.$inject = [
        '$element',
        '$compile',
        '$scope'
    ];
    return StepCtrl;
}());
angular.module('mdSteppers', ['ngMaterial'])
    .factory('$mdStepper', StepperServiceFactory)
    .directive('mdStepBody', ['$compile', function ($compile) {
        return {
            link: function preLink(scope, iElement) {
                var overlay = angular.element("\n                        <div class=\"md-step-body-overlay\"></div>\n                        <div class=\"md-step-body-loading\">\n                            <md-progress-circular md-mode=\"indeterminate\"></md-progress-circular>\n                        </div>\n                    ");
                $compile(overlay)(scope);
                iElement.append(overlay);
            }
        };
    }])
    .directive('mdStepper', function () {
    return {
        transclude: true,
        scope: {
            linear: '<?mdLinear',
            alternative: '<?mdAlternative',
            vertical: '<?mdVertical',
            mobileStepText: '<?mdMobileStepText'
        },
        bindToController: true,
        controller: StepperCtrl,
        controllerAs: 'stepper',
        templateUrl: 'mdSteppers/mdStepper.tpl.html'
    };
})
    .directive('mdStep', function () {
    return {
        require: '^^mdStepper',
        transclude: true,
        scope: {
            label: '@mdLabel',
            optional: '@?mdOptional'
        },
        bindToController: true,
        controller: StepCtrl,
        controllerAs: '$ctrl',
        link: function (scope, iElement, iAttrs, stepperCtrl) {
            scope.$ctrl.$stepper = stepperCtrl;
        },
        templateUrl: 'mdSteppers/mdStep.tpl.html'
    };
});
