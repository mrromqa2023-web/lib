import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ChipComponent } from '../../../../../front-components/src/lib/components';

@Component({
	selector: 'app-chip-demo',
	standalone: true,
	template: ` <div class="section">
		<h2 class="section-title">Chip Component</h2>

		<p class="section-description">
			Chip component for displaying selected items with remove
			functionality.
		</p>

		<div class="component-row">
			<h3 class="subsection-title">Default Chips</h3>
			<div class="chips-container">
				<ss-lib-chip
					[label]="'Removable Chip'"
					(remove)="onRemove('Removable Chip')"
				></ss-lib-chip>

				<ss-lib-chip
					[label]="'Non-removable Chip'"
					[removable]="false"
				></ss-lib-chip>

				<ss-lib-chip
					[label]="'Disabled Chip'"
					[disabled]="true"
				></ss-lib-chip>
			</div>
		</div>

		<div class="component-row">
			<h3 class="subsection-title">Long Text Chips (with ellipsis)</h3>
			<div class="chips-container">
				<ss-lib-chip
					[label]="
						'Very long chip text that should be truncated with ellipsis'
					"
					(remove)="onRemove('Long text')"
				></ss-lib-chip>

				<ss-lib-chip
					[label]="'Another long chip with a lot of text content'"
					(remove)="onRemove('Long text 2')"
				></ss-lib-chip>
			</div>
		</div>

		<div class="component-row">
			<h3 class="subsection-title">Interactive Example</h3>
			<div class="chips-container">
				@for (item of items(); track item) {
					<ss-lib-chip
						[label]="item"
						(remove)="removeFromList(item)"
					></ss-lib-chip>
				}
			</div>

			@if (items().length === 0) {
				<p class="empty-message">Все чипы удалены</p>
			}
		</div>

		@if (removedChips().length > 0) {
			<div class="component-row">
				<div class="info-panel">
					<h4>Последние удаленные чипы:</h4>
					<ul>
						@for (chip of removedChips(); track $index) {
							<li>{{ chip }}</li>
						}
					</ul>
				</div>
			</div>
		}
	</div>`,
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
				margin-bottom: 24px;
			}

			.component-row {
				margin-bottom: 32px;
			}

			.subsection-title {
				font-size: 16px;
				font-weight: 600;
				margin-bottom: 12px;
				color: var(--text-body);
			}

			.chips-container {
				display: flex;
				flex-wrap: wrap;
				gap: 8px;
				padding: 16px;
				background: var(--background-body-2);
				border-radius: 8px;
			}

			.empty-message {
				padding: 16px;
				text-align: center;
				color: var(--text-body-3);
				font-style: italic;
			}

			.info-panel {
				padding: 16px;
				background: var(--background-information);
				border-radius: 8px;
				border: 1px solid var(--border-information);
			}

			.info-panel h4 {
				font-size: 14px;
				font-weight: 600;
				margin-bottom: 8px;
				color: var(--text-information);
			}

			.info-panel ul {
				list-style: disc;
				padding-left: 24px;
			}

			.info-panel li {
				font-size: 14px;
				color: var(--text-body-2);
				margin-bottom: 4px;
			}
		`,
	],
	imports: [ChipComponent],
})
export class ChipDemoComponent {
	public items = signal<string[]>([
		'JavaScript',
		'TypeScript',
		'Angular',
		'React',
		'Vue',
		'Node.js',
	]);

	public removedChips = signal<string[]>([]);

	public onRemove(chipLabel: string): void {
		this.removedChips.update((chips) => [chipLabel, ...chips].slice(0, 5));
	}

	public removeFromList(item: string): void {
		this.items.update((items) => items.filter((i) => i !== item));
		this.removedChips.update((chips) => [item, ...chips].slice(0, 5));
	}
}
