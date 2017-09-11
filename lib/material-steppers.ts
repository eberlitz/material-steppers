class StepperCtrl {

    public static $inject = [
        '$mdComponentRegistry',
        '$attrs',
        '$log'
    ];

    /* Bindings */

    public linear: boolean;
    public alternative: boolean;
    public vertical: boolean;
    public mobileStepText: boolean;
    public labelStep: string = 'Step';
    public labelOf: string = 'of';

    /* End of bindings */

    public steps = [];
    public currentStepNumber = 0;
    public activeStepNumber = 0;

    private hasFeedback: boolean;
    private feedbackMessage: string;
    private registeredStepper;

    public get currentStep(): StepCtrl { return this.steps[this.currentStepNumber]; }

    constructor(
        private $mdComponentRegistry,
        private $attrs,
        private $log
    ) { }


    $onInit() {
        if (this.$attrs.mdMobileStepText === '') {
            this.mobileStepText = true;
        }
        if (this.$attrs.mdLinear === '') {
            this.linear = true;
        }
        if (this.$attrs.mdAlternative === '') {
            this.alternative = true;
        }
    }

    $postLink() {
        if (!this.$attrs.id) {
            this.$log.warn('You must set an id attribute to your stepper');
        }
        this.registeredStepper = this.$mdComponentRegistry.register(this, this.$attrs.id);
    }

    $onDestroy() {
        this.registeredStepper && this.registeredStepper();
    }

    /**
     * Register component step to this stepper.
     * 
     * @param {StepCtrl} step The step to add.
     * @returns number - The step number.
     */
    $addStep(step: StepCtrl) {
        let number = this.steps.push(step) - 1;
        if (number === 0 && step.onActivate) {
            step.onActivate();
        }
        return number;
    }

    /**
     * Complete the current step and move one to the next. 
     * Using this method on editable steps (in linear stepper) 
     * it will search by the next step without "completed" state to move. 
     * When invoked it dispatch the event onstepcomplete to the step element.
     * 
     * @returns boolean - True if move and false if not move (e.g. On the last step)
     */
    public next() {
        if (this.currentStepNumber < this.steps.length) {
            this.completeStep();
            if (this.currentStep.onDeactivate) { this.currentStep.onDeactivate(); }
            this.currentStepNumber++;
            this.activeStepNumber = this.currentStepNumber;
            this.clearFeedback();
            if (this.currentStep.onActivate) { this.currentStep.onActivate(); }
            return true;
        }
        return false;
    }

    /**
     * Move to the previous step without change the state of current step. 
     * Using this method in linear stepper it will check if previous step is editable to move.
     * 
     * @returns boolean - True if move and false if not move (e.g. On the first step)
     */
    public back() {
        if (this.currentStepNumber > 0) {
            this.clearError();
            if (this.currentStep.onDeactivate) { this.currentStep.onDeactivate(); }
            this.currentStepNumber--;
            this.activeStepNumber = this.currentStepNumber;
            this.currentStep.completed = false;
            this.clearFeedback();
            if (this.currentStep.onActivate) { this.currentStep.onActivate(); }
            return true;
        }
        return false;
    }

    /**
     * Move to the next step without change the state of current step. 
     * This method works only in optional steps.
     * 
     * @returns boolean - True if move and false if not move (e.g. On non-optional step)
     */
    public skip() {
        if (!this.linear || this.currentStep.optional) {
            if (this.currentStep.onDeactivate) { this.currentStep.onDeactivate(); }
            this.currentStepNumber++;
            this.clearFeedback();
            if (this.currentStep.onActivate) { this.currentStep.onActivate(); }
            return true;
        }
        return false;
    }


    /**
     * Defines the current step state to "error" and shows the message parameter on 
     * title message element.When invoked it dispatch the event onsteperror to the step element.
     * 
     * @param {string} message The error message
     */
    public error(message: string) {
        this.currentStep.hasError = true;
        this.currentStep.message = message;
        this.clearFeedback();
    }

    /**
     * Defines the current step state to "normal" and removes the message parameter on 
     * title message element.
     */
    public clearError() {
        this.currentStep.hasError = false;
    }

    public completeStep() {
        for (let stepNumber = this.currentStepNumber; stepNumber < this.steps.length; stepNumber++) {
            this.steps[stepNumber].completed = false;
        }
        this.currentStep.hasError = false;
        this.currentStep.completed = true;
    }

    /**
     * Move "active" to specified step id parameter. 
     * The id used as reference is the integer number shown on the label of each step (e.g. 2).
     * 
     * @param {number} stepNumber (description)
     * @returns boolean - True if move and false if not move (e.g. On id not found)
     */
    public goto(stepNumber: number) {
        if (0 <= stepNumber && stepNumber < this.steps.length) {
            if (this.currentStep.onDeactivate) { this.currentStep.onDeactivate(); }
            this.currentStepNumber = stepNumber;
            this.clearFeedback();
            if (this.currentStep.onActivate) { this.currentStep.onActivate(); }
            return true;
        }
        return false;
    }

    /**
     * Shows a feedback message and a loading indicador.
     * 
     * @param {string} [message] The feedbackMessage
     */
    public showFeedback(message?: string) {
        this.hasFeedback = true;
        this.feedbackMessage = message;
    }

    /**
     * Removes the feedback.
     */
    public clearFeedback() {
        this.hasFeedback = false;
    }

    public get stepperClasses() {
        return {
            'md-steppers-linear'          : this.linear,
            'md-steppers-alternative'     : this.alternative,
            'md-steppers-vertical'        : this.vertical,
            'md-steppers-mobile-step-text': this.mobileStepText,
            'md-steppers-has-feedback'    : this.hasFeedback
        };
    }
}


class StepCtrl {

    public static $inject = [
        '$attrs'
    ];

    /* Bindings */

    public label   : string;
    public optional: string;
    public editable: boolean;
    public onActivate;
    public onDeactivate;
    public onClick;
    public onInitialized;

    /* End of bindings */

    public completed : boolean = false;
    public stepNumber: number;
    public hasError  : boolean = false;
    public message   : string;
    public $stepper  : StepperCtrl;

    public get isCurrent()      :boolean { return this.stepNumber === this.$stepper.currentStepNumber; }
    public get isDisabled()     :boolean { return this.$stepper.linear && !(this.isCompleted && this.isEditable) && !this.isActive && !this.isClickable || this.isCurrent; }
    public get isCompleted()    :boolean { return this.completed; }
    public get isActive()       :boolean { return this.stepNumber === this.$stepper.activeStepNumber; }
    public get isEditable()     :boolean { return this.editable; }
    public get isEditing()      :boolean { return this.isCompleted && this.isEditable && this.isCurrent; }
    public get isBetweenAC()    :boolean { return this.$stepper.currentStepNumber < this.stepNumber && this.stepNumber < this.$stepper.activeStepNumber; }
    public get isClickable()    :boolean { return Boolean(this.onClick); }
    public get hasOptional()    :boolean { return Boolean(this.optional || this.hasError); }

    constructor(
        private $attrs
    ) { }

    $onInit() {
        if (this.$attrs.mdEditable === '') {
            this.editable = true;
        }
        if (this.onInitialized) {
            this.onInitialized();
        }
    }

    $postLink() {
        this.stepNumber = this.$stepper.$addStep(this);
    }

    public get buttonClasses() {
        return {
            'md-active'          : this.isCurrent,
            'md-completed'       : this.isCompleted && !this.isBetweenAC,
            'md-error'           : this.hasError,
            'md-stepper-optional': this.hasOptional,
            'md-editable'        : this.isEditable,
            'md-hoverable'       : !this.isEditing && (this.isActive || this.isEditable && this.isCompleted || this.isClickable),
        };
    }

    public activate() {
        let result = true;
        if (this.isClickable) {
            result = this.onClick();
        }
        if (result) {
            this.$stepper.goto(this.stepNumber);
        }
    }
}


interface StepperService {
    (handle: string): StepperCtrl;
}

let StepperServiceFactory = ['$mdComponentRegistry',
    function ($mdComponentRegistry) {
        return <StepperService>function (handle: string) {
            let instance: StepperCtrl = $mdComponentRegistry.get(handle);

            if (!instance) {
                $mdComponentRegistry.notFoundError(handle);
            }

            return instance;
        };
    }];


angular.module('mdSteppers', ['material.components.icon'])
    .factory('$mdStepper', StepperServiceFactory)

    .directive('mdStepper', () => {
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
    .directive('mdStep', ['$compile', ($compile) => {
        return {
            require: '^^mdStepper',
            transclude: true,
            scope: {
                label: '@mdLabel',
                optional: '@?mdOptional',
                editable: '<?mdEditable',
                onActivate: '&?onActivate',
                onDeactivate: '&?onDeactivate',
                onClick: '&?onClick',
                onInitialized: '&?onInitialized',
            },
            bindToController: true,
            controller: StepCtrl,
            controllerAs: '$ctrl',
            link: (scope: any, iElement: ng.IRootElementService, iAttrs, stepperCtrl: StepperCtrl) => {
                function addOverlay() {
                    let hasOverlay = !!iElement.find('.md-step-body-overlay')[0];
                    if (!hasOverlay) {
                        let overlay = angular.element(`
                            <div class="md-step-body-overlay"></div>
                            <div class="md-step-body-loading">
                                <md-progress-circular md-mode="indeterminate"></md-progress-circular>
                            </div>
                        `);
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
                    } else {
                        iElement.removeClass('md-active');
                    }
                });
            },
            templateUrl: 'mdSteppers/mdStep.tpl.html'
        };
    }])
    .directive('mdStepButton', () => {
        return {
            scope: {
                $step: '<step',
            },
            replace: true,
            templateUrl: 'mdSteppers/mdStepButton.tpl.html'
        };
    })

    // template
    .run(["$templateCache", function ($templateCache) {
        $templateCache.put('mdSteppers/mdStep.tpl.html', TEMPLATES['mdStep.tpl.html']);
        $templateCache.put('mdSteppers/mdStepButton.tpl.html', TEMPLATES['mdStepButton.tpl.html']);
        $templateCache.put('mdSteppers/mdStepper.tpl.html', TEMPLATES['mdStepper.tpl.html']);
    }])

    // icons
    .config(['$mdIconProvider', ($mdIconProvider) => {
        $mdIconProvider.icon('steppers-check', 'mdSteppers/ic_check_24px.svg');
        $mdIconProvider.icon('steppers-warning', 'mdSteppers/ic_warning_24px.svg');
        $mdIconProvider.icon('steppers-edit', 'mdSteppers/ic_edit_24px.svg');
    }])
    .run(["$templateCache", function ($templateCache) {
        $templateCache.put("mdSteppers/ic_check_24px.svg", ICONS['check.svg']);
        $templateCache.put("mdSteppers/ic_warning_24px.svg", ICONS['warning.svg']);
        $templateCache.put("mdSteppers/ic_edit_24px.svg", ICONS['edit.svg']);
    }]);
