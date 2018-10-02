// Type definitions for osekkai
// Definitions by: Koki Takahashi <hakatasiloving@gmail.com>

export = osekkai;

interface PlainToken {
	type: 'plain';
	text: string;
}

interface UprightToken {
	type: 'upright';
	text: string;
	original: string;
}

interface AlterToken {
	type: 'alter';
	text: string;
	original: string;
}

interface MarginToken {
	type: 'margin';
	text: string;
	original: string;
	length: number;
}

type Token = PlainToken | UprightToken | AlterToken | MarginToken;

interface Chunk {
	getText(): string;
	tokens: Token[];
}

interface OsekkaiOptions {
	converters?: 'default' | 'vectical' | ConverterOptionHash;
	joinableTokens?: string[];
}

type ConverterTypes =
	'exclamations'
	| 'numbers'
	| 'alphabetUpright'
	| 'alphabetMargin'
	| 'quotations'
	| 'dashes';
type FormatterTypes = 'plain' | 'object' | 'aozora';

interface ConverterOptions {
	length?: number;
}
type ConverterOptionHash = {
	[converter in ConverterTypes]?: ConverterOptions | true;
};

interface FormatterOptions {
	entities?: 'aozora' | 'publishing' | {[token: string]: string};
}

declare class Osekkai {
	constructor(chunks: string | string[], options?: OsekkaiOptions);
	convert(converters: ConverterOptionHash | ConverterTypes, options?: ConverterOptions): Osekkai;
	format(formatter: FormatterTypes, options?: FormatterOptions): Token[];
	substr(start: number, length: number): Chunk[];
}

declare function osekkai(chunks: string | string[], options?: OsekkaiOptions): Osekkai;

declare namespace osekkai {
	export const defaultConfig: OsekkaiOptions;
	export const Osekkai: Osekkai;
}