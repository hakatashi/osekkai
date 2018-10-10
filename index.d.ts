// Type definitions for osekkai
// Definitions by: Koki Takahashi <hakatasiloving@gmail.com>

export = osekkai;

declare function osekkai(chunks: string | string[], options?: osekkai.OsekkaiOptions): osekkai.OsekkaiClass;

declare namespace osekkai {
	export const defaultConfig: OsekkaiOptions;
	export const Osekkai: OsekkaiClass;

	export interface PlainToken {
		type: 'plain';
		text: string;
	}

	export interface UprightToken {
		type: 'upright';
		text: string;
		original: string;
	}

	export interface AlterToken {
		type: 'alter';
		text: string;
		original: string;
	}

	export interface MarginToken {
		type: 'margin';
		text: string;
		original: string;
		length: number;
	}

	export type Token = PlainToken | UprightToken | AlterToken | MarginToken;

	export interface Chunk {
		getText(): string;
		tokens: Token[];
	}

	export interface OsekkaiOptions {
		converters?: 'default' | 'vectical' | ConverterOptionHash;
		joinableTokens?: string[];
	}

	export type ConverterTypes =
		'exclamations'
		| 'numbers'
		| 'alphabetUpright'
		| 'alphabetMargin'
		| 'quotations'
		| 'dashes';
	export type FormatterTypes = 'plain' | 'object' | 'aozora';

	export interface ConverterOptions {
		length?: number;
	}
	export type ConverterOptionHash = {
		[converter in ConverterTypes]?: ConverterOptions | true;
	};

	export interface FormatterOptions {
		entities?: 'aozora' | 'publishing' | {[token: string]: string};
	}

	export class OsekkaiClass {
		constructor(chunks: string | string[], options?: OsekkaiOptions);
		convert(converters: ConverterOptionHash | ConverterTypes, options?: ConverterOptions): OsekkaiClass;
		format(formatter: FormatterTypes, options?: FormatterOptions): Token[] | Token[][];
		substr(start: number, length: number): Chunk[];
	}
}