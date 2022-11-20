import { createDropdown } from 'ckeditor5/src/ui';
import { Plugin, type Editor } from 'ckeditor5/src/core';
import type { Locale } from 'ckeditor5/src/utils';
import type { EditorWithUI } from 'ckeditor__ckeditor5-core/src/editor/editorwithui';
import ckeditor5Icon from '../theme/icons/grining.svg';
import EmojiGridView from './emojigridview';
import EmojiNavigationView from './emojinavigationview';
import EmojisView from './emojisview';
import {
	ATTR_EMOJI_NAME,
	ATTR_EMOJI_IMG,
	type Emoji,
	EMOJI_CLASS,
	SCHEMA_NAME,
	ATTR_EMOJI_KEY
} from './constants';

export default class EmojiUI extends Plugin {
	private classEmoji: string;
	private defaultGroup: string;

	public static override get pluginName(): string {
		return 'EmojiUI';
	}
	private _groups: Map<string, Array<Emoji>>;

	constructor( editor: Editor ) {
		super( editor );
		this._groups = this.editor.config.get( 'emoji2.groups' );
		if ( !this._groups || this._groups.size === 0 ) {
			throw 'Emoji2: missing config `groups`';
		}
		this.defaultGroup = this.editor.config.get( 'emoji2.defaultGroup' ) || this._groups?.keys().next().value;
		this.classEmoji = this.editor.config.get( 'emoji2.class' ) || EMOJI_CLASS;
	}

	public override init(): void {
		const editor = this.editor as EditorWithUI;

		editor.ui.componentFactory.add( 'emoji2', locale => {
			const dropdownView = createDropdown( locale );
			let dropdownPanelContent: any;
			const t = editor.t;
			const model = editor.model;

			dropdownView.buttonView.set( {
				label: t( 'Emoji plugin' ),
				icon: ckeditor5Icon
			} );

			dropdownView.on( 'execute', ( evt, data: Emoji ) => {
				model.change( writer => {
					const imageElement = writer.createElement( SCHEMA_NAME, {
						[ ATTR_EMOJI_KEY ]: data.key || '',
						[ ATTR_EMOJI_NAME ]: data.name || '',
						[ ATTR_EMOJI_IMG ]: data.imgUrl
					} );
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore: avoid error when emoji place at the end of code block,
					// can't move the cursor there because of missing element data
					// TODO find better way
					imageElement.data = data.name || '';
					model.insertContent(
						imageElement
					);
				} );
				editor.editing.view.focus();
			} );

			dropdownView.on( 'change:isOpen', ( evt, propertyName, newValue, oldValue ) => {
				if ( !dropdownPanelContent ) {
					dropdownPanelContent = this._createDropdownPanelContent( locale, dropdownView );

					const specialCharactersView = new EmojisView(
						locale,
						dropdownPanelContent.navigationView,
						dropdownPanelContent.gridView
					);

					dropdownView.panelView.children.add( specialCharactersView );
				}

				if ( !newValue ) {
					dropdownPanelContent.navigationView.setSelectedGroup( this.defaultGroup );
					this._updateGrid( this.defaultGroup, dropdownPanelContent.gridView );
				}
			} );
			return dropdownView;
		} );
	}

	private getEmojisForGroup( groupName: string ) {
		return this._groups.get( groupName );
	}

	private _updateGrid( currentGroupName: string, gridView: EmojiGridView ) {
		gridView.clearTitles();

		const emojiDatas = this.getEmojisForGroup( currentGroupName );

		if ( !emojiDatas ) {
			console.warn( 'emoji does not exist' );
			return;
		}

		for ( const emojiData of emojiDatas ) {
			gridView.addTitle( gridView.createTile( emojiData ) );
		}
	}

	private _createDropdownPanelContent( locale: Locale, dropdownView: any ) {
		const emojiGroups = [ ...this._groups.keys() ];

		const navigationView = new EmojiNavigationView( locale, emojiGroups, this.defaultGroup );
		const gridView = new EmojiGridView( locale, this.classEmoji );

		gridView.delegate( 'execute' ).to( dropdownView );

		navigationView.on( 'execute', ( evt, data ) => {
			this._updateGrid( data.group, gridView );
		} );

		this._updateGrid( this.defaultGroup, gridView );

		return { navigationView, gridView };
	}
}
