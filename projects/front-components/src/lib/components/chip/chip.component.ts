import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { TextComponent } from '../text/text.component';
import { Colors, IconType, TextType, TextWeight } from '../../shared/models';

/**
 * Компонент chip (чип) для отображения выбранных элементов с возможностью удаления
 *
 * @example
 * ```html
 * Параметры:
 *
 * [label]: string - Текст чипа - обязательный
 *
 * [removable]: boolean - Показывать кнопку удаления - необязательный, по умолчанию: true
 *
 * [disabled]: boolean - Заблокировать чип - необязательный, по умолчанию: false
 *
 * (remove): void - Событие удаления чипа - необязательный
 *
 * <ss-lib-chip
 *   [label]="'Элемент 1'"
 *   [removable]="true"
 *   (remove)="onRemove()"
 * ></ss-lib-chip>
 * ```
 */
@Component({
	selector: 'ss-lib-chip',
	standalone: true,
	imports: [IconComponent, TextComponent],
	templateUrl: './chip.component.html',
	styleUrl: './chip.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
	public readonly label = input.required<string>();
	public readonly removable = input<boolean>(true);
	public readonly disabled = input<boolean>(false);

	public readonly remove = output<void>();

	protected readonly IconType = IconType;
	protected readonly Colors = Colors;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;

	public onRemove(event: Event): void {
		event.stopPropagation();

		if (!this.disabled()) {
			this.remove.emit();
		}
	}
}
