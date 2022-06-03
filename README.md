# LearnAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

<hr>
<br>
<br>

# Notes:

> @Component({
> `selector`: 'smth',
> }) <br>

- Selector can be not only tag https://angular.io/api/core/Directive#selector. We kind of hang our logic on the markup element, and indicate the angular how to find this markup element;
- `4` Ways of Databinding (communication between `ts` and `html`): String Interpolation, Property Binding, Event Binding, Two-Way-Databinding;
- `@ViewChild` and `@ContentChild` static prop - `true` to resolve query results before change detection runs, false to resolve after change detection. Defaults to false (https://angular.io/guide/static-query-migration);
- Lifecycle hooks:<br> ![hooks diagram](./src/assets/lifecycle-hooks.png);
- Use Renderer2 instead of directly accessing the DOM (e.g. for styling);
- `HostListener('eventName')` - can also listen to custom events (can be useful in custom directives);
- `@HostBinding('style.backgroundColor') backgroundColor = 'transparent'` - nice way for accessing host element properties (e.g. for styling);
- To use the directive also as an input we need to add an alias for `@Input('alias')` with the same name as a directive selector or just use the same name for input property.
- Providers in Providers array are hierarchical. If we provide service inside component providers, then it will be available for this component and it's child components. This will even overwrite if we were to provide the same service on a higher level.
