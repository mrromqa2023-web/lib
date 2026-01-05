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
	signal,
	computed,
} from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { outputToObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormFieldComponent } from '../form-field/form-field.component';
import { InputComponent } from '../input/input.component';
import { DropdownListComponent } from '../dropdown';
import type { IDictionaryItemDto } from '../../shared/models';
import { ChipComponent } from '../chip/chip.component';
import { IconComponent } from '../icon/icon.component';
import { Colors, IconType } from '../../shared/models';

/**
 * Компонент выпадающего списка с множественным выбором
 *
 * @example
 * ```html
 * Параметры:
 *
 * [placeholder]: string - Текст подсказки - необязательный, по умолчанию: 'Выберите из списка'
 *
 * [formControl]: FormControl<T[] | null> - Контрол формы - обязательный
 *
 * [disabled]: boolean - Блокировка компонента - необязательный, по умолчанию: false
 *
 * [maxVisibleItems]: number - Максимальное количество видимых чипов - необязательный, по умолчанию: 3
 *
 * [showCounter]: boolean - Показывать счетчик выбранных элементов - необязательный, по умолчанию: true
 *
 * <ss-lib-multiselect
 *   [placeholder]="'Выберите значения'"
 *   [formControl]="multiselectControl"
 *   [maxVisibleItems]="3"
 * >
 *   <ss-lib-dropdown-list [items]="items"></ss-lib-dropdown-list>
 * </ss-lib-multiselect>
 * ```
 *
 * @param T - Тип элемента списка, должен реализовывать IDictionaryItemDto
 */
@Component({
	selector: 'ss-lib-multiselect',
	standalone: true,
	imports: [
		InputComponent,
		ReactiveFormsModule,
		ChipComponent,
		IconComponent,
	],
	templateUrl: './multiselect.component.html',
	styleUrl: './multiselect.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiselectComponent<
	T extends IDictionaryItemDto = IDictionaryItemDto,
> implements ControlValueAccessor
{
	public readonly placeholder = input<string>('Выберите из списка');
	public readonly maxVisibleItems = input<number>(3);
	public readonly showCounter = input<boolean>(true);

	public readonly selectCtrl = new FormControl<string | null>({
		value: null,
		disabled: true,
	});

	private readonly dropdownList = contentChild.required(
		DropdownListComponent<T>,
	);

	protected readonly selectedItems = signal<Array<T | IDictionaryItemDto>>(
		[],
	);

	protected readonly visibleItems = computed(() => {
		const items = this.selectedItems();
		const max = this.maxVisibleItems();

		return items.slice(0, max);
	});

	protected readonly hiddenItemsCount = computed(() => {
		const total = this.selectedItems().length;
		const max = this.maxVisibleItems();

		return total > max ? total - max : 0;
	});

	protected readonly displayText = computed(() => {
		const items = this.selectedItems();

		if (items.length === 0) {
			return '';
		}

		return items.map((item) => item.name).join(', ');
	});

	private onChange:
		| ((value: Array<T | IDictionaryItemDto> | null) => void)
		| undefined;

	private onTouched: (() => void) | undefined;

	protected readonly Colors = Colors;
	protected readonly IconType = IconType;

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

	public writeValue(value: Array<T | IDictionaryItemDto> | null): void {
		if (value && Array.isArray(value)) {
			this.selectedItems.set(value);
			this.updateDisplayText();
		} else {
			this.selectedItems.set([]);
			this.selectCtrl.setValue('', { emitEvent: false });
		}
	}

	public registerOnChange(
		fn: (value: Array<T | IDictionaryItemDto> | null) => void,
	): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	public setDisabledState?(isDisabled: boolean): void {
		isDisabled ? this.selectCtrl.disable() : this.selectCtrl.enable();
	}

	public onSelectOption(item: T | string | null | IDictionaryItemDto): void {
		if (item === null || typeof item === 'string') {
			return;
		}

		const currentItems = [...this.selectedItems()];
		const existingIndex = currentItems.findIndex((i) => i.id === item.id);

		if (existingIndex > -1) {
			// Удалить элемент, если он уже выбран
			currentItems.splice(existingIndex, 1);
		} else {
			// Добавить новый элемент
			currentItems.push(item);
		}

		this.selectedItems.set(currentItems);
		this.updateDisplayText();
		this.updateValue(currentItems);
	}

	public removeItem(item: T | IDictionaryItemDto): void {
		const currentItems = this.selectedItems().filter(
			(i) => i.id !== item.id,
		);

		this.selectedItems.set(currentItems);
		this.updateDisplayText();
		this.updateValue(currentItems);
	}

	public clearAll(event: Event): void {
		event.stopPropagation();

		this.selectedItems.set([]);
		this.selectCtrl.setValue('', { emitEvent: false });
		this.updateValue([]);
	}

	public isSelected(item: T | IDictionaryItemDto): boolean {
		return this.selectedItems().some((i) => i.id === item.id);
	}

	private updateDisplayText(): void {
		const text = this.displayText();

		this.selectCtrl.setValue(text, { emitEvent: false });
	}

	private updateValue(items: Array<T | IDictionaryItemDto>): void {
		this.onChange?.(items.length > 0 ? items : null);
		this.onTouched?.();
	}
}
