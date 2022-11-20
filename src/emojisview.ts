import { type Locale, FocusTracker } from 'ckeditor5/src/utils';
import {
	View,
	type ViewCollection
} from 'ckeditor5/src/ui';

import '../theme/emojis-dropdown.css';
import type EmojiNavigationView from './emojinavigationview';

export default class EmojisView extends View {
	private items: ViewCollection<View>;
	private focusTracker: FocusTracker;
	private navigationView: EmojiNavigationView;
	private gridView: View;

	constructor( locale: Locale, navigationView: EmojiNavigationView, gridView: View ) {
		super( locale );

		this.items = this.createCollection();
		this.focusTracker = new FocusTracker();
		this.navigationView = navigationView;
		this.gridView = gridView;

		this.setTemplate( {
			tag: 'div',
			children: [
				this.navigationView,
				this.gridView
			],
			attributes: {
				tabindex: '-1',
				class: 'emojis2-dropdown'
			}
		} );

		this.items.add( this.navigationView );
		this.items.add( this.gridView );
	}

	public override destroy(): void {
		super.destroy();

		this.focusTracker.destroy();
	}

	public focus(): void {
		this.navigationView.focus();
	}
}
