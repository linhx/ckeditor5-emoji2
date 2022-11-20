declare module '*.svg' {
	const content: string;
	export default content;
}

declare module 'ckeditor5/src/core' {
	export * from 'ckeditor__ckeditor5-core';
}

declare module 'ckeditor5/src/ui' {
	export * from 'ckeditor__ckeditor5-ui';
}

declare module 'ckeditor5/src/utils' {
	export * from 'ckeditor__ckeditor5-utils';
}

declare module 'ckeditor5/src/ui/template' {
	export * from 'ckeditor__ckeditor5-ui/src/template';
}

declare module 'ckeditor5/src/widget' {
	export * from 'ckeditor__ckeditor5-widget';
}

declare module 'ckeditor5/src/engine' {
	export * from 'ckeditor__ckeditor5-engine';
}
