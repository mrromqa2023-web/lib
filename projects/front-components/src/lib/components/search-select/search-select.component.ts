import { Injector } from '@angular/core';
import {
	ChangeDetectionStrategy,
	Component,
	contentChild,
	Inject,
	input,
	Optional,
	runInInjectionContext,
	afterNextRender,
	Self,
	inject,
} from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { outputToObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormFieldComponent } from '../form-field/form-field.component';
import { InputComponent } from '../input/input.component';
import { DropdownListComponent } from '../dropdown';
import type { IDictionaryItemDto } from '../../shared/models';
import { Align, ExtraSize } from '../../shared/models';

/**
 * Компонент поискового выпадающего списка с поддержкой поиска по query
 *
 * @example
 * ```html
 * Параметры:
 *
 * [placeholder]: string - Текст подсказки - необязательный, по умолчанию: 'Введите для поиска'
 *
 * [searchCtrl]: FormControl<string | null> - Контрол для поля поиска - обязательный
 *
 * [size]: ExtraSize.md | ExtraSize.lg - Размер поля ввода - необязательный, по умолчанию: ExtraSize.lg
 *
 * [align]: Align - Выравнивание текста - необязательный, по умолчанию: Align.Start
 *
 * [type]: InputType - Тип поля ввода - необязательный, по умолчанию: InputType.Text
 *
 * [min]: unknown | undefined - Минимальное значение - необязательный, по умолчанию: undefined
 *
 * [max]: unknown | undefined - Максимальное значение - необязательный, по умолчанию: undefined
 *
 * [(ngModel)]: T | string - Значение выбранного элемента - обязательный
 *
 * [formControl]: FormControl<T | string | null> - Контрол формы - обязательный
 *
 * [disabled]: boolean - Блокировка компонента - необязательный, по умолчанию: false
 *
 * Для подписки на изменения поискового запроса используйте searchCtrl.valueChanges:
 *
 * <ss-lib-search-select
 *   [formControl]="searchSelectControl"
 *   [searchCtrl]="searchCtrl"
 *   [placeholder]="'Введите для поиска'"
 * >
 *   <ss-lib-dropdown-list [items]="items"></ss-lib-dropdown-list>
 * </ss-lib-search-select>
 *
 * В компоненте:
 * searchCtrl = new FormControl<string | null>(null);
 *
 * ngOnInit() {
 *   this.searchCtrl.valueChanges
 *     .pipe(debounceTime(300), distinctUntilChanged())
 *     .subscribe(query => {
 *       if (query) {
 *         this.onSearch(query);
 *       }
 *     });
 * }
 * ```
 *
 * @param T - Тип элемента списка, должен реализовывать IDictionaryItemDto
 */
@Component({
	selector: 'ss-lib-search-select',
	standalone: true,
	imports: [InputComponent, ReactiveFormsModule],
	templateUrl: './search-select.component.html',
	styleUrl: './search-select.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchSelectComponent<
	T extends IDictionaryItemDto = IDictionaryItemDto,
> implements ControlValueAccessor
{
	public readonly placeholder = input<string>('Введите для поиска');
	public readonly searchCtrl = input.required<FormControl<string | null>>();
	public readonly size = input<ExtraSize.md | ExtraSize.lg>(ExtraSize.lg);
	public readonly align = input<Align>(Align.Start);
	private readonly dropdownList = contentChild.required(
		DropdownListComponent<T>,
	);

	private onChange:
		| ((value: T | string | null | IDictionaryItemDto) => void)
		| undefined;

	private onTouched: (() => void) | undefined;

	constructor(
		@Optional()
		@Self()
		@Inject(NgControl)
		public ngControl: NgControl,
		@Optional() public formField: FormFieldComponent,
		private readonly injector: Injector = inject(Injector),
	) {
		if (this.ngControl) {
			this.ngControl.valueAccessor = this;
		}

		// Подписка на выбор элемента из dropdown
		afterNextRender(() => {
			runInInjectionContext(this.injector, () => {
				toSignal(
					outputToObservable(this.dropdownList().value).pipe(
						tap((data) => this.onSelectOption(data)),
					),
				);
			});
		});
	}

	public writeValue(value: T | string): void {
		const displayValue =
			typeof value === 'string' ? value : value?.name || '';

		this.searchCtrl().setValue(displayValue, { emitEvent: false });
	}

	public registerOnChange(
		fn: (value: T | string | null | IDictionaryItemDto) => void,
	): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	public setDisabledState?(isDisabled: boolean): void {
		isDisabled ? this.searchCtrl().disable() : this.searchCtrl().enable();
	}

	public onSelectOption(item: T | string | null | IDictionaryItemDto): void {
		if (item !== null) {
			const displayValue = typeof item === 'string' ? item : item.name;

			this.searchCtrl().setValue(displayValue, { emitEvent: false });
			this.updateValue(item);
		}
	}

	private updateValue(item: T | string | null | IDictionaryItemDto): void {
		this.onChange?.(item);
		this.onTouched?.();
	}
}
