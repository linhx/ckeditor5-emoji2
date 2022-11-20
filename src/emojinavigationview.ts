import { type Locale } from 'ckeditor5/src/utils';
import {
	View,
	ButtonView
} from 'ckeditor5/src/ui';

import '../theme/navigation.css';

export default class EmojiNavigationView extends View {
	constructor( locale: Locale, emojiGroups: Array<string>, initGroup: string ) {
		super( locale );

		const emojiBtns = emojiGroups.map( group => {
			const btn = new ButtonView( locale );
			btn.set( {
				withText: false,
				title: group,
				class: `${ initGroup === group ? 'active ' : '' }group group-${ group }`
			} );
			this.on( 'change:selectedGroup', ( evt, propertyName, newValue, oldValue ) => {
				btn.set( {
					class: `${ newValue === group ? 'active ' : '' }group group-${ group }`
				} );
			} );
			btn.on( 'execute', () => {
				this.set( {
					selectedGroup: group
				} );
				this.fire( 'execute', { group } );
			} );

			return btn;
		} );
		this.setTemplate( {
			tag: 'div',
			attributes: {
				class: 'emoji2-navi',
				tabindex: '-1'
			},
			children: emojiBtns
		} );
	}

	public setSelectedGroup( selectedGroup: string ): void {
		this.set( {
			selectedGroup
		} );
	}

	public focus(): void {
		//
	}
}
