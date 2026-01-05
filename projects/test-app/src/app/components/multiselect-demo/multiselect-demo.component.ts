import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
	DropdownItemComponent,
	DropdownListComponent,
	FormFieldComponent,
	MultiselectComponent,
} from '../../../../../front-components/src/lib/components';
import {
	ButtonType,
	ExtraSize,
	IconPosition,
	IconType,
	IDictionaryItemDto,
} from '../../../../../front-components/src/lib/shared/models';
import {
	FieldCtrlDirective,
	PopoverTriggerForDirective,
} from '../../../../../front-components/src/lib/core/directives';
import { DROPDOWN_ITEMS } from '../../utils/constants';

@Component({
	selector: 'app-multiselect-demo',
	standalone: true,
	template: `
		<div class="section">
			<h2 class="section-title">Multiselect Dropdown</h2>

			<p class="section-description">
				Multiselect component with multiple selection support and chips
				display.
			</p>

			<div class="component-row">
				<ss-lib-form-field
					[label]="'Выберите элементы'"
					[hint]="'Можно выбрать несколько элементов'"
					[errorText]="'Неверно заполнено'"
					[showValidationFieldIcon]="true"
				>
					<ss-lib-multiselect
						fieldCtrl
						[formControl]="multiselectCtrl"
						[popoverTriggerFor]="dropdown1"
						[placeholder]="'Выберите из списка'"
						[maxVisibleItems]="6"
						[showCounter]="true"
					>
						<ss-lib-dropdown-list #dropdown1>
							@for (item of dropdownItems; track item.id) {
								<ss-lib-dropdown-item
									[value]="item"
									[selected]="isItemSelected(item)"
								>
								</ss-lib-dropdown-item>
							}
						</ss-lib-dropdown-list>
					</ss-lib-multiselect>
				</ss-lib-form-field>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [
		`
			.section {
				padding: 24px;
			}

			.section-title {
				font-size: 24px;
				font-weight: 600;
				margin-bottom: 16px;
			}

			.section-description {
				font-size: 14px;
				color: var(--text-body-2);
				margin-bottom: 16px;
			}

			.component-row {
				margin-bottom: 24px;
				display: flex;
				gap: 16px;
				flex-wrap: wrap;
			}

			.selected-values {
				padding: 16px;
				border-radius: 8px;
			}

			.selected-values h3 {
				font-size: 16px;
				font-weight: 600;
				margin-bottom: 8px;
			}

			.selected-values ul {
				list-style: disc;
				padding-left: 24px;
			}

			.selected-values li {
				font-size: 14px;
				color: var(--text-body-2);
				margin-bottom: 4px;
			}
		`,
	],
	imports: [
		DropdownItemComponent,
		DropdownListComponent,
		FormFieldComponent,
		MultiselectComponent,
		FieldCtrlDirective,
		ReactiveFormsModule,
		PopoverTriggerForDirective,
	],
})
export class MultiselectDemoComponent {
	public multiselectCtrl = new FormControl<IDictionaryItemDto[] | null>(null);

	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;
	protected readonly ButtonType = ButtonType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly dropdownItems = DROPDOWN_ITEMS;

	public isItemSelected(item: IDictionaryItemDto): boolean {
		const values = this.multiselectCtrl.value || [];

		return values.some((v) => v.id === item.id);
	}
}
