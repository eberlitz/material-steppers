# material-steppers

Angular Steppers directive for Angular Material

Based on Material Steppers: https://www.google.com/design/spec/components/steppers.html#steppers-types-of-steppers

## Demo

https://eberlitz.github.io/material-steppers/demo

## Usage

###  using bower

```shell
bower install material-steppers --save
```

### or using npm

```shell
npm install material-steppers --save
```

### Add to your module

```javascript
angular.module('app', ['ngMaterial', 'mdSteppers']);
```

### Write your html

```html      
<md-stepper id="stepper-demo" 
    md-mobile-step-text="vm.isMobileStepText" 
    md-vertical="vm.isVertical" 
    md-linear="vm.isLinear"
    md-alternative="vm.isAlternative">
    <md-step md-label="Select a campaign">
        <md-step-body>
            <p>...</p>
        </md-step-body>
        <md-step-actions>
            <md-button class="md-primary md-raised" ng-click="vm.selectCampaign();">Continue</md-button>
            <md-button class="md-primary" ng-click="vm.cancel();">Cancel</md-button>
        </md-step-actions>
    </md-step>
</md-stepper>
```


# TODO

- [DONE] Horizontal steppers
- [DONE] Vertical steppers
- [DONE] Linear steppers
- [DONE] Non-linear steppers
- [DONE] Alternative labels
- [DONE] Optional steps
- [TODO] Editable steps
- [DONE] Stepper feedback
- Mobile steppers
    - [DONE] Mobile step text
    - [TODO] Mobile step dots
    - [TODO] Mobile step progress bar
- [TODO] Correct apply styles (css) of the material design
- [TODO] Embed SVG assets


# `$mdStepper` Service




## License

The MIT License (MIT)

Copyright (c) 2016 Eduardo Eidelwein Berlitz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.