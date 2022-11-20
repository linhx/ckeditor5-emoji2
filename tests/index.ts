import { expect } from 'chai';
import { Emoji as EmojiDll, icons } from '../src';
import Emoji2 from '../src/emoji';
import ckeditor from './../theme/icons/grining.svg';

describe( 'CKEditor5 Emoji DLL', () => {
	it( 'exports Emoji', () => {
		expect( EmojiDll ).to.equal( Emoji2 );
	} );

	describe( 'icons', () => {
		it( 'exports the "ckeditor" icon', () => {
			expect( icons.ckeditor ).to.equal( ckeditor );
		} );
	} );
} );
