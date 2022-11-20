import { expect } from 'chai';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Emoji2 from '../src/emoji';

import type { EditorWithUI } from 'ckeditor__ckeditor5-core/src/editor/editorwithui';
import type { DataApi } from 'ckeditor__ckeditor5-core/src/editor/utils/dataapimixin';

interface Editor extends EditorWithUI, DataApi {}

describe( 'Emoji', () => {
	it( 'should be named', () => {
		expect( Emoji2.pluginName ).to.equal( 'Emoji' );
	} );

	describe( 'init()', () => {
		let domElement: HTMLElement, editor: Editor;

		beforeEach( async () => {
			domElement = document.createElement( 'div' );
			document.body.appendChild( domElement );

			editor = await ClassicEditor.create( domElement, {
				plugins: [
					Paragraph,
					Heading,
					Essentials,
					Emoji2
				],
				toolbar: [
					'emoji2'
				]
			} );
		} );

		afterEach( () => {
			domElement.remove();
			return editor.destroy();
		} );

		it( 'should load Emoji', () => {
			const emojiPlugin = editor.plugins.get( 'Emoji' );

			expect( emojiPlugin ).to.be.an.instanceof( Emoji2 );
		} );

		it( 'should add an icon to the toolbar', () => {
			expect( editor.ui.componentFactory.has( 'emoji2' ) ).to.equal( true );
		} );
	} );
} );
