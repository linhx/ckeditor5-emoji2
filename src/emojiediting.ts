import { type Element, type DowncastWriter } from 'ckeditor5/src/engine';
import { Widget, toWidget, viewToModelPositionOutsideModelElement } from 'ckeditor5/src/widget';
import { Plugin, type Editor } from 'ckeditor5/src/core';
import { ATTR_EMOJI_NAME, ATTR_EMOJI_IMG, EMOJI_CLASS, HTML_TAG_NAME, SCHEMA_NAME, ATTR_EMOJI_KEY } from './constants';

export default class EmojiEditing extends Plugin {
	private tagName: string;
	private classEmoji: string;

	public static override get requires(): Array<typeof Plugin> {
		return [ Widget ];
	}
	public static override get pluginName(): string {
		return 'EmojiEditing';
	}

	public constructor( editor: Editor ) {
		super( editor );
		this.tagName = HTML_TAG_NAME;
		this.classEmoji = this.editor.config.get( 'emoji2.class' ) || EMOJI_CLASS;
	}

	public override init(): void {
		this._defineSchema();
		this._defineConverters();
		this.editor.editing.mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement( this.editor.model,
				viewElement => {
					const classes = viewElement.getClassNames();
					const isImg = viewElement.name === this.tagName;
					let hasEmojiClass = false;
					for ( const clazz of classes ) {
						if ( clazz === this.classEmoji ) {
							hasEmojiClass = true;
						}
					}
					return isImg && hasEmojiClass;
				} )
		);
	}

	private _defineSchema(): void {
		const schema = this.editor.model.schema;

		schema.register( SCHEMA_NAME, {
			inheritAllFrom: '$text',
			allowAttributes: [ ATTR_EMOJI_KEY, ATTR_EMOJI_NAME, ATTR_EMOJI_IMG ]
		} );
	}

	private _defineConverters(): void {
		const conversion = this.editor.conversion;

		const createEmojiElement = ( element: Element, writer: DowncastWriter ) => {
			const emojiKey = String( element.getAttribute( ATTR_EMOJI_KEY ) );
			const emojiName = String( element.getAttribute( ATTR_EMOJI_NAME ) );
			const imgUrl = String( element.getAttribute( ATTR_EMOJI_IMG ) );

			const emoji = writer.createContainerElement( this.tagName, {
				class: this.classEmoji,
				src: imgUrl,
				alt: emojiKey,
				title: emojiName
			} );
			return emoji;
		};

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: SCHEMA_NAME,
			view: ( element, conversionApi ) => {
				return createEmojiElement( element, conversionApi.writer );
			},
			converterPriority: 'high'
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: SCHEMA_NAME,
			view: ( modelItem, { writer: viewWriter } ) => {
				const emojiElement = createEmojiElement( modelItem, viewWriter );

				return toWidget( emojiElement, viewWriter );
			},
			converterPriority: 'high'
		} );

		conversion.for( 'upcast' ).elementToElement( {
			view: {
				name: this.tagName,
				classes: [ this.classEmoji ]
			},
			model: ( viewElement, { writer: modelWriter } ) => {
				const key = viewElement.getAttribute( 'alt' ) || '';
				const name = viewElement.getAttribute( 'title' ) || '';
				const url = viewElement.getAttribute( 'src' );
				if ( url ) {
					const emojiElement = modelWriter.createElement( SCHEMA_NAME, {
						[ ATTR_EMOJI_KEY ]: key,
						[ ATTR_EMOJI_NAME ]: name,
						[ ATTR_EMOJI_IMG ]: url
					} );
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore: avoid error when emoji place at the end of code block,
					// can't move the cursor there because of missing element data
					// TODO find better way
					emojiElement.data = name;
					return emojiElement;
				}
				return null;
			},
			converterPriority: 'high'
		} );
	}
}
