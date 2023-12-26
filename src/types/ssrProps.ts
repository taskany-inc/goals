import { GetServerSideProps } from 'next';

interface R {
    [key: string]: any;
}
type ParserQuery = Record<string, string>;

export type SSRProps<Q extends ParserQuery = ParserQuery> = GetServerSideProps<R, Q>;

export type SSRPageProps<P = unknown> = P;
