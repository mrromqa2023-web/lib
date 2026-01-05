import {
	ChangeDetectionStrategy,
	Component,
	signal,
	OnDestroy,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import {
	DropdownItemComponent,
	DropdownListComponent,
	FormFieldComponent,
	SearchSelectComponent,
} from '../../../../../front-components/src/lib/components';
import { IDictionaryItemDto } from '../../../../../front-components/src/lib/shared/models';
import {
	FieldCtrlDirective,
	PopoverTriggerForDirective,
} from '../../../../../front-components/src/lib/core/directives';
import { DROPDOWN_ITEMS } from '../../utils/constants';

@Component({
	selector: 'app-search-select-demo',
	standalone: true,
	template: `
		<div class="section">
			<h2 class="section-title">Search Select</h2>

			<p class="section-description">
				Search select component with server-side search functionality.
				Type in the input field to trigger search queries.
			</p>

			<div class="component-row">
				<ss-lib-form-field
					[label]="'Поиск элемента'"
					[hint]="'Введите текст для поиска'"
					[errorText]="'Неверно заполнено'"
					[showValidationFieldIcon]="true"
				>
					<ss-lib-search-select
						fieldCtrl
						[formControl]="searchSelectCtrl"
						[searchCtrl]="searchCtrl"
						[popoverTriggerFor]="dropdown1"
						[placeholder]="'Введите для поиска'"
					>
						<ss-lib-dropdown-list #dropdown1>
							@for (item of filteredItems(); track item.id) {
								<ss-lib-dropdown-item [value]="item">
									{{ item.name }}
								</ss-lib-dropdown-item>
							}
							@if (
								filteredItems().length === 0 && searchQuery()
							) {
								<div class="no-results">Ничего не найдено</div>
							}
						</ss-lib-dropdown-list>
					</ss-lib-search-select>
				</ss-lib-form-field>
			</div>

			<div class="info-section">
				<h3 class="info-title">Выбранное значение:</h3>
				@if (searchSelectCtrl.value) {
					<div class="selected-value">
						{{
							typeof searchSelectCtrl.value === 'string'
								? searchSelectCtrl.value
								: searchSelectCtrl.value.name
						}}
					</div>
				} @else {
					<div class="no-value">Значение не выбрано</div>
				}
			</div>

			<div class="info-section">
				<h3 class="info-title">Последний поисковый запрос:</h3>
				<div class="query-value">
					{{ searchQuery() || 'Нет запросов' }}
				</div>
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

			.info-section {
				margin-top: 24px;
				padding: 16px;
				background: var(--background-body-2);
				border-radius: 8px;
			}

			.info-title {
				font-size: 16px;
				font-weight: 600;
				margin-bottom: 8px;
			}

			.selected-value,
			.query-value {
				font-size: 14px;
				color: var(--text-body-1);
				padding: 8px;
				background: var(--background-body-1);
				border-radius: 4px;
			}

			.no-value {
				font-size: 14px;
				color: var(--text-body-2);
				font-style: italic;
			}

			.no-results {
				padding: 16px;
				text-align: center;
				color: var(--text-body-2);
				font-size: 14px;
			}
		`,
	],
	imports: [
		DropdownItemComponent,
		DropdownListComponent,
		FormFieldComponent,
		SearchSelectComponent,
		FieldCtrlDirective,
		ReactiveFormsModule,
		PopoverTriggerForDirective,
	],
})
export class SearchSelectDemoComponent implements OnDestroy {
	public searchSelectCtrl = new FormControl<
		IDictionaryItemDto | string | null
	>(null);

	public searchCtrl = new FormControl<string | null>(null);

	protected readonly allItems = DROPDOWN_ITEMS;
	protected readonly filteredItems = signal<IDictionaryItemDto[]>([]);
	protected readonly searchQuery = signal<string>('');

	private readonly querySubscription: Subscription;

	constructor() {
		// Подписка на изменения поискового запроса с debounce
		this.querySubscription = this.searchCtrl.valueChanges
			.pipe(debounceTime(300), distinctUntilChanged())
			.subscribe((query) => {
				if (query !== null && query !== '') {
					this.onSearchQuery(query);
				}
			});
	}

	public ngOnDestroy(): void {
		if (this.querySubscription) {
			this.querySubscription.unsubscribe();
		}
	}

	/**
	 * Обработчик изменения поискового запроса
	 * В реальном приложении здесь будет запрос на сервер
	 */
	private onSearchQuery(query: string): void {
		this.searchQuery.set(query);

		// Имитация серверного поиска - фильтрация по имени
		// В реальном приложении здесь будет HTTP запрос
		const filtered = this.allItems.filter((item) =>
			item.name.toLowerCase().includes(query.toLowerCase()),
		);

		this.filteredItems.set(filtered);
	}
}
